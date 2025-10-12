"""
Script de teste do sistema
Verifica se tudo está configurado corretamente
"""

import sys
import os

def print_header(text):
    """Imprime cabeçalho formatado"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def print_check(status, message):
    """Imprime status de verificação"""
    icon = "✅" if status else "❌"
    print(f"{icon} {message}")

def test_imports():
    """Testa se todas as dependências estão instaladas"""
    print_header("Testando Importações")
    
    packages = [
        ("flask", "Flask"),
        ("flask_cors", "Flask-CORS"),
        ("flask_sqlalchemy", "Flask-SQLAlchemy"),
        ("psycopg2", "psycopg2"),
        ("dotenv", "python-dotenv"),
        ("flask_jwt_extended", "Flask-JWT-Extended")
    ]
    
    all_ok = True
    for package_name, display_name in packages:
        try:
            __import__(package_name)
            print_check(True, f"{display_name} instalado")
        except ImportError:
            print_check(False, f"{display_name} NÃO ENCONTRADO")
            all_ok = False
    
    return all_ok

def test_env_file():
    """Verifica se o arquivo .env existe"""
    print_header("Verificando Arquivo .env")
    
    if os.path.exists('.env'):
        print_check(True, "Arquivo .env encontrado")
        
        # Ler e verificar configurações
        with open('.env', 'r') as f:
            content = f.read()
            
        checks = {
            'DB_HOST': 'DB_HOST' in content,
            'DB_NAME': 'DB_NAME' in content,
            'DB_USER': 'DB_USER' in content,
            'DB_PASSWORD': 'DB_PASSWORD' in content,
            'FLASK_SECRET_KEY': 'FLASK_SECRET_KEY' in content,
        }
        
        for key, exists in checks.items():
            print_check(exists, f"{key} configurado")
        
        return all(checks.values())
    else:
        print_check(False, "Arquivo .env NÃO ENCONTRADO")
        print("   ⚠️  Execute: copy .env.example .env")
        return False

def test_database_connection():
    """Testa conexão com o banco de dados"""
    print_header("Testando Conexão com Banco de Dados")
    
    try:
        from config import Config
        from sqlalchemy import create_engine
        
        engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
        connection = engine.connect()
        
        print_check(True, "Conexão com PostgreSQL estabelecida")
        
        # Verificar se as tabelas existem
        result = connection.execute(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema = 'public'"
        )
        tables = [row[0] for row in result]
        
        if 'users' in tables:
            print_check(True, "Tabela 'users' existe")
        else:
            print_check(False, "Tabela 'users' não existe")
            print("   ⚠️  Execute: python init_db.py init")
        
        if 'reading_progress' in tables:
            print_check(True, "Tabela 'reading_progress' existe")
        else:
            print_check(False, "Tabela 'reading_progress' não existe")
            print("   ⚠️  Execute: python init_db.py init")
        
        # Verificar usuários
        result = connection.execute("SELECT COUNT(*) FROM users")
        user_count = result.fetchone()[0]
        print_check(user_count > 0, f"{user_count} usuário(s) no banco")
        
        connection.close()
        return True
        
    except Exception as e:
        print_check(False, f"Erro na conexão: {str(e)}")
        print("\n   Possíveis soluções:")
        print("   1. Verifique se o PostgreSQL está rodando")
        print("   2. Confirme as credenciais no arquivo .env")
        print("   3. Crie o banco: psql -U postgres -c 'CREATE DATABASE calculo_digital;'")
        return False

def test_api_endpoints():
    """Testa se a aplicação Flask pode iniciar"""
    print_header("Testando Aplicação Flask")
    
    try:
        from app import app
        
        print_check(True, "Aplicação Flask importada com sucesso")
        
        # Verificar rotas
        routes = [rule.rule for rule in app.url_map.iter_rules()]
        
        critical_routes = [
            '/api/auth/register',
            '/api/auth/login',
            '/api/progress',
            '/api/health'
        ]
        
        for route in critical_routes:
            exists = route in routes
            print_check(exists, f"Rota {route} configurada")
        
        return True
        
    except Exception as e:
        print_check(False, f"Erro ao importar app: {str(e)}")
        return False

def test_models():
    """Testa se os modelos estão corretos"""
    print_header("Testando Modelos do Banco")
    
    try:
        from models import User, ReadingProgress
        
        print_check(True, "Modelo 'User' importado")
        print_check(True, "Modelo 'ReadingProgress' importado")
        
        # Verificar campos do User
        user_fields = ['id', 'username', 'email', 'password_hash']
        for field in user_fields:
            has_field = hasattr(User, field)
            print_check(has_field, f"User.{field} definido")
        
        # Verificar métodos do User
        user_methods = ['set_password', 'check_password', 'to_dict']
        for method in user_methods:
            has_method = hasattr(User, method)
            print_check(has_method, f"User.{method}() definido")
        
        return True
        
    except Exception as e:
        print_check(False, f"Erro ao importar models: {str(e)}")
        return False

def run_all_tests():
    """Executa todos os testes"""
    print("\n" + "🔍 VERIFICAÇÃO DO SISTEMA - CÁLCULO DIGITAL 2".center(60))
    print("=" * 60)
    
    results = {
        "Importações": test_imports(),
        "Arquivo .env": test_env_file(),
        "Modelos": test_models(),
        "Banco de Dados": test_database_connection(),
        "Aplicação Flask": test_api_endpoints(),
    }
    
    print_header("RESUMO")
    
    total = len(results)
    passed = sum(results.values())
    
    for test_name, status in results.items():
        print_check(status, test_name)
    
    print("\n" + "-" * 60)
    print(f"  Testes Passados: {passed}/{total}")
    print("-" * 60)
    
    if passed == total:
        print("\n🎉 TUDO CERTO! O sistema está pronto para uso!")
        print("\n📝 Próximos passos:")
        print("   1. Execute: python app.py")
        print("   2. Abra outro terminal e execute: python -m http.server 8000")
        print("   3. Acesse: http://localhost:8000/homePage/homeIndex.html")
    else:
        print("\n⚠️  Alguns problemas foram encontrados.")
        print("   Siga as sugestões acima para corrigi-los.")
        print("\n📚 Consulte: TUTORIAL_INSTALACAO.md")
    
    print("\n")

if __name__ == "__main__":
    # Mudar para o diretório do script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    run_all_tests()
