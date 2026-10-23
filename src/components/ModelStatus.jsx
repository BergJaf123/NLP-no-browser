export default function ModelStatus({ status, progress, detail, modelInfo, error, onLoad }) {
  const label = {
    idle: 'Não carregado',
    loading: 'Carregando',
    ready: 'Pronto',
    error: 'Erro',
  }[status] ?? status;

  return (
    <section className="panel model-panel">
      <div className="panel-title-row">
        <div>
          <span className="eyebrow">ETAPA 1</span>
          <h2>Estado do modelo</h2>
        </div>
        <span className={`status-pill ${status}`}>{label}</span>
      </div>

      <p className="muted">{detail}</p>

      {status === 'loading' && (
        <div className="progress-wrap">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <span>{progress.toFixed(0)}%</span>
        </div>
      )}

      {modelInfo && (
        <div className="model-meta">
          <code>{modelInfo.modelId}</code>
          <span>{modelInfo.runtime}</span>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      <button className="primary-btn" onClick={onLoad}
        disabled={status === 'loading' || status === 'ready'}>
        {status === 'ready' ? 'Modelo carregado ✓' :
         status === 'loading' ? 'Carregando…' : 'Carregar modelo'}
      </button>
    </section>
  );
}