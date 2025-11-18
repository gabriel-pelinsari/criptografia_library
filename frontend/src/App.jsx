import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'

const algorithms = [
  {
    slug: 'criador-1',
    label: 'Algoritmo 1',
    summary:
      'Slot do integrante 1. Descreva de forma simples o que o algoritmo faz, quais dados recebe e qual resultado o visitante deve ver.',
    level: 'Intermediario',
    complexity: 'O(n)',
    tokens: ['Simetrica', 'Blocos', 'Personalizavel'],
    accent: 'var(--accent-cyan)',
    highlights: [
      {
        title: 'Quando usar',
        description: 'Protecao de dados em repouso, volumes cifrados ou trafego entre APIs internas.',
      },
      {
        title: 'Vantagem',
        description: 'Implementacao direta e bibliotecas maduras para a maioria das linguagens.',
      },
      {
        title: 'Cuidados',
        description: 'Documente tamanho de chave, IV e formato das mensagens para evitar erros.',
      },
    ],
  },
  {
    slug: 'criador-2',
    label: 'Algoritmo 2',
    summary: 'Slot do integrante 2. Ideal para um algoritmo assimetrico usado em troca de chaves ou assinaturas digitais.',
    level: 'Avancado',
    complexity: 'O(n^3)',
    tokens: ['Assimetrica', 'Assinatura', 'Troca segura'],
    accent: 'var(--accent-purple)',
    highlights: [
      {
        title: 'Quando usar',
        description: 'Troca inicial de chaves, emissao de certificados e autenticacao de mensagens.',
      },
      {
        title: 'Vantagem',
        description: 'Compatibilidade com TLS, PKI interna e integra facilmente com bibliotecas existentes.',
      },
      {
        title: 'Cuidados',
        description: 'Nao cifrar arquivos grandes diretamente; combine com um algoritmo simetrico.',
      },
    ],
  },
  {
    slug: 'criador-3',
    label: 'Algoritmo 3',
    summary:
      'Slot do integrante 3. Indicado para algoritmos de stream com autenticacao embutida (AEAD).',
    level: 'Intermediario',
    complexity: 'O(n)',
    tokens: ['Simetrica', 'Stream', 'AEAD'],
    accent: 'var(--accent-green)',
    highlights: [
      {
        title: 'Quando usar',
        description: 'APIs publicas, mensageria em tempo real ou comunicacao entre apps mobile.',
      },
      {
        title: 'Vantagem',
        description: 'Desempenho consistente mesmo sem aceleracao de hardware.',
      },
      {
        title: 'Cuidados',
        description: 'Nonce de 96 bits deve ser unico por sessao ou mensagem para evitar replay.',
      },
    ],
  },
  {
    slug: 'criador-4',
    label: 'Algoritmo 4',
    summary: 'Slot do integrante 4. Use para documentar algoritmos legados ou compatibilidade retro.',
    level: 'Historico',
    complexity: 'O(n)',
    tokens: ['Simetrica', 'Blocos', 'Legado'],
    accent: 'var(--accent-orange)',
    highlights: [
      {
        title: 'Quando usar',
        description: 'Integracoes com appliances antigos, VPNs legadas ou sistemas embarcados.',
      },
      {
        title: 'Vantagem',
        description: 'Codigo simples e facilmente encontrado em projetos antigos.',
      },
      {
        title: 'Cuidados',
        description: 'Explique as limitacoes de blocos pequenos e incentive migracao quando possivel.',
      },
    ],
  },
  {
    slug: 'criador-5',
    label: 'Algoritmo 5',
    summary: 'Slot do integrante 5. Ideal para curvas elipticas modernas com foco em chaves pequenas e IoT.',
    level: 'Avancado',
    complexity: 'O(n log n)',
    tokens: ['Assimetrica', 'E2E', 'Chaves pequenas'],
    accent: 'var(--accent-pink)',
    highlights: [
      {
        title: 'Quando usar',
        description: 'Mensageria ponta a ponta, IoT, TLS moderno e ambientes com baixa largura de banda.',
      },
      {
        title: 'Vantagem',
        description: 'Chaves curtas mantendo o mesmo nivel de seguranca que algoritmos tradicionais.',
      },
      {
        title: 'Cuidados',
        description: 'Utilize bibliotecas confiaveis e valide os pontos recebidos para evitar ataques.',
      },
    ],
  },
]

const heroStats = [
  { label: 'Algoritmos prontos', value: algorithms.length, detail: 'cada rota recebe um autor' },
  { label: 'Rotas dedicadas', value: '/algoritmo-1 ... 5', detail: 'compartilhe o link direto' },
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
            Cadastre um novo item no array acima, defina um slug (/algoritmo-x) e escreva um resumo
            claro. O roteador cria a pagina automaticamente e mantem o mesmo visual.
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

function AlgorithmPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const algorithm = algorithms.find((item) => item.slug === slug)

  if (!algorithm) {
    return <Navigate to="/" replace />
  }

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

      <section className="library library--detail">
        <div className="detail">
          <p className="hero__eyebrow">Contexto</p>
          <h2>O que voce encontra nesta rota</h2>
          <p className="detail__summary">
            {algorithm.summary} Use o espaco abaixo para explicar porque o algoritmo foi escolhido,
            quais parametros ele recebe e como interpretar a saida.
          </p>
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

        <div className="playground">
          <div className="playground__header">
            <div>
              <p className="panel__eyebrow">Simulador</p>
              <h3>Demonstracao pratica do {algorithm.label}</h3>
              <p>
                Inclua formularios, arquivos ou visualizacoes para mostrar o passo a passo. Conte a
                historia do fluxo: entrada, processamento e resultado final.
              </p>
            </div>
            <button className="btn btn--secondary">Adicionar implementacao</button>
          </div>
          <div className="playground__body">
            <div className="placeholder">
              <div>
                <span>Entrada</span>
                <p>Defina aqui mensagem de teste, chave publica ou parametros extras.</p>
              </div>
              <div>
                <span>Saida</span>
                <p>
                  Mostre o buffer cifrado, assinatura, hash ou qualquer resposta relevante para o
                  publico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LibraryLanding />} />
      <Route path="/:slug" element={<AlgorithmPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
