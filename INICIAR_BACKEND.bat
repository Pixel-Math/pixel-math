@echo off
echo ========================================
echo   CALCULO DIGITAL 2 - INICIAR BACKEND
echo ========================================
echo.

cd backend

echo [1/3] Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo [2/3] Verificando configuracao...
python test_sistema.py

echo.
echo [3/3] Iniciando servidor Flask...
echo.
echo ========================================
echo   Backend rodando em:
echo   http://localhost:5000
echo ========================================
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

python app.py

pause
