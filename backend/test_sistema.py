"""
Script de teste para verificar a configuração do sistema
Execute: python test_sistema.py
"""

import sys
import os

def test_imports():
    """Testa se todos os módulos estão instalados"""
    print("🔍 Testando importações...")
    try:
        import flask
        print("  ✅ Flask instalado")
        import flask_cors
        print("  ✅ Flask-CORS instalado")
        import flask_jwt_extended
        print("  ✅ Flask-JWT-Extended instalado")
        import flask_sqlalchemy
        print("  ✅ Flask-SQLAlchemy instalado")
        import psycopg2
        print("  ✅ psycopg2 instalado")
        from dotenv import load_dotenv
        print("  ✅ python-dotenv instalado")
        return True
    except ImportError as e:
        print(f"  ❌ Erro: {e}")
        print("\n💡 Execute: pip install -r requirements.txt")
        return False


def test_env_file():
    """Verifica se o arquivo .env existe"""
    print("\n🔍 Testando arquivo .env...")
    if os.path.exists('.env'):
        print("  ✅ Arquivo .env encontrado")
        
        from dotenv import load_dotenv
        load_dotenv()
        
        required_vars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 
                        'FLASK_SECRET_KEY', 'JWT_SECRET_KEY']
        
        missing = []
        for var in required_vars:
            if not os.getenv(var):
                missing.append(var)
        
        if missing:
            print(f"  ⚠️  Variáveis faltando: {', '.join(missing)}")
            return False
        else:
            print("  ✅ Todas as variáveis de ambiente configuradas")
            return True
    else:
        print("  ❌ Arquivo .env não encontrado")
        print("  💡 Copie .env.example para .env e configure as variáveis")
        return False


def test_database_connection():
    """Testa conexão com PostgreSQL"""
    print("\n🔍 Testando conexão com PostgreSQL...")
    try:
        import psycopg2
        from dotenv import load_dotenv
        load_dotenv()
        
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432'),
            database=os.getenv('DB_NAME', 'calculo_digital'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'postgres')
        )
        conn.close()
        print("  ✅ Conexão com PostgreSQL estabelecida")
        return True
    except Exception as e:
        print(f"  ❌ Erro ao conectar: {e}")
        print("  💡 Verifique se o PostgreSQL está rodando")
        print("  💡 Confirme as credenciais no arquivo .env")
        return False


def test_chapters_json():
    """Verifica se o arquivo chapters.json existe"""
    print("\n🔍 Testando arquivo chapters.json...")
    chapters_path = os.path.join('..', 'assets', 'files', 'livro_epub', 'chapters.json')
    
    if os.path.exists(chapters_path):
        print("  ✅ Arquivo chapters.json encontrado")
        
        try:
            import json
            with open(chapters_path, 'r', encoding='utf-8') as f:
                chapters = json.load(f)
            
            print(f"  ✅ {len(chapters)} capítulos encontrados")
            
            # Verificar se arquivos .tex existem
            missing_files = []
            for chapter in chapters:
                tex_file = os.path.join('..', chapter['file'])
                if not os.path.exists(tex_file):
                    missing_files.append(chapter['file'])
            
            if missing_files:
                print(f"  ⚠️  {len(missing_files)} arquivos .tex não encontrados:")
                for f in missing_files[:3]:
                    print(f"     - {f}")
                return False
            else:
                print("  ✅ Todos os arquivos .tex existem")
                return True
                
        except Exception as e:
            print(f"  ❌ Erro ao ler JSON: {e}")
            return False
    else:
        print("  ❌ Arquivo chapters.json não encontrado")
        return False


def test_database_tables():
    """Verifica se as tabelas do banco existem"""
    print("\n🔍 Testando tabelas do banco de dados...")
    try:
        from app import app, db
        from models import User, ReadingProgress
        
        with app.app_context():
            # Tentar consultar tabelas
            user_count = User.query.count()
            progress_count = ReadingProgress.query.count()
            
            print(f"  ✅ Tabela 'users' existe ({user_count} usuários)")
            print(f"  ✅ Tabela 'reading_progress' existe ({progress_count} registros)")
            return True
            
    except Exception as e:
        print(f"  ❌ Erro: {e}")
        print("  💡 Execute: python init_db.py")
        return False


def main():
    """Executa todos os testes"""
    print("=" * 60)
    print("🧪 TESTE DE CONFIGURAÇÃO - CÁLCULO DIGITAL 2")
    print("=" * 60)
    
    results = []
    
    results.append(("Importações", test_imports()))
    results.append(("Arquivo .env", test_env_file()))
    results.append(("Conexão PostgreSQL", test_database_connection()))
    results.append(("Chapters JSON", test_chapters_json()))
    results.append(("Tabelas do Banco", test_database_tables()))
    
    print("\n" + "=" * 60)
    print("📊 RESUMO DOS TESTES")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASSOU" if result else "❌ FALHOU"
        print(f"{status} - {name}")
    
    print("=" * 60)
    print(f"Resultado: {passed}/{total} testes passaram")
    
    if passed == total:
        print("\n🎉 TUDO CERTO! Sistema pronto para uso.")
        print("💡 Execute: python app.py")
    else:
        print("\n⚠️  Alguns testes falharam. Corrija os problemas acima.")
    
    print("=" * 60)


if __name__ == '__main__':
    main()
