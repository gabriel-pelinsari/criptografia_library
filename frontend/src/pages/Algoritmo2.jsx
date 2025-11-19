import { useState } from 'react'
import AlgorithmLayout from '../components/AlgorithmLayout.jsx'

export const meta = {
  slug: 'rail-fence',
  label: 'Rail Fence Cipher',
  summary:
    'Cifra de transposição clássica que reorganiza as letras em um padrão zig-zag. Inclui duas variantes: clássica e de trilho com ordem customizada.',
  level: 'Básico',
  complexity: 'O(n)',
  tokens: ['Transposição', 'Clássica', 'Zig-Zag', 'Trilho'],
  accent: 'var(--accent-purple)',
  highlights: [
    {
      title: 'Quando usar',
      description: 'Educação em criptografia, demonstrações históricas e compreensão de cifras de transposição.',
    },
    {
      title: 'Vantagem',
      description: 'Simples de implementar, mantém frequência de letras, excelente para fins didáticos. Variante de trilho adiciona complexidade.',
    },
    {
      title: 'Cuidados',
      description: 'Não é segura para uso real. Facilmente quebrada por força bruta devido ao número limitado de chaves.',
    },
  ],
}

// Rail Fence Encryption (Classic)
function railFenceEncrypt(text, rails) {
  if (rails <= 1 || !text) return text
  
  const fence = Array.from({ length: rails }, () => [])
  let rail = 0
  let direction = 1
  
  for (let char of text) {
    fence[rail].push(char)
    rail += direction
    
    if (rail === 0 || rail === rails - 1) {
      direction *= -1
    }
  }
  
  return fence.map(row => row.join('')).join('')
}

// Rail Fence Encryption with Custom Order (Trilho)
function railFenceEncryptWithOrder(text, rails, order) {
  if (rails <= 1 || !text) return text
  
  const fence = Array.from({ length: rails }, () => [])
  let rail = 0
  let direction = 1
  
  for (let char of text) {
    fence[rail].push(char)
    rail += direction
    
    if (rail === 0 || rail === rails - 1) {
      direction *= -1
    }
  }
  
  // Read rails in custom order
  return order.map(i => fence[i].join('')).join('')
}

// Rail Fence Decryption (Classic)
function railFenceDecrypt(cipher, rails) {
  if (rails <= 1 || !cipher) return cipher
  
  const fence = Array.from({ length: rails }, () => [])
  const positions = []
  let rail = 0
  let direction = 1
  
  // Mark positions
  for (let i = 0; i < cipher.length; i++) {
    positions.push(rail)
    rail += direction
    
    if (rail === 0 || rail === rails - 1) {
      direction *= -1
    }
  }
  
  // Fill the fence
  let index = 0
  for (let r = 0; r < rails; r++) {
    for (let i = 0; i < positions.length; i++) {
      if (positions[i] === r) {
        fence[r].push(cipher[index++])
      }
    }
  }
  
  // Read the fence
  const result = []
  rail = 0
  direction = 1
  const counters = Array(rails).fill(0)
  
  for (let i = 0; i < cipher.length; i++) {
    result.push(fence[rail][counters[rail]++])
    rail += direction
    
    if (rail === 0 || rail === rails - 1) {
      direction *= -1
    }
  }
  
  return result.join('')
}

// Rail Fence Decryption with Custom Order (Trilho)
function railFenceDecryptWithOrder(cipher, rails, order) {
  if (rails <= 1 || !cipher) return cipher
  
  const fence = Array.from({ length: rails }, () => [])
  const positions = []
  let rail = 0
  let direction = 1
  
  // Mark positions
  for (let i = 0; i < cipher.length; i++) {
    positions.push(rail)
    rail += direction
    
    if (rail === 0 || rail === rails - 1) {
      direction *= -1
    }
  }
  
  // Count characters per rail
  const railCounts = Array(rails).fill(0)
  positions.forEach(p => railCounts[p]++)
  
  // Distribute cipher text according to order
  const orderedFence = Array.from({ length: rails }, () => [])
  let index = 0
  for (let orderIndex of order) {
    const count = railCounts[orderIndex]
    orderedFence[orderIndex] = cipher.substr(index, count).split('')
    index += count
  }
  
  // Read the fence
  const result = []
  rail = 0
  direction = 1
  const counters = Array(rails).fill(0)
  
  for (let i = 0; i < cipher.length; i++) {
    result.push(orderedFence[rail][counters[rail]++])
    rail += direction
    
    if (rail === 0 || rail === rails - 1) {
      direction *= -1
    }
  }
  
  return result.join('')
}

