import { useNavigate } from 'react-router-dom'

function Placeholder() {
  return (
    <div className="placeholder">
      <div>
        <span>Entrada</span>
        <p>Defina aqui mensagem de teste, chave publica ou parametros extras.</p>
      </div>
      <div>
        <span>Saida</span>
        <p>Mostre o buffer cifrado, assinatura, hash ou qualquer resposta relevante.</p>
      </div>
    </div>
  )
}

export default function AlgorithmLayout({ algorithm, children }) {
  const navigate = useNavigate()

  return (
    <div className="shell algorithm-page" style={{ '--current-accent': algorithm.accent }}>
      <header className="hero hero--detail">
        <p className="hero__eyebrow">/{algorithm.slug}</p>
        <h1>{algorithm.label}</h1>
        <p className="hero__lead">{algorithm.summary}</p>

        <div className="hero__badges">
          <span>Nivel: {algorithm.level}</span>
          <span>Complexidade: {algorithm.complexity}</span>
        </div>

        <div className="hero__tokens hero__tokens--detail">
          {algorithm.tokens.map((token) => (
            <span key={token}>{token}</span>
          ))}
        </div>

        <div className="hero__actions">
          <button className="btn btn--ghost" onClick={() => navigate('/')}>
            Voltar para biblioteca
          </button>
          <button className="btn btn--primary">Compartilhar rota</button>
        </div>
      </header>

      <section className="library library--single-column">
        {/* CONTEXTO - PRIMEIRO */}
        <div className="detail">
          <p className="hero__eyebrow">Contexto</p>
          <h2>O que voce encontra nesta rota</h2>
          <p className="detail__summary">{algorithm.summary}</p>
          <p className="detail__slug">
            URL dedicada para compartilhamento: <code>/{algorithm.slug}</code>
          </p>
          <div className="detail__chips">
            <span>Nivel: {algorithm.level}</span>
            <span>Complexidade: {algorithm.complexity}</span>
          </div>

          <div className="detail__grid">
            {algorithm.highlights.map((item) => (
              <article key={item.title} className="panel">
                <p className="panel__eyebrow">{item.title}</p>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* SIMULADOR - DEPOIS */}
        <div className="playground">
          <div className="playground__header">
            <div>
              <p className="panel__eyebrow">Simulador</p>
              <h3>Demonstracao pratica</h3>
              <p>
                Inclua formularios, arquivos ou visualizacoes para mostrar o passo a passo. Conte a
                historia do fluxo: entrada, processamento e resultado final.
              </p>
            </div>
            <button className="btn btn--secondary">Adicionar implementacao</button>
          </div>
          <div className="playground__body">{children ?? <Placeholder />}</div>
        </div>
      </section>

      <style>{`
        .library--single-column {
          display: flex;
          flex-direction: column !important;
          gap: 40px;
        }

        .library--single-column .detail {
          width: 100%;
          max-width: 100%;
        }

        .library--single-column .playground {
          width: 100%;
          max-width: 100%;
        }
      `}</style>
    </div>
  )
}