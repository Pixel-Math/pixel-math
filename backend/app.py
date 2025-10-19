from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import Config
from models import db, User, ReadingProgress, OverallProgress

app = Flask(__name__)
app.config.from_object(Config)

# Inicializar extensões
CORS(app, resources={r"/api/*": {"origins": "*"}})
jwt = JWTManager(app)
db.init_app(app)

# ==================== ROTAS DE AUTENTICAÇÃO ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registra um novo usuário"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Username, email e password são obrigatórios'}), 400
    
    # Verificar se usuário já existe
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username já existe'}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email já cadastrado'}), 409
    
    # Criar novo usuário
    user = User(
        username=data['username'],
        email=data['email']
    )
    user.set_password(data['password'])
    
    try:
        db.session.add(user)
        db.session.commit()
        
        # Gerar token de acesso
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Usuário registrado com sucesso',
            'user': user.to_dict(),
            'access_token': access_token
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao registrar usuário: {str(e)}'}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Faz login de um usuário"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username e password são obrigatórios'}), 400
    
    # Buscar usuário
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Credenciais inválidas'}), 401
    
    # Gerar token de acesso
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'Login realizado com sucesso',
        'user': user.to_dict(),
        'access_token': access_token
    }), 200


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Retorna o usuário atual autenticado"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404
    
    return jsonify({'user': user.to_dict()}), 200


# ==================== ROTAS DE PROGRESSO DE LEITURA ====================

@app.route('/api/progress', methods=['GET'])
@jwt_required()
def get_all_progress():
    """Retorna todo o progresso de leitura do usuário"""
    user_id = get_jwt_identity()
    
    progress_list = ReadingProgress.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        'progress': [p.to_dict() for p in progress_list]
    }), 200


@app.route('/api/progress/<chapter_key>', methods=['GET'])
@jwt_required()
def get_chapter_progress(chapter_key):
    """Retorna o progresso de um capítulo específico"""
    user_id = get_jwt_identity()
    
    progress = ReadingProgress.query.filter_by(
        user_id=user_id,
        chapter_key=chapter_key
    ).first()
    
    if not progress:
        return jsonify({
            'progress': {
                'chapter_key': chapter_key,
                'progress': 0.0,
                'last_position': 0,
                'completed': False
            }
        }), 200
    
    return jsonify({'progress': progress.to_dict()}), 200


