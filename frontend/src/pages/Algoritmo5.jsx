import { useState } from 'react';

export const meta = {
  slug: 'criador-5',
  label: 'ROT47',
  summary: 'Cifra de substituição que rotaciona 47 posições no conjunto de caracteres ASCII imprimíveis.',
  level: 'Básico',
  complexity: 'O(n)',
  tokens: ['Simétrica', 'Clássica', 'Educacional'],
  accent: '#ec4899',
  highlights: [
    {
      title: 'Quando usar',
      description: 'Ofuscação básica, aprendizado de criptografia, proteção leve de texto.',
    },
    {
      title: 'Vantagem',
      description: 'Simples, rápida e fácil de implementar. Útil para fins educacionais.',
    },
    {
      title: 'Cuidados',
      description: 'NÃO é segura para proteção real. Use apenas para ofuscação ou estudos.',
    },
  ],
};

function rot47(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);
    
    // ROT47 trabalha com caracteres ASCII de 33 (!) até 126 (~)
    if (code >= 33 && code <= 126) {
      // Rotaciona 47 posições no intervalo de 94 caracteres
      const rotated = ((code - 33 + 47) % 94) + 33;
      result += String.fromCharCode(rotated);
    } else {
      // Mantém caracteres fora do intervalo (espaços, quebras de linha, etc)
      result += char;
    }
  }
  return result;
}

