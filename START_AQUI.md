# START AQUI — Semana 11 · Transformers.js

## 1) Extraia o ZIP antes de abrir
Não trabalhe dentro do arquivo `.zip`.

## 2) Abra a PASTA do projeto no VS Code
No VS Code: **File → Open Folder** e escolha a pasta `frontend_semana11_transformers_sentimento`.

No Explorer do VS Code você deve enxergar `package.json`, `src/`, `index.html` e este arquivo.

## 3) Abra o Terminal 1
Use **Node 18 ou superior**. Para a aula, prefira **Node 20 ou 22 LTS**.

Menu **Terminal → New Terminal**.

Execute:

```bash
node -v
npm -v
npm install
npm run dev
```

Abra no navegador a URL mostrada pelo Vite, normalmente `http://localhost:5173`.

## 4) Primeiro objetivo
A página deve abrir sem erro. Clique em **Carregar modelo**. Na primeira vez o browser precisa baixar o modelo e armazená-lo em cache; isso pode levar alguns minutos dependendo da internet. O peso ONNX q8 principal tem aproximadamente 136 MB, além dos arquivos de configuração/tokenização.

## 5) Arquivos importantes
- `src/ai/sentimento.worker.js` → modelo + inferência fora da thread principal.
- `src/ai/useSentimento.js` → ponte React ↔ Worker.
- `src/components/ModelStatus.jsx` → estado/progresso do modelo.
- `src/components/SentimentResult.jsx` → probabilidades e visualização.
- `src/App.jsx` → textarea, debounce e fluxo da aplicação.
- `src/App.css` → identidade visual.

## 6) Não altere tudo de uma vez
Siga o **Caderno do Aluno** na ordem. Ele informa exatamente qual arquivo editar, o que testar e qual print registrar.

## 7) Se o modelo real falhar
A tela oferece **Modo demonstração**. Ele serve apenas para continuar a prática de interface. Resultados desse modo são SIMULADOS e não contam como evidência de inferência real. Use-o somente se a infraestrutura impedir o carregamento real.

## 8) Build final
Abra um Terminal 2 e rode:

```bash
npm run build
```

O objetivo final é terminar com **6 evidências**, explicações e build sem erro.
