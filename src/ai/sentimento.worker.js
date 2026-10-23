import { pipeline } from '@huggingface/transformers';

// Modelo ONNX baseado em DistilBERT e treinado para sentimento multilíngue,
// incluindo português. Usamos q8 para reduzir o download/memória no browser.
const MODEL_ID = 'onnx-community/multilingual-sentiment-analysis-ONNX';
let classifier = null;
let loadingPromise = null;

function send(type, payload = {}) {
  self.postMessage({ type, ...payload });
}

async function loadModel() {
  if (classifier) return classifier;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    send('status', { status: 'loading', message: 'Preparando o modelo de sentimento…' });

    classifier = await pipeline('text-classification', MODEL_ID, {
      dtype: 'q8',
      progress_callback: (info) => {
        if (info?.status === 'progress') {
          send('progress', {
            file: info.file ?? 'arquivo do modelo',
            progress: Number(info.progress ?? 0),
            loaded: info.loaded ?? null,
            total: info.total ?? null,
          });
        } else if (info?.status) {
          send('status-detail', { message: String(info.status) });
        }
      },
    });

    send('ready', {
      modelId: MODEL_ID,
      runtime: 'Transformers.js · q8 · WASM/CPU',
    });

    return classifier;
  })();

  try {
    return await loadingPromise;
  } catch (error) {
    classifier = null;
    throw error;
  } finally {
    loadingPromise = null;
  }
}

self.addEventListener('message', async (event) => {
  const { type, id, text } = event.data ?? {};

  try {
    if (type === 'load') {
      await loadModel();
      return;
    }

    if (type === 'analyze') {
      if (!String(text ?? '').trim()) {
        throw new Error('Digite um texto antes de analisar.');
      }
      const model = await loadModel();
      const started = performance.now();
      const output = await model(text, { top_k: 5 });
      const elapsedMs = performance.now() - started;

      send('result', {
        id,
        text,
        output,
        elapsedMs,
      });
    }
  } catch (error) {
    send('error', {
      id,
      message: error?.message || String(error),
    });
  }
});
