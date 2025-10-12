"""
Script de inicialização do banco de dados
Cria as tabelas e pode popular com dados de exemplo
"""

from app import app, db
from models import User, ReadingProgress

def init_db():
    """Inicializa o banco de dados"""
    with app.app_context():
        # Criar todas as tabelas
        print("Criando tabelas...")
        db.create_all()
        print("✓ Tabelas criadas com sucesso!")
        
        # Verificar se já existem dados
        if User.query.first():
            print("⚠ Banco de dados já contém dados.")
            return
        
        # Criar usuário de exemplo (opcional)
        print("\nCriando usuário de exemplo...")
        example_user = User(
            username='usuario_exemplo',
            email='exemplo@email.com'
        )
        example_user.set_password('senha123')
        
        db.session.add(example_user)
        db.session.commit()
        
        print(f"✓ Usuário criado: {example_user.username}")
        
        # Criar progresso de exemplo
        print("\nCriando progresso de exemplo...")
        chapters = [
            ("Capítulo 1", 0.5),
            ("Capítulo 2", 0.3),
            ("Capítulo 3", 0.7)
        ]
        
        for chapter_key, progress_value in chapters:
            progress = ReadingProgress(
                user_id=example_user.id,
                chapter_key=chapter_key,
                progress=progress_value,
                last_position=0,
                completed=progress_value >= 1.0
            )
            db.session.add(progress)
        
        db.session.commit()
        print(f"✓ {len(chapters)} progressos de leitura criados")
        
        print("\n✅ Banco de dados inicializado com sucesso!")
        print("\n📌 Credenciais de exemplo:")
        print(f"   Username: {example_user.username}")
        print(f"   Password: senha123")
        print(f"   Email: {example_user.email}")


def drop_all():
    """Remove todas as tabelas (USE COM CUIDADO!)"""
    with app.app_context():
        print("⚠ ATENÇÃO: Isso irá deletar TODAS as tabelas e dados!")
        confirm = input("Digite 'CONFIRMAR' para prosseguir: ")
        
        if confirm == 'CONFIRMAR':
            db.drop_all()
            print("✓ Todas as tabelas foram removidas.")
        else:
            print("✗ Operação cancelada.")


def reset_db():
    """Remove e recria todas as tabelas"""
    with app.app_context():
        print("⚠ Resetando banco de dados...")
        db.drop_all()
        print("✓ Tabelas antigas removidas.")
        db.create_all()
        print("✓ Novas tabelas criadas.")
        print("\n✅ Banco de dados resetado com sucesso!")


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == 'init':
            init_db()
        elif command == 'drop':
            drop_all()
        elif command == 'reset':
            reset_db()
        else:
            print("Comandos disponíveis:")
            print("  python init_db.py init   - Inicializa o banco")
            print("  python init_db.py reset  - Reseta o banco")
            print("  python init_db.py drop   - Remove todas as tabelas")
    else:
        init_db()