@app.route('/api/progress/<chapter_key>', methods=['POST'])
@jwt_required()
def save_progress(chapter_key):
    """Salva ou atualiza o progresso de leitura de um capítulo - sempre mantém o MÁXIMO"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Dados não fornecidos'}), 400
    
    # Buscar progresso existente
    progress = ReadingProgress.query.filter_by(
        user_id=user_id,
        chapter_key=chapter_key
    ).first()
    
    try:
        new_progress_value = min(max(float(data.get('progress', 0.0)), 0.0), 1.0)
        new_position = int(data.get('last_position', 0))
        new_completed = bool(data.get('completed', False))
        
        if progress:
            # Atualizar progresso existente APENAS se for MAIOR
            if new_progress_value > progress.progress:
                progress.progress = new_progress_value
                progress.last_position = new_position
                progress.completed = new_completed or progress.completed
            # Se o progresso for menor, mantém o existente mas atualiza a posição se for maior
            else:
                if new_position > progress.last_position:
                    progress.last_position = new_position
                # Mesmo sem aumentar progresso, se vier completed=True, persiste
                if new_completed:
                    progress.completed = True
        else:
            # Criar novo progresso
            progress = ReadingProgress(
                user_id=user_id,
                chapter_key=chapter_key,
                progress=new_progress_value,
                last_position=new_position,
                completed=new_completed
            )
            db.session.add(progress)
        
        # Após salvar o progresso do capítulo, recalcular e persistir o progresso geral
        recalc_and_persist_overall_progress(user_id)

        db.session.commit()
        
        return jsonify({
            'message': 'Progresso salvo com sucesso',
            'progress': progress.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao salvar progresso: {str(e)}'}), 500


def recalc_and_persist_overall_progress(user_id: int):
    """Recalcula a média de progresso do usuário considerando todos os capítulos
    do arquivo chapters.json e persiste na tabela OverallProgress.
    Capítulos sem registro contam como 0.0.
    """
    import json, os

    chapters_file = os.path.join(os.path.dirname(__file__), '..', 'assets', 'files', 'livro_epub', 'chapters.json')
    try:
        with open(chapters_file, 'r', encoding='utf-8') as f:
            chapters = json.load(f)
    except Exception:
        chapters = []

    total = len(chapters)
    if total == 0:
        overall = 0.0
        completed_count = 0
    else:
        # Mapa dos progressos existentes
        progresses = ReadingProgress.query.filter_by(user_id=user_id).all()
        prog_map = {p.chapter_key: float(p.progress or 0.0) for p in progresses}
        values = [prog_map.get(c['key'], 0.0) for c in chapters]
        overall = sum(values) / total
        completed_count = sum(1 for v in values if v >= 0.999)

    record = OverallProgress.query.filter_by(user_id=user_id).first()
    if not record:
        record = OverallProgress(user_id=user_id, overall_progress=overall, chapters_completed=completed_count)
        db.session.add(record)
    else:
        record.overall_progress = overall
        record.chapters_completed = completed_count


@app.route('/api/progress/overall', methods=['GET'])
@jwt_required()
def get_overall_progress():
    """Retorna o progresso geral persistido; se ausente, calcula e cria."""
    user_id = get_jwt_identity()
    record = OverallProgress.query.filter_by(user_id=user_id).first()
    if not record:
        recalc_and_persist_overall_progress(user_id)
        record = OverallProgress.query.filter_by(user_id=user_id).first()
    return jsonify({'overall': record.to_dict() if record else {
        'user_id': user_id,
        'overall_progress': 0.0,
        'chapters_completed': 0,
        'updated_at': None
    }}), 200


@app.route('/api/progress/<chapter_key>', methods=['DELETE'])
@jwt_required()
def delete_progress(chapter_key):
    """Remove o progresso de um capítulo"""
    user_id = get_jwt_identity()
    
    progress = ReadingProgress.query.filter_by(
        user_id=user_id,
        chapter_key=chapter_key
    ).first()
    
    if not progress:
        return jsonify({'error': 'Progresso não encontrado'}), 404
    
    try:
        db.session.delete(progress)
        # Garante que a exclusão seja considerada nos cálculos seguintes
        db.session.flush()
        # Recalcula o progresso geral após exclusão
        recalc_and_persist_overall_progress(user_id)
        db.session.commit()
        
        return jsonify({'message': 'Progresso removido com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao remover progresso: {str(e)}'}), 500


# ==================== ROTAS AUXILIARES ====================

@app.route('/api/chapters', methods=['GET'])
def get_chapters():
    """Retorna a lista de capítulos disponíveis"""
    import json
    import os
    
    chapters_file = os.path.join(os.path.dirname(__file__), '..', 'assets', 'files', 'livro_epub', 'chapters.json')
    
    try:
        with open(chapters_file, 'r', encoding='utf-8') as f:
            chapters = json.load(f)
        return jsonify({'chapters': chapters}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/chapters/<chapter_key>/content', methods=['GET'])
def get_chapter_content(chapter_key):
    """Retorna o conteúdo de um capítulo específico"""
    import json
    import os
    
    chapters_file = os.path.join(os.path.dirname(__file__), '..', 'assets', 'files', 'livro_epub', 'chapters.json')
    
    try:
        with open(chapters_file, 'r', encoding='utf-8') as f:
            chapters = json.load(f)
        
        # Encontrar o capítulo
        chapter = next((c for c in chapters if c['key'] == chapter_key), None)
        
        if not chapter:
            return jsonify({'error': 'Capítulo não encontrado'}), 404
        
        # Ler o arquivo .tex
        tex_file = os.path.join(os.path.dirname(__file__), '..', chapter['file'])
        
        with open(tex_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return jsonify({
            'chapter': chapter,
            'content': content
        }), 200
        
    except FileNotFoundError:
        return jsonify({'error': 'Arquivo do capítulo não encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica se a API está funcionando"""
    return jsonify({
        'status': 'healthy',
        'message': 'API Cálculo Digital está rodando'
    }), 200


@app.route('/', methods=['GET'])
def index():
    """Rota raiz"""
    return jsonify({
        'message': 'API Cálculo Digital 2 - Do papel ao pixel',
        'version': '1.0.0'
    }), 200


# ==================== TRATAMENTO DE ERROS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Rota não encontrada'}), 404


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Erro interno do servidor'}), 500


# ==================== INICIALIZAÇÃO ====================

if __name__ == '__main__':
    with app.app_context():
        # Criar todas as tabelas
        db.create_all()
        print("Tabelas criadas com sucesso!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
