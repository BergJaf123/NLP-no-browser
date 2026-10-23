export default function ArchitectureCard() {
  return (
    <section className="architecture panel">
      <span className="eyebrow">ARQUITETURA</span>
      <h2>O que está acontecendo por trás da interface?</h2>
      <div className="flow">
        <div><b>React</b><small>texto + UI</small></div><i>→</i>
        <div><b>postMessage</b><small>envia para o Worker</small></div><i>→</i>
        <div><b>Web Worker</b><small>mantém a UI livre</small></div><i>→</i>
        <div><b>Transformers.js</b><small>pipeline</small></div><i>→</i>
        <div><b>Modelo ONNX</b><small>inferência local</small></div>
      </div>
      <p>O modelo é carregado uma vez no Worker. Depois, cada texto é enviado por mensagem e o resultado volta para o React.</p>
    </section>
  );
}