import { useEffect, useMemo, useState } from 'react'
import AlgorithmLayout from '../components/AlgorithmLayout.jsx'
import './Algoritmo3.css'

export const meta = {
  slug: 'Gabriel Pelinsari',
  label: 'Cifra de Playfair',
  summary:
    'Cifra histórica que transforma mensagens em pares de letras usando uma grade 5×5. Explore cada passo da cifragem interativamente com visualização dinâmica das regras aplicadas.',
  level: 'Intermediario',
  complexity: 'O(n)',
  tokens: ['Digrama', '5x5', 'Histórica'],
  accent: 'var(--accent-green)',
  highlights: [
    {
      title: 'Quando usar',
      description: 'Estudos históricos e demonstrações didáticas sobre cifragem por digramas e análise de frequência.',
    },
    {
      title: 'Vantagem',
      description: 'Cifra pares de letras em vez de letras individuais, dificultando ataques baseados em frequência simples.',
    },
    {
      title: 'Curiosidade',
      description: 'Usada oficialmente pela Grã-Bretanha na Primeira Guerra Mundial e pela Austrália na Segunda Guerra Mundial.',
    },
  ],
}

function cleanText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/J/g, 'I')
    .replace(/[^A-Z]/g, '')
}

function buildMatrix(keyword) {
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'
  const cleaned = cleanText(keyword)
  const seen = new Set()
  const sequence = []

  for (const char of cleaned + alphabet) {
    if (!seen.has(char)) {
      seen.add(char)
      sequence.push(char)
    }
  }

  const grid = []
  const positions = {}
  for (let row = 0; row < 5; row += 1) {
    const rowData = sequence.slice(row * 5, row * 5 + 5)
    grid.push(rowData)
    rowData.forEach((char, col) => {
      positions[char] = { row, col }
    })
  }

  return { grid, positions }
}

function createDigraphs(text) {
  const cleaned = cleanText(text)
  const result = []
  let i = 0

  while (i < cleaned.length) {
    const first = cleaned[i]
    const second = cleaned[i + 1]

    if (!second) {
      result.push([first, 'X'])
      break
    }

    if (first === second) {
      result.push([first, 'X'])
      i += 1
    } else {
      result.push([first, second])
      i += 2
    }
  }

  return result
}

function encodePair(pair, positions, grid) {
  const [a, b] = pair
  const posA = positions[a]
  const posB = positions[b]

  if (!posA || !posB) return { encoded: pair, rule: 'Caractere inválido', description: '' }

  if (posA.row === posB.row) {
    const encoded = [
      grid[posA.row][(posA.col + 1) % 5],
      grid[posB.row][(posB.col + 1) % 5],
    ]
    return {
      encoded,
      rule: 'Mesma linha',
      description: 'As letras estão na mesma linha. Substituímos cada uma pela letra imediatamente à direita (volta ao início se estiver no fim).',
    }
  }

  if (posA.col === posB.col) {
    const encoded = [
      grid[(posA.row + 1) % 5][posA.col],
      grid[(posB.row + 1) % 5][posB.col],
    ]
    return {
      encoded,
      rule: 'Mesma coluna',
      description: 'As letras estão na mesma coluna. Substituímos cada uma pela letra imediatamente abaixo (volta ao topo se estiver no fim).',
    }
  }

  const encoded = [grid[posA.row][posB.col], grid[posB.row][posA.col]]
  return {
    encoded,
    rule: 'Retângulo',
    description: 'As letras formam um retângulo. Cada uma é substituída pela letra no canto oposto da mesma linha.',
  }
}

const keywordSuggestions = [
  { text: 'MONARQUIA', label: 'Exemplo clássico' },
  { text: 'CRIPT', label: 'Palavra curta' },
  { text: 'PLAYFAIR', label: 'Nome da cifra' },
]

const messageSuggestions = [
  { text: 'Ataque ao amanhecer', label: 'Mensagem militar' },
  { text: 'Defender a ponte sul', label: 'Comando tático' },
  { text: 'Mensagem secreta', label: 'Texto simples' },
]

