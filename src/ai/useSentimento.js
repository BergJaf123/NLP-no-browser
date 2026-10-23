import { useCallback, useEffect, useRef, useState } from 'react';

export function useSentimento() {
  const workerRef = useRef(null);
  const requestIdRef = useRef(0);
  const pendingRef = useRef(new Map());

  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [detail, setDetail] = useState('Modelo ainda não carregado.');
  const [modelInfo, setModelInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const worker = new Worker(new URL('./sentimento.worker.js', import.meta.url), {
      type: 'module',
    });

    function rejectAll(message) {
      for (const pending of pendingRef.current.values()) {
        pending.reject(new Error(message));
      }
      pendingRef.current.clear();
    }

    function handleWorkerError(event) {
      const message = event?.message || 'O Web Worker falhou antes de concluir a operação.';
      setStatus('error');
      setError(message);
      setDetail('Falha na camada de execução em segundo plano.');
      rejectAll(message);
    }

    worker.addEventListener('message', ({ data }) => {
      if (data.type === 'status') {
        setStatus(data.status ?? 'loading');
        setDetail(data.message ?? 'Carregando…');
      }

      if (data.type === 'status-detail') {
        setDetail(data.message ?? 'Preparando arquivos…');
      }

      if (data.type === 'progress') {
        setStatus('loading');
        setProgress(Math.max(0, Math.min(100, Number(data.progress ?? 0))));
        setDetail(`Baixando: ${data.file}`);
      }

      if (data.type === 'ready') {
        setStatus('ready');
        setProgress(100);
        setError('');
        setDetail('Modelo pronto para inferência local.');
        setModelInfo({ modelId: data.modelId, runtime: data.runtime });
      }

      if (data.type === 'result') {
        const pending = pendingRef.current.get(data.id);
        if (pending) {
          pending.resolve(data);
          pendingRef.current.delete(data.id);
        }
      }

      if (data.type === 'error') {
        setStatus('error');
        setError(data.message ?? 'Erro desconhecido.');
        setDetail('Falha ao carregar ou executar o modelo.');
        const pending = pendingRef.current.get(data.id);
        if (pending) {
          pending.reject(new Error(data.message ?? 'Erro desconhecido.'));
          pendingRef.current.delete(data.id);
        }
      }
    });

    worker.addEventListener('error', handleWorkerError);
    workerRef.current = worker;

    return () => {
      worker.removeEventListener('error', handleWorkerError);
      worker.terminate();
      rejectAll('Worker encerrado.');
    };
  }, []);

  const loadModel = useCallback(() => {
    setError('');
    setStatus('loading');
    setProgress(0);
    setDetail('Solicitando carregamento…');
    workerRef.current?.postMessage({ type: 'load' });
  }, []);

  const analyze = useCallback((text) => {
    if (!workerRef.current) {
      return Promise.reject(new Error('Worker ainda não inicializado.'));
    }
    if (!String(text ?? '').trim()) {
      return Promise.reject(new Error('Digite um texto antes de analisar.'));
    }

    const id = ++requestIdRef.current;
    return new Promise((resolve, reject) => {
      pendingRef.current.set(id, { resolve, reject });
      workerRef.current.postMessage({ type: 'analyze', id, text });
    });
  }, []);

  return {
    status,
    progress,
    detail,
    modelInfo,
    error,
    loadModel,
    analyze,
  };
}
