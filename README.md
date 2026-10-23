## Requisito de ambiente

- **Node 18+** (recomendado: Node 20 ou 22 LTS)
- npm disponível no terminal
- navegador moderno

# Semana 11 — NLP no Browser com Transformers.js

Projeto-base da prática de Front-end para IA.

## Objetivo
Construir e interpretar um analisador de sentimento executado no navegador com React, Transformers.js e Web Worker.

## Modelo
`onnx-community/multilingual-sentiment-analysis-ONNX`

O modelo-base (`tabularisai/multilingual-sentiment-analysis`) declara suporte a português e possui 5 classes:
- Very Negative
- Negative
- Neutral
- Positive
- Very Positive

Na interface da prática, preservamos as 5 probabilidades originais e também agregamos:
- Very Negative + Negative → NEGATIVO
- Neutral → NEUTRO
- Positive + Very Positive → POSITIVO

A variante `q8` reduz o peso principal do modelo no navegador (o arquivo ONNX quantizado é de aproximadamente 136 MB, além de tokenizer/configurações).

## Por que Web Worker?
A inferência é executada fora da thread principal da interface. A comunicação usa `postMessage` e mensagens de retorno. O modelo é carregado uma vez e reutilizado.

## Comandos
```bash
npm install
npm run dev
npm run build
```

Consulte `START_AQUI.md` e o Caderno do Aluno antes de editar.
