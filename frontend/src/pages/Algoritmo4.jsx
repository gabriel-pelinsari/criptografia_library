import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AlgorithmLayout from '../components/AlgorithmLayout.jsx'

export const meta = {
  slug: 'criador-4',
  label: 'Cifra de Vigenère',
  summary: 'Algoritmo de criptografia clássica que usa uma chave para cifrar texto através de uma tabela de substituição polialfabética.',
  level: 'Intermediario',
  complexity: 'O(n)',
  tokens: ['Criptografia', 'Clássica', 'Educacional'],
  accent: 'var(--accent-cyan)',
  highlights: [
    {
      title: 'Quando usar',
      description: 'Demonstração educacional de cifras polialfabéticas e histórico da criptografia.',
    },
    {
      title: 'Vantagem',
      description: 'Mais seguro que cifra de César por usar chave variável que se repete.',
    },
    {
      title: 'Cuidados',
      description: 'Não usar em produção - algoritmo obsoleto para segurança real moderna.',
    },
  ],
}

const VigenereCipher = () => {
  const [palavra, setPalavra] = useState('Palavra');
  const [chave, setChave] = useState('Chave');
  const [passo, setPasso] = useState(0);
  const [chaveExpandida, setChaveExpandida] = useState('');
  const [resultado, setResultado] = useState('');

  const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  const gerarMatriz = () => {
    const matriz = [];
    for (let i = 0; i < 26; i++) {
      const linha = [];
      for (let j = 0; j < 26; j++) {
        linha.push(alfabeto[(i + j) % 26]);
      }
      matriz.push(linha);
    }
    return matriz;
  };

  const matriz = gerarMatriz();

  useEffect(() => {
    const palavraLimpa = palavra.toUpperCase().replace(/[^A-Z]/g, '');
    const chaveLimpa = chave.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (chaveLimpa.length > 0) {
      const expandida = palavraLimpa.split('').map((_, i) => 
        chaveLimpa[i % chaveLimpa.length]
      ).join('');
      setChaveExpandida(expandida);
      
      const cifrado = palavraLimpa.split('').map((letra, i) => {
        const linhaIdx = alfabeto.indexOf(expandida[i]);
        const colunaIdx = alfabeto.indexOf(letra);
        return matriz[linhaIdx][colunaIdx];
      }).join('');
      setResultado(cifrado);
    }
    
  }, [palavra, chave, matriz]);

  const palavraLimpa = palavra.toUpperCase().replace(/[^A-Z]/g, '');
  const totalPassos = palavraLimpa.length;
  
  const letraAtual = passo < totalPassos ? palavraLimpa[passo] : '';
  const chaveAtual = passo < totalPassos ? chaveExpandida[passo] : '';
  const linhaDestaque = alfabeto.indexOf(chaveAtual);
  const colunaDestaque = alfabeto.indexOf(letraAtual);
  const letraCifrada = passo < totalPassos ? resultado[passo] : '';

  return (
    <>
      <style>{`
        /* Apenas estilos específicos do Vigenère, usando as cores do template */
        .vigenere-inputs-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.vigenere-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Layout */
.vigenere-main-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .vigenere-main-layout {
    grid-template-columns: 1fr;
  }
}

/* Panels */
.vigenere-left-panel,
.vigenere-right-panel {
  background: var(--surface-elevated);
  border: 1px solid var(--border-strong);
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Pairing items */
.vigenere-pairing-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.vigenere-pair-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
  min-width: 60px;
  transition: all 0.2s;
  opacity: 0.4;
}

.vigenere-pair-item.active {
  opacity: 1;
  border-color: var(--accent-cyan);
  background: rgba(83, 170, 255, 0.1);
  transform: scale(1.05);
}

.vigenere-pair-item.completed {
  opacity: 0.7;
  border-color: var(--accent-purple);
  background: rgba(255, 80, 182, 0.08);
}

/* Step info */
.vigenere-current-step-info {
  text-align: center;
  padding: 16px;
  background: rgba(83, 170, 255, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  border: 1px solid var(--accent-cyan);
}

/* Result section */
.vigenere-result-section h3 {
  margin-bottom: 16px;
}

.vigenere-result-text {
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 6px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--accent-cyan);
  text-align: center;
}

.vigenere-result-text span {
  transition: opacity 0.3s;
}

.visible {
  opacity: 1;
}

.hidden {
  opacity: 0.15;
}

/* Controls */
.vigenere-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.vigenere-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-primary);
  cursor: pointer;
  transition: transform 180ms ease, border 180ms ease, background 180ms ease;
}

.vigenere-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.08);
}

.vigenere-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.vigenere-step-counter {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  border: 1px solid var(--border-soft);
}

/* Highlight colors */
.vigenere-highlight-palavra {
  background: rgba(83, 170, 255, 0.2);
  color: var(--accent-cyan);
  padding: 4px 10px;
  border-radius: 6px;
}

.vigenere-highlight-chave {
  background: rgba(255, 80, 182, 0.2);
  color: var(--accent-purple);
  padding: 4px 10px;
  border-radius: 6px;
}

.vigenere-highlight-resultado {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  padding: 4px 10px;
  border-radius: 6px;
}

/* Matrix */
.vigenere-matrix-container {
  overflow-x: auto;
  background: rgba(255, 255, 255, 0.02);
  padding: 16px;
  border-radius: 12px;
}

.vigenere-matrix {
  border-collapse: collapse;
  margin: 0 auto;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
}

.vigenere-matrix th,
.vigenere-matrix td {
  width: 28px;
  height: 28px;
  text-align: center;
  border: 1px solid var(--border-soft);
  padding: 6px;
  transition: all 0.15s;
}

.vigenere-matrix th {
  background: rgba(255, 255, 255, 0.08);
  font-weight: bold;
  color: var(--text-muted);
}

.highlight-row {
  background: rgba(83, 170, 255, 0.25) !important;
  color: var(--accent-cyan) !important;
}

.highlight-col {
  background: rgba(83, 170, 255, 0.25) !important;
  color: var(--accent-cyan) !important;
}

.vigenere-highlight-cell {
  background: rgba(83, 170, 255, 0.1) !important;
}
  .vigenere-input-palavra,
.vigenere-input-chave {
  width: 220px;
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  transition: border 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.vigenere-input-palavra:focus,
.vigenere-input-chave:focus {
  border-color: var(--accent-cyan);
  background: rgba(83, 170, 255, 0.12);
  box-shadow: 0 0 8px rgba(83, 170, 255, 0.3);
  outline: none;
}

.vigenere-result-cell {
  background: var(--accent-cyan) !important;
  color: #05060a !important;
  font-weight: bold;
  transform: scale(1.15);
  box-shadow: 0 0 15px rgba(83, 170, 255, 0.5);
}
      `}</style>

      <div className="vigenere-container">
        <div className="vigenere-content">
          <h1 className="vigenere-title">🔐 Cifra de Vigenère</h1>

          <div className="vigenere-inputs-container">
            <div className="vigenere-input-group">
              <label>Palavra:</label>
              <input
                type="text"
                value={palavra}
                onChange={(e) => setPalavra(e.target.value)}
                className="vigenere-input-palavra"
              />
            </div>

            <div className="vigenere-input-group">
              <label>Chave:</label>
              <input
                type="text"
                value={chave}
                onChange={(e) => setChave(e.target.value)}
                className="vigenere-input-chave"
              />
            </div>
          </div>

          <div className="vigenere-main-layout">
            <div className="vigenere-left-panel">
              <div className="vigenere-pairing-section">
                <h3>Emparelhamento:</h3>

                <div className="vigenere-pairing-grid">
                  {palavraLimpa.split('').map((letra, i) => (
                    <div
                      key={i}
                      className={`vigenere-pair-item 
                        ${i === passo ? 'active' : ''} 
                        ${i < passo ? 'completed' : ''}`}
                    >
                      <div className="vigenere-letra-palavra">{letra}</div>
                      <div className="vigenere-arrow">↓</div>
                      <div className="vigenere-letra-chave">
                        {chaveExpandida[i]}
                      </div>
                      <div className="vigenere-arrow">↓</div>
                      <div className="vigenere-letra-resultado">
                        {i <= passo ? resultado[i] : '?'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="vigenere-controls">
                <button
                  onClick={() => setPasso((p) => Math.max(0, p - 1))}
                  disabled={passo === 0}
                  className="vigenere-btn"
                >
                  <ChevronLeft size={20} /> Anterior
                </button>

                <div className="vigenere-step-counter">
                  Passo {passo + 1} / {totalPassos}
                </div>

                <button
                  onClick={() =>
                    setPasso((p) => Math.min(totalPassos - 1, p + 1))
                  }
                  disabled={passo === totalPassos - 1}
                  className="vigenere-btn"
                >
                  Próximo <ChevronRight size={20} />
                </button>
              </div>

              {letraAtual && (
                <div className="vigenere-current-step-info">
                  Cifrando:{' '}
                  <span className="vigenere-highlight-palavra">
                    {letraAtual}
                  </span>{' '}
                  com chave{' '}
                  <span className="vigenere-highlight-chave">
                    {chaveAtual}
                  </span>{' '}
                  ={' '}
                  <span className="vigenere-highlight-resultado">
                    {letraCifrada}
                  </span>
                </div>
              )}

              <div className="vigenere-result-section">
                <h3>Texto Cifrado:</h3>
                <div className="vigenere-result-text">
                  {resultado.split('').map((letra, i) => (
                    <span
                      key={i}
                      className={i <= passo ? 'visible' : 'hidden'}
                    >
                      {letra}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="vigenere-right-panel">
              <h3>Tabela de Vigenère</h3>

              <div className="vigenere-matrix-container">
                <table className="vigenere-matrix">
                  <thead>
                    <tr>
                      <th></th>
                      {alfabeto.split('').map((l, i) => (
                        <th
                          key={i}
                          className={
                            i === colunaDestaque ? 'vigenere-highlight-col' : ''
                          }
                        >
                          {l}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {matriz.map((linha, i) => (
                      <tr key={i}>
                        <td
                          className={
                            i === linhaDestaque ? 'vigenere-highlight-row' : ''
                          }
                        >
                          {alfabeto[i]}
                        </td>

                        {linha.map((celula, j) => (
                          <td
                            key={j}
                            className={`
                          ${i === linhaDestaque ? 'vigenere-highlight-cell' : ''}
                          ${j === colunaDestaque ? 'vigenere-highlight-cell' : ''}
                          ${
                            i === linhaDestaque && j === colunaDestaque
                              ? 'vigenere-result-cell'
                              : ''
                          }
                        `}
                          >
                            {celula}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Algoritmo4() {
  return (
    <AlgorithmLayout algorithm={meta}>
      <VigenereCipher />
    </AlgorithmLayout>
  )
}