@echo off
where code >nul 2>nul
if errorlevel 1 (
  echo O comando 'code' nao foi encontrado no PATH.
  echo Abra o VS Code manualmente e use File ^> Open Folder.
  pause
  exit /b 1
)
code .
