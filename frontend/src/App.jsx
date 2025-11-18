import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Algoritmo1, { meta as algoritmo1Meta } from './pages/Algoritmo1.jsx'
import Algoritmo2, { meta as algoritmo2Meta } from './pages/Algoritmo2.jsx'
import Algoritmo3, { meta as algoritmo3Meta } from './pages/Algoritmo3.jsx'
import Algoritmo4, { meta as algoritmo4Meta } from './pages/Algoritmo4.jsx'
import Algoritmo5, { meta as algoritmo5Meta } from './pages/Algoritmo5.jsx'

const algorithmPages = [
  { Component: Algoritmo1, meta: algoritmo1Meta },
  { Component: Algoritmo2, meta: algoritmo2Meta },
  { Component: Algoritmo3, meta: algoritmo3Meta },
  { Component: Algoritmo4, meta: algoritmo4Meta },
  { Component: Algoritmo5, meta: algoritmo5Meta },
]

const algorithms = algorithmPages.map(({ meta }) => meta)

const heroStats = [
  { label: 'Algoritmos prontos', value: algorithms.length, detail: 'cada rota recebe um autor' },
  {
    label: 'Rotas dedicadas',
    value: '/Nome do algoritmo',
    detail: 'compartilhe o link direto',
  },
  { label: 'Status', value: 'Live Preview', detail: 'layout pronto para demos' },
]

function LibraryLanding() {
  const navigate = useNavigate()

  const handleSelect = (slug) => {
    navigate(`/${slug}`)
  }

  return (
    <div className="shell">
      <header className="hero">
        <p className="hero__eyebrow">Biblioteca de Criptografia</p>
        <h1>Entenda e navegue pelos algoritmos do grupo</h1>
        <p className="hero__lead">
          Esta pagina resume a proposta completa. Selecione um card para abrir a rota exclusiva,
          conhecer as regras do algoritmo e visualizar a simulacao preparada pelo integrante
          responsavel.
        </p>
        <div className="hero__actions">
          <button className="btn btn--primary" onClick={() => handleSelect(algorithms[0].slug)}>
            Ver o primeiro algoritmo
          </button>
          <a
            className="btn btn--ghost"
            href="https://github.com/gabriel-pelinsari/criptografia_library"
            target="_blank"
            rel="noreferrer"
          >
            Guia do projeto
          </a>
        </div>
      </header>

      <section className="status-panels">
        {heroStats.map((stat) => (
          <article key={stat.label} className="status-panel">
            <span className="status-panel__label">{stat.label}</span>
            <strong className="status-panel__value">{stat.value}</strong>
            <p>{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="catalog">
        <div className="catalog__meta">
          <h2>Como navegar</h2>
          <p>
            Cada card abre uma rota /algoritmo-x com contexto, notas e o playground daquele
            integrante. Compartilhe o link direto com colegas, professores ou avaliadores.
          </p>
        </div>

        <div className="catalog__grid">
          {algorithms.map((algorithm) => (
            <button
              key={algorithm.slug}
              type="button"
              className="algorithm-card catalog__card"
              onClick={() => handleSelect(algorithm.slug)}
              style={{ '--card-accent': algorithm.accent }}
            >
              <div className="catalog__card-left">
                <div className="algorithm-card__header">
                  <h3>{algorithm.label}</h3>
                  <span>{algorithm.level}</span>
                </div>
                <p>{algorithm.summary}</p>
                <code className="algorithm-card__slug">/{algorithm.slug}</code>
              </div>

              <div className="catalog__card-right">
                <p>Stack sugerido</p>
                <div className="algorithm-card__tokens">
                  {algorithm.tokens.map((token) => (
                    <span key={token}>{token}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="contribute">
        <div>
          <p className="hero__eyebrow">Expansao</p>
          <h3>Quer adicionar outro algoritmo?</h3>
          <p>
            Duplique um dos arquivos em <code>src/pages</code>, defina um novo slug (/algoritmo-x) e
            ajuste os textos. Depois inclua o meta no array <code>algorithmPages</code> para o card
            aparecer aqui automaticamente.
          </p>
        </div>
        <a
          className="btn btn--outline"
          href="https://github.com/gabriel-pelinsari/criptografia_library"
          target="_blank"
          rel="noreferrer"
        >
          Ver guia de contribuicao
        </a>
      </section>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LibraryLanding />} />
      {algorithmPages.map(({ meta, Component }) => (
        <Route key={meta.slug} path={`/${meta.slug}`} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