function PlayfairDemo() {
  const [keyword, setKeyword] = useState('MONARQUIA')
  const [message, setMessage] = useState('Ataque ao amanhecer')
  const [selectedPair, setSelectedPair] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const normalizedKeyword = cleanText(keyword)
  const normalizedMessage = cleanText(message)

  const { grid, positions } = useMemo(() => buildMatrix(keyword), [keyword])
  const digraphs = useMemo(() => createDigraphs(message), [message])
  const cipher = useMemo(
    () =>
      digraphs.map((pair) => {
        const { encoded, rule, description } = encodePair(pair, positions, grid)
        return { pair: pair.join(''), encoded: encoded.join(''), rule, description }
      }),
    [digraphs, positions, grid],
  )
  const cipherText = cipher.map((item) => item.encoded).join(' ')
  const activePair = cipher[selectedPair]

  const getHighlightedCells = () => {
    if (!activePair) return { original: [], encoded: [] }

    const [a, b] = activePair.pair.split('')
    const [encA, encB] = activePair.encoded.split('')

    return {
      original: [
        positions[a] ? { ...positions[a], char: a } : null,
        positions[b] ? { ...positions[b], char: b } : null,
      ].filter(Boolean),
      encoded: [
        positions[encA] ? { ...positions[encA], char: encA } : null,
        positions[encB] ? { ...positions[encB], char: encB } : null,
      ].filter(Boolean),
    }
  }

  const highlighted = getHighlightedCells()

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || cipher.length === 0) return
    
    const interval = setInterval(() => {
      setSelectedPair((prev) => {
        if (prev >= cipher.length - 1) {
          setIsAutoPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, cipher.length])

  useEffect(() => {
    setSelectedPair(0)
    setIsAutoPlaying(false)
  }, [cipher.length])

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  useEffect(() => {
    setCopied(false)
  }, [cipherText])

  const handleStep = (direction) => {
    setSelectedPair((prev) => {
      const next = prev + direction
      if (next < 0) return 0
      if (next > cipher.length - 1) return cipher.length - 1
      return next
    })
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        handleStep(-1)
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        handleStep(1)
      } else if (event.key === ' ') {
        event.preventDefault()
        setIsAutoPlaying((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cipher.length])

  const handleCopy = async () => {
    if (!cipherText) return
    try {
      await navigator.clipboard.writeText(cipherText)
      setCopied(true)
    } catch {
      setCopied(true)
    }
  }

  // Show real-time text transformation
  const getTransformationSteps = (text) => {
    if (!text) return []
    
    const original = text
    const noAccents = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const uppercase = noAccents.toUpperCase()
    const noJ = uppercase.replace(/J/g, 'I')
    const cleaned = noJ.replace(/[^A-Z]/g, '')
    
    return [
      { label: 'Original', value: original },
      { label: 'Sem acentos', value: noAccents, show: noAccents !== original },
      { label: 'Maiúsculas', value: uppercase, show: uppercase !== noAccents },
      { label: 'J → I', value: noJ, show: noJ !== uppercase },
      { label: 'Apenas letras', value: cleaned, show: cleaned !== noJ },
    ].filter(step => step.show !== false)
  }

  return (
    <div className="playfair">
      {/* Tutorial tooltip */}
      {showTutorial && (
        <div className="playfair__tutorial">
          <div className="playfair__tutorial-content">
            <h4>Como usar esta ferramenta</h4>
            <ul>
              <li>Use <kbd>←</kbd> <kbd>→</kbd> ou clique nos pares para navegar</li>
              <li>Pressione <kbd>Espaço</kbd> para reprodução automática</li>
              <li>Experimente diferentes palavras-chave e mensagens</li>
            </ul>
            <button 
              className="btn btn--primary" 
              onClick={() => setShowTutorial(false)}
            >
              Entendi!
            </button>
          </div>
        </div>
      )}

      {/* Main grid layout */}
      <div className="playfair__layout">
        {/* Left column: Inputs and grid */}
        <div className="playfair__sidebar">
          <article className="panel">
            <div className="playfair__step-header">
              <span className="playfair__step-badge">Passo 1</span>
              <h3>Palavra-chave</h3>
            </div>
            
            <p className="playfair__help-text">
              Define a ordem do alfabeto na grade 5×5
            </p>
            
            <input
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value)
                setCurrentStep(Math.max(currentStep, 1))
              }}
              placeholder="Digite uma palavra-chave"
              className="playfair__input"
            />
            
            <div className="playfair__suggestions">
              <span className="playfair__suggestions-label">Experimente:</span>
              {keywordSuggestions.map((suggestion) => (
                <button
                  key={suggestion.text}
                  type="button"
                  onClick={() => setKeyword(suggestion.text)}
                  className="playfair__chip"
                  title={suggestion.label}
                >
                  {suggestion.text}
                </button>
              ))}
            </div>

            {/* Real-time transformation preview */}
            {keyword && (
              <div className="playfair__transformation">
                <p className="playfair__transformation-label">Transformação:</p>
                {getTransformationSteps(keyword).map((step, idx) => (
                  <div key={idx} className="playfair__transformation-step">
                    <span className="playfair__transformation-arrow">
                      {idx > 0 && '→'}
                    </span>
                    <code>{step.value || '(vazio)'}</code>
                    <span className="playfair__transformation-hint">{step.label}</span>
                  </div>
                ))}
              </div>
            )}
          </article>

          {/* Grid visualization - always visible */}
          <article className="panel">
            <div className="playfair__grid-header">
              <h4>Grade 5×5</h4>
              <span className="playfair__grid-hint">
                {normalizedKeyword ? `Baseada em: ${normalizedKeyword}` : 'Insira uma palavra-chave'}
              </span>
            </div>
            
            <div className="playfair-grid">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="playfair-grid__row">
                  {row.map((cell, colIndex) => {
                    const isOriginalA =
                      highlighted.original[0]?.row === rowIndex &&
                      highlighted.original[0]?.col === colIndex
                    const isOriginalB =
                      highlighted.original[1]?.row === rowIndex &&
                      highlighted.original[1]?.col === colIndex
                    const isEncodedA =
                      highlighted.encoded[0]?.row === rowIndex && 
                      highlighted.encoded[0]?.col === colIndex
                    const isEncodedB =
                      highlighted.encoded[1]?.row === rowIndex && 
                      highlighted.encoded[1]?.col === colIndex

                    let cellClass = 'playfair-grid__cell'
                    if (isOriginalA || isOriginalB) cellClass += ' is-original'
                    if (isEncodedA || isEncodedB) cellClass += ' is-encoded'

                    return (
                      <span
                        key={cell}
                        className={cellClass}
                        title={`[${rowIndex}, ${colIndex}]`}
                      >
                        {cell}
                      </span>
                    )
                  })}
                </div>
              ))}
            </div>

            {activePair && (
              <div className="playfair-grid__legend">
                <div>
                  <span className="playfair-grid__legend-dot is-original" />
                  <span>Original: {activePair.pair}</span>
                </div>
                <div>
                  <span className="playfair-grid__legend-dot is-encoded" />
                  <span>Cifrado: {activePair.encoded}</span>
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Right column: Message and cipher process */}
        <div className="playfair__main">
          <article className="panel">
            <div className="playfair__step-header">
              <span className="playfair__step-badge">Passo 2</span>
              <h3>Sua mensagem</h3>
            </div>
            
            <textarea
              value={message}
              onChange={(event) => {
                setMessage(event.target.value)
                setCurrentStep(Math.max(currentStep, 2))
              }}
              rows={3}
              placeholder="Digite a mensagem para cifrar"
              className="playfair__textarea"
            />
            
            <div className="playfair__suggestions">
              <span className="playfair__suggestions-label">Exemplos:</span>
              {messageSuggestions.map((suggestion) => (
                <button
                  key={suggestion.text}
                  type="button"
                  onClick={() => setMessage(suggestion.text)}
                  className="playfair__chip"
                  title={suggestion.label}
                >
                  {suggestion.text}
                </button>
              ))}
            </div>

            {/* Message transformation */}
            {message && (
              <div className="playfair__message-flow">
                <div className="playfair__flow-step">
                  <span className="playfair__flow-label">Texto limpo:</span>
                  <code className="playfair__flow-value">{normalizedMessage || '---'}</code>
                </div>
                <div className="playfair__flow-arrow">↓</div>
                <div className="playfair__flow-step">
                  <span className="playfair__flow-label">Dividido em pares:</span>
                  <div className="playfair__digraph-preview">
                    {digraphs.length > 0 ? (
                      digraphs.map((pair, index) => (
                        <span
                          key={`${pair.join('')}-${index}`}
                          className={`playfair__digraph-chip ${
                            selectedPair === index ? 'is-active' : ''
                          }`}
                          onClick={() => setSelectedPair(index)}
                        >
                          {pair.join('')}
                        </span>
                      ))
                    ) : (
                      <em className="playfair__empty-state">Aguardando mensagem...</em>
                    )}
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Cipher visualization */}
          {cipher.length > 0 && (
            <article className="panel">
              <div className="playfair__cipher-header">
                <div>
                  <div className="playfair__step-header">
                    <span className="playfair__step-badge">Passo 3</span>
                    <h3>Processo de cifragem</h3>
                  </div>
                  <p className="playfair__help-text">
                    Navegue pelos pares para ver cada transformação
                  </p>
                </div>
                
                <div className="playfair__controls">
                  <button
                    className="btn btn--icon"
                    type="button"
                    onClick={() => handleStep(-1)}
                    disabled={selectedPair === 0}
                    title="Anterior (←)"
                  >
                    ←
                  </button>
                  
                  <button
                    className={`btn btn--icon ${isAutoPlaying ? 'is-playing' : ''}`}
                    type="button"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    title={isAutoPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
                  >
                    {isAutoPlaying ? '⏸' : '▶'}
                  </button>
                  
                  <button
                    className="btn btn--icon"
                    type="button"
                    onClick={() => handleStep(1)}
                    disabled={selectedPair === cipher.length - 1}
                    title="Próximo (→)"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="playfair__progress-section">
                <div className="playfair__progress-info">
                  <span>Par {selectedPair + 1} de {cipher.length}</span>
                  <span className="playfair__progress-percent">
                    {Math.round(((selectedPair + 1) / cipher.length) * 100)}%
                  </span>
                </div>
                <div className="playfair-progress">
                  <div
                    className="playfair-progress__bar"
                    style={{ width: `${((selectedPair + 1) / cipher.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Active pair visualization */}
              {activePair && (
                <div className="playfair__active-pair">
                  <div className="playfair__transformation-visual">
                    <div className="playfair__transform-from">
                      <span className="playfair__transform-label">Par original</span>
                      <strong className="playfair__transform-value">{activePair.pair}</strong>
                    </div>
                    
                    <div className="playfair__transform-arrow">
                      <div className="playfair__transform-rule">
                        {activePair.rule}
                      </div>
                    </div>
                    
                    <div className="playfair__transform-to">
                      <span className="playfair__transform-label">Par cifrado</span>
                      <strong className="playfair__transform-value">{activePair.encoded}</strong>
                    </div>
                  </div>

                  <div className="playfair__rule-explanation">
                    <p>{activePair.description}</p>
                  </div>

                  {highlighted.original.length === 2 && (
                    <div className="playfair__coordinates">
                      <div className="playfair__coordinate">
                        <strong>{highlighted.original[0].char}</strong>
                        <span>Linha {highlighted.original[0].row + 1}, Coluna {highlighted.original[0].col + 1}</span>
                      </div>
                      <div className="playfair__coordinate">
                        <strong>{highlighted.original[1].char}</strong>
                        <span>Linha {highlighted.original[1].row + 1}, Coluna {highlighted.original[1].col + 1}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* All pairs list - collapsible */}
              <details className="playfair__all-pairs">
                <summary>Ver todos os pares ({cipher.length})</summary>
                <div className="playfair__pairs-grid">
                  {cipher.map((item, index) => (
                    <button
                      key={`${item.pair}-${index}`}
                      type="button"
                      className={`playfair__pair-item ${
                        selectedPair === index ? 'is-active' : ''
                      }`}
                      onClick={() => setSelectedPair(index)}
                    >
                      <span className="playfair__pair-number">{index + 1}</span>
                      <span className="playfair__pair-transform">
                        {item.pair} → {item.encoded}
                      </span>
                      <span className="playfair__pair-rule">{item.rule}</span>
                    </button>
                  ))}
                </div>
              </details>
            </article>
          )}

          {/* Final result */}
          {cipher.length > 0 && (
            <article className="panel playfair__result">
              <div className="playfair__result-header">
                <h3>Mensagem cifrada</h3>
              </div>
              <div className="playfair__result-display">
                <code className="playfair__result-text">{cipherText}</code>
                <button
                  className="btn btn--secondary"
                  type="button"
                  onClick={handleCopy}
                  title="Copiar para área de transferência"
                >
                  {copied ? '✓ Copiado!' : 'Copiar'}
                </button>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Algoritmo3() {
  return (
    <AlgorithmLayout algorithm={meta}>
      <PlayfairDemo />
    </AlgorithmLayout>
  )
}