@echo off
echo ========================================
echo  CALCULO DIGITAL 2 - CONFIGURACAO INICIAL
echo ========================================
echo.

cd backend

echo [1/5] Criando ambiente virtual...
python -m venv venv

echo.
echo [2/5] Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo [3/5] Instalando dependencias...
pip install -r requirements.txt

echo.
echo [4/5] Criando arquivo .env...
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado! EDITE com suas credenciais PostgreSQL
    pause
) else (
    echo Arquivo .env ja existe
)

echo.
echo [5/5] Inicializando banco de dados...
python init_db.py

echo.
echo ========================================
echo   CONFIGURACAO CONCLUIDA!
echo ========================================
echo.
echo Proximos passos:
echo 1. Edite backend\.env com suas credenciais
echo 2. Execute: INICIAR_BACKEND.bat
echo.
pause
