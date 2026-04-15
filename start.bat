@echo off
echo ========================================
echo   LeadHunter AI - Inicializacao Rapida
echo ========================================
echo.

echo [1/3] Verificando dependencias do backend...
cd server
if not exist node_modules (
    echo Instalando dependencias do backend...
    call npm install
) else (
    echo Dependencias do backend ja instaladas.
)
cd ..

echo.
echo [2/3] Verificando dependencias do frontend...
cd client
if not exist node_modules (
    echo Instalando dependencias do frontend...
    call npm install
) else (
    echo Dependencias do frontend ja instaladas.
)
cd ..

echo.
echo [3/3] Iniciando servidores...
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar os servidores
echo.

REM Iniciar backend em background
start "LeadHunter Backend" cmd /k "cd server && npm start"

REM Aguardar 2 segundos para o backend iniciar
timeout /t 2 >nul

REM Iniciar frontend
start "LeadHunter Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo   Servidores iniciados com sucesso!
echo ========================================
echo.
echo Acesse: http://localhost:3000
echo.