// Visualization component
function RailFenceVisualization({ text, rails, isEncryption, variant, order }) {
  if (!text || rails <= 1) return null
  
  const fence = Array.from({ length: rails }, () => [])
  const visualGrid = Array.from({ length: rails }, () => 
    Array(text.length).fill(null)
  )
  
  let rail = 0
  let direction = 1
  
  for (let i = 0; i < text.length; i++) {
    visualGrid[rail][i] = text[i]
    fence[rail].push(text[i])
    rail += direction
    
    if (rail === 0 || rail === rails - 1) {
      direction *= -1
    }
  }
  
  return (
    <div style={{ marginTop: '20px' }}>
      <p style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.8 }}>
        Padrão Zig-Zag (Rails: {rails})
        {variant === 'trilho' && ` - Ordem de leitura: ${order.map(i => i + 1).join(', ')}`}
      </p>
      <div style={{ 
        fontFamily: 'monospace', 
        fontSize: '16px',
        lineHeight: '2.5',
        background: 'rgba(0,0,0,0.2)',
        padding: '15px',
        borderRadius: '8px',
        overflowX: 'auto'
      }}>
        {visualGrid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: '10px' }}>
            {row.map((char, colIndex) => (
              <span 
                key={colIndex}
                style={{
                  width: '20px',
                  textAlign: 'center',
                  color: char ? 'var(--accent-purple)' : 'transparent',
                  fontWeight: char ? 'bold' : 'normal'
                }}
              >
                {char || '·'}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '15px', fontSize: '14px' }}>
        <p style={{ marginBottom: '5px', opacity: 0.8 }}>
          {variant === 'trilho' ? 'Leitura por linha (ordem customizada):' : 'Leitura por linha:'}
        </p>
        {(variant === 'trilho' ? order : Array.from({ length: rails }, (_, i) => i)).map((railIndex, displayOrder) => (
          <div key={railIndex} style={{ 
            padding: '8px', 
            background: 'rgba(0,0,0,0.2)',
            marginBottom: '5px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>
            <span style={{ opacity: 0.6 }}>
              {variant === 'trilho' ? `${displayOrder + 1}ª leitura - Rail ${railIndex + 1}` : `Rail ${railIndex + 1}`}: 
            </span>
            <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>
              {' '}{fence[railIndex].join('')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main cipher component
function RailFenceCipher() {
  const [variant, setVariant] = useState('classic')
  const [mode, setMode] = useState('encrypt')
  const [input, setInput] = useState('')
  const [rails, setRails] = useState(3)
  const [output, setOutput] = useState('')
  const [showVisualization, setShowVisualization] = useState(false)
  const [customOrder, setCustomOrder] = useState('0,1,2')

  // Parse custom order
  const parseOrder = () => {
    try {
      const order = customOrder.split(',').map(s => parseInt(s.trim()))
      if (order.length !== rails || order.some(n => isNaN(n) || n < 0 || n >= rails)) {
        return Array.from({ length: rails }, (_, i) => i)
      }
      // Check for duplicates
      if (new Set(order).size !== order.length) {
        return Array.from({ length: rails }, (_, i) => i)
      }
      return order
    } catch {
      return Array.from({ length: rails }, (_, i) => i)
    }
  }

  const handleProcess = () => {
    const cleanInput = input.replace(/\s/g, '').toUpperCase()
    if (!cleanInput) {
      setOutput('')
      return
    }
    
    const order = parseOrder()
    
    if (mode === 'encrypt') {
      if (variant === 'classic') {
        setOutput(railFenceEncrypt(cleanInput, rails))
      } else {
        setOutput(railFenceEncryptWithOrder(cleanInput, rails, order))
      }
    } else {
      if (variant === 'classic') {
        setOutput(railFenceDecrypt(cleanInput, rails))
      } else {
        setOutput(railFenceDecryptWithOrder(cleanInput, rails, order))
      }
    }
    setShowVisualization(true)
  }

  // Examples for Classic variant
  const classicExamples = [
    { label: 'Ex 1: "THIS IS A TEST" (3 rails)', text: 'THIS IS A TEST', rails: 3 },
    { label: 'Ex 2: "WE ARE DISCOVERED" (3 rails)', text: 'WEAREDISCOVEREDFLEEATONCE', rails: 3 },
    { label: 'Ex 3: "HELLO WORLD" (4 rails)', text: 'HELLO WORLD', rails: 4 },
    { label: 'Ex 4: "ATTACK AT DAWN" (5 rails)', text: 'ATTACK AT DAWN', rails: 5 },
    { label: 'Ex 5: "CRYPTOGRAPHY" (2 rails)', text: 'CRYPTOGRAPHY', rails: 2 },
  ]

  // Examples for Trilho variant
  const trilhoExamples = [
    { label: 'Ex 1: "ATTACK AT DAWN" (3 rails, ordem 2,0,1)', text: 'ATTACK AT DAWN', rails: 3, order: '2,0,1' },
    { label: 'Ex 2: "SECRET MESSAGE" (4 rails, ordem 3,1,0,2)', text: 'SECRET MESSAGE', rails: 4, order: '3,1,0,2' },
    { label: 'Ex 3: "CONFIDENTIAL" (3 rails, ordem 1,2,0)', text: 'CONFIDENTIAL', rails: 3, order: '1,2,0' },
    { label: 'Ex 4: "MEET AT MIDNIGHT" (5 rails, ordem 4,2,0,3,1)', text: 'MEET AT MIDNIGHT', rails: 5, order: '4,2,0,3,1' },
    { label: 'Ex 5: "TOP SECRET" (4 rails, ordem 2,3,1,0)', text: 'TOP SECRET', rails: 4, order: '2,3,1,0' },
  ]

  const loadExample = (exampleIndex) => {
    const examples = variant === 'classic' ? classicExamples : trilhoExamples
    const example = examples[exampleIndex]
    
    if (!example) return
    
    setMode('encrypt')
    setInput(example.text)
    setRails(example.rails)
    
    if (variant === 'trilho' && example.order) {
      setCustomOrder(example.order)
    } else {
      setCustomOrder(Array.from({ length: example.rails }, (_, i) => i).join(','))
    }
    
    setShowVisualization(false)
    setOutput('')
  }

  // Update custom order when rails change
  const handleRailsChange = (newRails) => {
    setRails(newRails)
    setCustomOrder(Array.from({ length: newRails }, (_, i) => i).join(','))
    setOutput('')
    setShowVisualization(false)
  }

  // Get current examples based on variant
  const currentExamples = variant === 'classic' ? classicExamples : trilhoExamples

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Variant Selection */}
      <div>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
          Tipo de Cifra Rail Fence
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={variant === 'classic' ? 'btn btn--primary' : 'btn btn--secondary'}
            onClick={() => { 
              setVariant('classic'); 
              setOutput(''); 
              setShowVisualization(false);
              setInput('');
              setRails(3);
              setCustomOrder('0,1,2');
            }}
            style={{ flex: 1 }}
          >
            📊 Clássica
          </button>
          <button
            className={variant === 'trilho' ? 'btn btn--primary' : 'btn btn--secondary'}
            onClick={() => { 
              setVariant('trilho'); 
              setOutput(''); 
              setShowVisualization(false);
              setInput('');
              setRails(3);
              setCustomOrder('0,1,2');
            }}
            style={{ flex: 1 }}
          >
            🚂 De Trilho (Ordem Customizada)
          </button>
        </div>
        <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>
          {variant === 'classic' 
            ? 'Leitura sequencial dos rails (1, 2, 3...)'
            : 'Leitura dos rails em ordem personalizada (ex: 3, 1, 2)'}
        </p>
      </div>

      {/* Mode Selection */}
      <div>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
          Modo de Operação
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={mode === 'encrypt' ? 'btn btn--primary' : 'btn btn--secondary'}
            onClick={() => { setMode('encrypt'); setOutput(''); setShowVisualization(false); }}
            style={{ flex: 1 }}
          >
            Cifrar
          </button>
          <button
            className={mode === 'decrypt' ? 'btn btn--primary' : 'btn btn--secondary'}
            onClick={() => { setMode('decrypt'); setOutput(''); setShowVisualization(false); }}
            style={{ flex: 1 }}
          >
            Decifrar
          </button>
        </div>
      </div>

      {/* Examples */}
      <div>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
          Exemplos Prontos {variant === 'classic' ? '(Clássica)' : '(Trilho)'}
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {currentExamples.map((example, index) => (
            <button 
              key={index}
              className="btn btn--ghost" 
              onClick={() => loadExample(index)}
            >
              {example.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>
          {variant === 'classic' 
            ? 'Exemplos com leitura sequencial dos rails'
            : 'Exemplos com ordem de leitura personalizada para maior segurança'}
        </p>
      </div>

      {/* Rails Input */}
      <div>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
          Número de Rails (Chave): {rails}
        </label>
        <input
          type="range"
          min="2"
          max="10"
          value={rails}
          onChange={(e) => handleRailsChange(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
          O número de rails determina quantas "linhas" do padrão zig-zag serão usadas
        </p>
      </div>

      {/* Custom Order Input (only for Trilho variant) */}
      {variant === 'trilho' && (
        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
            Ordem de Leitura dos Rails (Chave Adicional)
          </label>
          <input
            type="text"
            value={customOrder}
            onChange={(e) => { setCustomOrder(e.target.value); setOutput(''); setShowVisualization(false); }}
            placeholder={`Ex: ${Array.from({ length: rails }, (_, i) => i).join(',')}`}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(0,0,0,0.2)',
              color: 'inherit',
              fontFamily: 'inherit',
              fontSize: '14px'
            }}
          />
          <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
            Digite a ordem de leitura separada por vírgulas (0 a {rails - 1}). 
            Ex: "2,0,1" lê o 3º rail, depois o 1º, depois o 2º
          </p>
          <div style={{ 
            marginTop: '8px', 
            padding: '8px', 
            background: 'rgba(100,100,255,0.1)', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <strong>📌 Ordem atual:</strong> {parseOrder().map((i, idx) => (
              <span key={idx}>
                {idx > 0 ? ' → ' : ''}Rail {i + 1}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
          {mode === 'encrypt' ? 'Texto Original' : 'Texto Cifrado'}
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(''); setShowVisualization(false); }}
          placeholder={mode === 'encrypt' ? 'Digite sua mensagem...' : 'Digite o texto cifrado...'}
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.2)',
            color: 'inherit',
            fontFamily: 'inherit',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
        <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
          Espaços serão removidos automaticamente
        </p>
      </div>

      {/* Process Button */}
      <button 
        className="btn btn--primary" 
        onClick={handleProcess}
        disabled={!input.trim()}
        style={{ width: '100%' }}
      >
        {mode === 'encrypt' ? '🔒 Cifrar Mensagem' : '🔓 Decifrar Mensagem'}
      </button>

      {/* Output */}
      {output && (
        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
            {mode === 'encrypt' ? 'Texto Cifrado' : 'Texto Decifrado'}
          </label>
          <div style={{
            padding: '15px',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.3)',
            border: '2px solid var(--accent-purple)',
            fontFamily: 'monospace',
            fontSize: '16px',
            wordBreak: 'break-all',
            letterSpacing: '2px'
          }}>
            {output}
          </div>
        </div>
      )}

      {/* Visualization */}
      {showVisualization && mode === 'encrypt' && (
        <RailFenceVisualization 
          text={input.replace(/\s/g, '').toUpperCase()} 
          rails={rails}
          isEncryption={true}
          variant={variant}
          order={parseOrder()}
        />
      )}

      {/* Educational Info */}
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        background: 'rgba(0,0,0,0.2)', 
        borderRadius: '8px',
        borderLeft: '4px solid var(--accent-purple)'
      }}>
        <h4 style={{ marginBottom: '10px' }}>📚 Como Funciona</h4>
        <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
          O Rail Fence Cipher é uma cifra de <strong>transposição</strong>, diferente das cifras de 
          <strong> substituição</strong>. Em vez de trocar letras, ela reorganiza a ordem das letras 
          no texto original.
        </p>
        
        <h5 style={{ marginBottom: '8px', marginTop: '15px' }}>🔹 Variante Clássica:</h5>
        <ol style={{ fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Escreve as letras em padrão zig-zag com N rails</li>
          <li>Lê cada rail sequencialmente (1, 2, 3...)</li>
          <li>Concatena para formar o texto cifrado</li>
        </ol>
        
        <h5 style={{ marginBottom: '8px', marginTop: '15px' }}>🔹 Variante de Trilho (Ordem Customizada):</h5>
        <ol style={{ fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Escreve as letras em padrão zig-zag (igual à clássica)</li>
          <li><strong>Lê os rails em ordem personalizada</strong> (ex: 3, 1, 2)</li>
          <li>Adiciona uma camada extra de segurança com a chave de ordem</li>
        </ol>
        
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: 'rgba(100,200,255,0.1)',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          <strong>💡 Exemplo de Trilho:</strong> Com 3 rails e ordem "2,0,1", você lê o rail 3 primeiro, 
          depois o rail 1, e por último o rail 2. Isso torna a cifra mais difícil de quebrar!
        </div>
        
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: 'rgba(255,200,0,0.1)',
          borderRadius: '4px'
        }}>
          <strong>⚠️ Nota de Segurança:</strong> Mesmo com a variante de trilho, esta cifra não é segura 
          para uso real. O número de combinações possíveis ainda é limitado (rails! permutações). 
          Use apenas para fins educacionais!
        </div>
      </div>
    </div>
  )
}

export default function Algoritmo2() {
  return (
    <AlgorithmLayout algorithm={meta}>
      <RailFenceCipher />
    </AlgorithmLayout>
  )
}
