function bandForLabel(label) {
  const key = String(label).toLowerCase();
  if (key.includes('negative')) return 'NEGATIVO';
  if (key.includes('positive')) return 'POSITIVO';
  return 'NEUTRO';
}

export function summarizeScores(output = []) {
  const bands = { NEGATIVO: 0, NEUTRO: 0, POSITIVO: 0 };
  output.forEach((item) => {
    bands[bandForLabel(item.label)] += Number(item.score ?? 0);
  });
  const dominant = Object.entries(bands).sort((a, b) => b[1] - a[1])[0] ?? ['—', 0];
  return { bands, dominant };
}

export default function SentimentResult({ result, analyzing, demo = false }) {
  if (analyzing) return <section className="panel result-panel"><h2>Analisando…</h2><div className="skeleton" /></section>;
  if (!result) return <section className="panel result-panel"><h2>Resultado</h2><p>Nenhuma inferência executada ainda.</p></section>;
  const { bands, dominant } = summarizeScores(result.output);
  return (
    <section className="panel result-panel">
      <div className="panel-title-row"><div><span className="eyebrow">ETAPA 3</span><h2>Interpretação do modelo</h2></div>{demo && <span className="demo-pill">SIMULAÇÃO</span>}</div>
      <div className={`dominant ${dominant[0].toLowerCase()}`}><strong>{dominant[0]}</strong><span>{(dominant[1] * 100).toFixed(1)}% agregado</span></div>
      <div className="band-grid">{Object.entries(bands).map(([name, score]) => <div className="band-row" key={name}><div className="band-label"><span>{name}</span><b>{(score * 100).toFixed(1)}%</b></div><div className="bar-track"><div className={`bar-fill ${name.toLowerCase()}`} style={{ width: `${score * 100}%` }} /></div></div>)}</div>
      <details className="classes-details"><summary>Ver as 5 classes originais do modelo</summary><div className="class-list">{result.output.map((item) => <div key={item.label}><span>{item.label}</span><b>{(item.score * 100).toFixed(2)}%</b></div>)}</div></details>
      <div className="metrics-row"><span>Inferência: <b>{result.elapsedMs.toFixed(0)} ms</b></span><span>Texto: <b>{result.text.length} caracteres</b></span></div>
      <p className="confidence-note"><b>Interprete com cuidado:</b> score alto é confiança do modelo, não garantia de verdade.</p>
    </section>
  );
}