export default function Algoritmo5() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleProcess = () => {
    // ROT47 é simétrico - mesma operação para cifrar e decifrar
    const result = rot47(inputText);
    setOutputText(result);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  const exampleTexts = [
    'Hello, World!',
    'ROT47 é simples e educativo.',
    'Segurança123@#$',
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #111827, #581c87, #831843)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={meta.accent} strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{meta.label}</h1>
          </div>
          <p style={{ fontSize: '1.25rem', color: '#d1d5db', maxWidth: '48rem', margin: '0 auto' }}>{meta.summary}</p>
          
          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <span style={{ padding: '0.5rem 1rem', background: 'rgba(147, 51, 234, 0.3)', color: '#ddd6fe', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', border: '1px solid rgba(147, 51, 234, 0.3)' }}>
              {meta.level}
            </span>
            <span style={{ padding: '0.5rem 1rem', background: 'rgba(236, 72, 153, 0.3)', color: '#fbcfe8', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
              {meta.complexity}
            </span>
            {meta.tokens.map((token, idx) => (
              <span key={idx} style={{ padding: '0.5rem 1rem', background: 'rgba(55, 65, 81, 0.5)', color: '#e5e7eb', borderRadius: '9999px', fontSize: '0.875rem', border: '1px solid #4b5563' }}>
                {token}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 1024 ? '1fr 1fr' : '1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Input Section */}
          <div style={{ background: 'rgba(31, 41, 55, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(75, 85, 99, 0.5)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={meta.accent} strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Texto de Entrada
              </h2>
              <button
                onClick={() => setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt')}
                style={{ padding: '0.5rem 1rem', background: '#9333ea', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
              >
                Modo: {mode === 'encrypt' ? 'Cifrar' : 'Decifrar'}
              </button>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite o texto aqui..."
              style={{ width: '100%', height: '16rem', background: 'rgba(17, 24, 39, 0.5)', color: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #374151', outline: 'none', resize: 'none', fontFamily: 'monospace', fontSize: '0.875rem', boxSizing: 'border-box' }}
            />

            {/* Example Buttons */}
            <div style={{ marginTop: '1rem' }}>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Exemplos rápidos:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {exampleTexts.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(example)}
                    style={{ padding: '0.25rem 0.75rem', background: '#374151', color: '#d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={!inputText}
              style={{
                width: '100%',
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                border: 'none',
                cursor: inputText ? 'pointer' : 'not-allowed',
                background: inputText ? `linear-gradient(135deg, ${meta.accent}, #9333ea)` : '#4b5563',
                color: 'white',
                opacity: inputText ? 1 : 0.5
              }}
            >
              {mode === 'encrypt' ? '🔒 Cifrar Texto' : '🔓 Decifrar Texto'}
            </button>
          </div>

          {/* Output Section */}
          <div style={{ background: 'rgba(31, 41, 55, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(75, 85, 99, 0.5)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={meta.accent} strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                </svg>
                Resultado
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleSwap}
                  disabled={!outputText}
                  style={{ padding: '0.5rem', background: '#374151', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: outputText ? 'pointer' : 'not-allowed', opacity: outputText ? 1 : 0.5 }}
                  title="Trocar entrada/saída"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  style={{ padding: '0.5rem', background: '#374151', color: outputText && copied ? '#4ade80' : 'white', borderRadius: '0.5rem', border: 'none', cursor: outputText ? 'pointer' : 'not-allowed', opacity: outputText ? 1 : 0.5 }}
                  title="Copiar resultado"
                >
                  {copied ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div style={{ width: '100%', height: '16rem', background: 'rgba(17, 24, 39, 0.5)', color: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #374151', overflow: 'auto', fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxSizing: 'border-box' }}>
              {outputText || <span style={{ color: '#6b7280' }}>O resultado aparecerá aqui...</span>}
            </div>

            {outputText && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(17, 24, 39, 0.5)', borderRadius: '0.5rem', border: '1px solid #374151' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <p style={{ color: '#9ca3af', margin: '0 0 0.25rem 0' }}>Caracteres processados:</p>
                    <p style={{ color: 'white', fontFamily: 'monospace', fontSize: '1.125rem', margin: 0 }}>{outputText.length}</p>
                  </div>
                  <div>
                    <p style={{ color: '#9ca3af', margin: '0 0 0.25rem 0' }}>Tempo de processo:</p>
                    <p style={{ color: 'white', fontFamily: 'monospace', fontSize: '1.125rem', margin: 0 }}>~0ms</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Highlights Section */}
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr 1fr' : '1fr', gap: '1.5rem', marginBottom: '3rem' }}>
          {meta.highlights.map((highlight, idx) => (
            <div
              key={idx}
              style={{ background: 'rgba(31, 41, 55, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid rgba(75, 85, 99, 0.5)' }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: meta.accent }}>
                {highlight.title}
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.625', margin: 0 }}>{highlight.description}</p>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div style={{ background: 'rgba(31, 41, 55, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(75, 85, 99, 0.5)' }}>
          <button
            onClick={() => setShowInfo(!showInfo)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={meta.accent} strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Como funciona a ROT47?
            </h3>
            <span style={{ color: '#9ca3af', fontSize: '1.5rem' }}>
              {showInfo ? '▼' : '▶'}
            </span>
          </button>

          {showInfo && (
            <div style={{ marginTop: '1.5rem', color: '#d1d5db', lineHeight: '1.625' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'white' }}>ROT47</strong> é uma extensão da famosa cifra ROT13, que trabalha com 
                um conjunto maior de caracteres ASCII imprimíveis (94 caracteres, do código 33 ao 126).
              </p>

              <div style={{ background: 'rgba(17, 24, 39, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #374151', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#c084fc', margin: 0 }}>
                  Caracteres abrangidos: ! " # $ % & ' ( ) * + , - . / 0-9 : ; &lt; = &gt; ? @ A-Z [ \ ] ^ _ ` a-z &#123; | &#125; ~
                </p>
              </div>

              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'white' }}>Funcionamento:</strong> Cada caractere é substituído por outro que 
                está 47 posições à frente no conjunto de 94 caracteres. Quando ultrapassa o último caractere (~), 
                volta ao início (!).
              </p>

              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'white' }}>Propriedade simétrica:</strong> Aplicar ROT47 duas vezes retorna 
                o texto original. Por isso, a mesma operação serve para cifrar e decifrar.
              </p>

              <div style={{ background: 'rgba(113, 63, 18, 0.2)', border: '1px solid rgba(180, 83, 9, 0.5)', borderRadius: '0.5rem', padding: '1rem', marginTop: '1rem' }}>
                <p style={{ color: '#fef08a', fontWeight: '600', marginBottom: '0.5rem' }}>⚠️ Aviso de Segurança</p>
                <p style={{ color: '#fef3c7', fontSize: '0.875rem', margin: 0 }}>
                  ROT47 NÃO é criptografia segura! É apenas uma cifra de substituição simples, facilmente 
                  quebrada. Use apenas para ofuscação leve ou fins educacionais.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ background: 'rgba(20, 83, 45, 0.2)', border: '1px solid rgba(21, 128, 61, 0.5)', borderRadius: '0.5rem', padding: '1rem' }}>
                  <p style={{ color: '#bbf7d0', fontWeight: '600', marginBottom: '0.5rem' }}>✓ Casos de uso válidos</p>
                  <ul style={{ color: '#d1fae5', fontSize: '0.875rem', margin: 0, paddingLeft: '1.25rem' }}>
                    <li>Aprendizado de criptografia</li>
                    <li>Ofuscação básica de spoilers</li>
                    <li>Puzzles e jogos</li>
                    <li>Demonstrações educacionais</li>
                  </ul>
                </div>

                <div style={{ background: 'rgba(127, 29, 29, 0.2)', border: '1px solid rgba(185, 28, 28, 0.5)', borderRadius: '0.5rem', padding: '1rem' }}>
                  <p style={{ color: '#fecaca', fontWeight: '600', marginBottom: '0.5rem' }}>✗ Não usar para</p>
                  <ul style={{ color: '#fee2e2', fontSize: '0.875rem', margin: 0, paddingLeft: '1.25rem' }}>
                    <li>Proteção de senhas</li>
                    <li>Dados sensíveis</li>
                    <li>Comunicação confidencial</li>
                    <li>Segurança em produção</li>
                  </ul>
                </div>
              </div>

              <div style={{ background: 'rgba(17, 24, 39, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #374151', marginTop: '1.5rem' }}>
                <p style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>Exemplo de transformação:</p>
                <div style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#9ca3af', width: '5rem' }}>Original:</span>
                    <span style={{ color: 'white' }}>Hello!</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#9ca3af', width: '5rem' }}>ROT47:</span>
                    <span style={{ color: meta.accent }}>w6==@P</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ color: '#9ca3af', width: '5rem' }}>Novamente:</span>
                    <span style={{ color: 'white' }}>Hello!</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}