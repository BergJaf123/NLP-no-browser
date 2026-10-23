import { useEffect, useRef, useState } from 'react';
import { useSentimento } from './ai/useSentimento.js';
import ModelStatus from './components/ModelStatus.jsx';
import SentimentResult from './components/SentimentResult.jsx';
import ArchitectureCard from './components/ArchitectureCard.jsx';

const EXAMPLES = [
  'Eu adorei a experiência, o atendimento foi excelente!',
  'O produto chegou no prazo. Foi uma experiência normal.',
  'Foi uma experiência péssima e eu não compraria novamente.',
  'Que maravilha, mais duas horas esperando atendimento…',
];

function demoAnalyze(text) {
  const lower = text.toLowerCase();
  const posWords = ['adorei','excelente','ótimo','otimo','bom','maravilha','incrível','incrivel'];
  const negWords = ['péssimo','pessimo','ruim','horrível','horrivel','demora','esperando','decepção','decepcao'];
  const pos = posWords.filter((w) => lower.includes(w)).length;
  const neg = negWords.filter((w) => lower.includes(w)).length;
  let scores = [0.05,0.08,0.22,0.28,0.37];
  if (neg > pos) scores = [0.48,0.28,0.12,0.07,0.05];
  if (pos > neg) scores = [0.04,0.06,0.10,0.28,0.52];
  const labels = ['Very Negative','Negative','Neutral','Positive','Very Positive'];
  return { text, elapsedMs: 18, output: labels.map((label,i) => ({ label, score: scores[i] })) };
}

export default function App() {
  const { status, progress, detail, modelInfo, error, loadModel, analyze } = useSentimento();
  const [text, setText] = useState(EXAMPLES[0]);
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const timerRef = useRef(null);
  const analysisSeqRef = useRef(0);

  function updateText(value) {
    analysisSeqRef.current += 1; // invalida qualquer inferência antiga ainda em andamento
    setAnalyzing(false);
    setResult(null);
    setText(value);
  }

  async function runAnalysis(value = text) {
    clearTimeout(timerRef.current);
    if ((!demoMode && status !== 'ready') || !value.trim()) return;
    const seq = ++analysisSeqRef.current;
    setAnalyzing(true);
    try {
      const next = demoMode ? demoAnalyze(value) : await analyze(value);
      if (seq === analysisSeqRef.current) setResult(next);
    } catch (err) {
      console.error(err);
    } finally {
      if (seq === analysisSeqRef.current) setAnalyzing(false);
    }
  }

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!autoAnalyze || (!demoMode && status !== 'ready') || text.trim().length < 3) return;
    timerRef.current = setTimeout(() => runAnalysis(text), 400);
    return () => clearTimeout(timerRef.current);
  }, [text, autoAnalyze, status, demoMode]);

  return (
    <main className="app-shell">
      <header className="hero"><div><span className="eyebrow">SEMANA 11 · FRONT-END PARA IA</span><h1>NLP no browser<br/><em>com Transformers.js</em></h1><p>Sentimento em português executado localmente no navegador.</p></div><div className="hero-orb"><span>NLP</span></div></header>
      <ModelStatus status={status} progress={progress} detail={detail} modelInfo={modelInfo} error={error} onLoad={loadModel} />
      {status === 'error' && !demoMode && <div className="fallback-card"><div><b>Plano B didático</b><p>Se a infraestrutura impedir o modelo real, continue a construção visual usando simulação claramente identificada.</p></div><button onClick={() => setDemoMode(true)}>Ativar simulação</button></div>}
      {demoMode && <div className="fallback-card active"><div><b>Modo demonstração ativo</b><p>Os resultados abaixo são simulados; não representam inferência do modelo.</p></div><button onClick={() => setDemoMode(false)}>Sair da simulação</button></div>}
      <section className="panel input-panel"><span className="eyebrow">ETAPA 2</span><h2>Digite uma frase para classificar</h2><textarea value={text} onChange={(e) => updateText(e.target.value)} rows="5" /><div className="example-row">{EXAMPLES.map((example,index) => <button key={example} onClick={() => updateText(example)}>Exemplo {index+1}</button>)}</div><div className="action-row"><label className="switch-label"><input type="checkbox" checked={autoAnalyze} onChange={(e) => setAutoAnalyze(e.target.checked)} /> análise automática após 400 ms</label><button className="primary-btn" onClick={() => runAnalysis()} disabled={(!demoMode && status !== 'ready') || analyzing}>{analyzing ? 'Analisando…' : 'Analisar agora'}</button></div></section>
      <SentimentResult result={result} analyzing={analyzing} demo={demoMode} />
      <ArchitectureCard />
    </main>
  );
}