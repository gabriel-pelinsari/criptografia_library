import React, { useState } from 'react';
import { Play, RotateCcw, Lock, Unlock, ChevronRight } from 'lucide-react';
import AlgorithmLayout from '../components/AlgorithmLayout.jsx';

const ALFABETO_PADRAO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?.:*()&%123456789¨";

export const meta = {
  slug: 'chaocipher',
  label: 'Chaocipher',
  summary:
    'Algoritmo de criptografia manual inventado por John F. Byrne em 1918, que utiliza dois discos rotativos com permutações dinâmicas a cada caractere. Apesar de Byrne acreditar ser indecifrável, pesquisas de 2016 revelaram vulnerabilidades significativas quando múltiplas mensagens são cifradas com a mesma chave.',
  level: 'Avançado',
  complexity: 'O(n)',
  tokens: ['Simétrica', 'Substituição', 'Histórico'],
  accent: 'var(--accent-cyan)',
  highlights: [
    {
      title: 'Quando usar',
      description: 'Principalmente para fins educacionais e históricos. Demonstra conceitos de criptografia clássica com comportamento autokey, onde cada permutação depende dos caracteres anteriores.',
    },
    {
      title: 'Vantagem',
      description: 'Resistente à análise de frequência básica devido às permutações constantes. O algoritmo foi mantido secreto por décadas (1918-2010), demonstrando o princípio de "segurança por obscuridade".',
    },
    {
      title: 'Cuidados',
      description: 'Vulnerável a ataques de texto conhecido (50-80 caracteres) e ataques ciphertext-only com 60-80 mensagens "in-depth" (mesma chave). Qualquer erro de transmissão corrompe toda a mensagem subsequente devido ao comportamento autokey.',
    },
  ],
};

const ChaocipherContent = () => {
  const [alfabeto, setAlfabeto] = useState(ALFABETO_PADRAO);
  const [leftDisk, setLeftDisk] = useState(ALFABETO_PADRAO.split(''));
  const [rightDisk, setRightDisk] = useState(ALFABETO_PADRAO.split(''));
  const [inputText, setInputText] = useState('OLA TUDO BEM');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationLog, setAnimationLog] = useState([]);
  const [highlightLeft, setHighlightLeft] = useState(-1);
  const [highlightRight, setHighlightRight] = useState(-1);

  const resetDisks = () => {
    setLeftDisk(alfabeto.split(''));
    setRightDisk(alfabeto.split(''));
    setOutputText('');
    setAnimationLog([]);
    setHighlightLeft(-1);
    setHighlightRight(-1);
    setIsAnimating(false);
  };

  const handleAlfabetoChange = (newAlfabeto) => {
    setAlfabeto(newAlfabeto);
    setLeftDisk(newAlfabeto.split(''));
    setRightDisk(newAlfabeto.split(''));
    setOutputText('');
    setAnimationLog([]);
  };

  const addLog = (message) => {
    setAnimationLog(prev => [...prev, message]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const startAnimation = async () => {
    if (isAnimating) return;
    
    setOutputText('');
    setAnimationLog([]);
    setIsAnimating(true);
    
    let currentLeft = alfabeto.split('');
    let currentRight = alfabeto.split('');
    
    setLeftDisk(currentLeft);
    setRightDisk(currentRight);
    
    const text = inputText.toUpperCase().replace(/\s+/g, '');
    let result = '';
    const nadirPos = Math.floor(alfabeto.length / 2);
    
    addLog(`🚀 Iniciando ${mode === 'encrypt' ? 'ENCRIPTAÇÃO' : 'DECRIPTAÇÃO'}`);
    addLog(`📝 Texto: "${text}"`);
    addLog(`⚙️  Tamanho do alfabeto: ${alfabeto.length} | Nadir na posição: ${nadirPos}\n`);
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (!currentRight.includes(char) && mode === 'encrypt') continue;
      if (!currentLeft.includes(char) && mode === 'decrypt') continue;
      
      addLog(`\n═══ Letra ${i + 1}: '${char}' ═══`);
      
      if (mode === 'encrypt') {
        const pIdx = currentRight.indexOf(char);
        setHighlightRight(pIdx);
        await sleep(400);
        
        const cipherChar = currentLeft[pIdx];
        setHighlightLeft(pIdx);
        result += cipherChar;
        setOutputText(result);
        
        addLog(`📍 '${char}' na posição ${pIdx} do disco direito`);
        addLog(`🔐 Cifrado: '${cipherChar}' (mesma posição no disco esquerdo)`);
        await sleep(600);
        
        addLog(`🔄 Permutando disco esquerdo com '${cipherChar}'...`);
        
        let idx = currentLeft.indexOf(cipherChar);
        currentLeft = [...currentLeft.slice(idx), ...currentLeft.slice(0, idx)];
        
        const extractedLeft = currentLeft.splice(1, 1)[0];
        currentLeft.splice(nadirPos, 0, extractedLeft);
        
        setLeftDisk([...currentLeft]);
        setHighlightLeft(-1);
        await sleep(400);
        
        addLog(`🔄 Permutando disco direito com '${char}'...`);
        
        idx = currentRight.indexOf(char);
        currentRight = [...currentRight.slice(idx), ...currentRight.slice(0, idx)];
        
        const zenith = currentRight.shift();
        currentRight.push(zenith);
        
        const extractedRight = currentRight.splice(2, 1)[0];
        currentRight.splice(nadirPos, 0, extractedRight);
        
        setRightDisk([...currentRight]);
        setHighlightRight(-1);
        await sleep(400);
        
      } else {
        const cIdx = currentLeft.indexOf(char);
        setHighlightLeft(cIdx);
        await sleep(400);
        
        const plainChar = currentRight[cIdx];
        setHighlightRight(cIdx);
        result += plainChar;
        setOutputText(result);
        
        addLog(`📍 '${char}' na posição ${cIdx} do disco esquerdo`);
        addLog(`🔓 Decifrado: '${plainChar}' (mesma posição no disco direito)`);
        await sleep(600);
        
        addLog(`🔄 Permutando disco esquerdo com '${char}'...`);
        
        let idx = currentLeft.indexOf(char);
        currentLeft = [...currentLeft.slice(idx), ...currentLeft.slice(0, idx)];
        
        const extractedLeft = currentLeft.splice(1, 1)[0];
        currentLeft.splice(nadirPos, 0, extractedLeft);
        
        setLeftDisk([...currentLeft]);
        setHighlightLeft(-1);
        await sleep(400);
        
        addLog(`🔄 Permutando disco direito com '${plainChar}'...`);
        
        idx = currentRight.indexOf(plainChar);
        currentRight = [...currentRight.slice(idx), ...currentRight.slice(0, idx)];
        
        const zenith = currentRight.shift();
        currentRight.push(zenith);
        
        const extractedRight = currentRight.splice(2, 1)[0];
        currentRight.splice(nadirPos, 0, extractedRight);
        
        setRightDisk([...currentRight]);
        setHighlightRight(-1);
        await sleep(400);
      }
    }
    
    addLog(`\n✅ Concluído!`);
    addLog(`📝 Resultado: ${result}`);
    setIsAnimating(false);
  };

  const DiskDisplay = ({ disk, label, highlight }) => {
    const zenith = 0;
    const nadir = Math.floor(disk.length / 2);
    
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '16px',
          color: '#22d3ee'
        }}>{label}</h3>
        <div style={{ position: 'relative' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '4px' 
          }}>
            {disk.map((char, idx) => {
              const isZenith = idx === zenith;
              const isNadir = idx === nadir;
              const isHighlighted = idx === highlight;
              
              let bgColor = '#374151';
              let textColor = '#d1d5db';
              let transform = 'scale(1)';
              let boxShadow = 'none';
              
              if (isZenith) {
                bgColor = '#eab308';
                textColor = '#000';
                transform = 'scale(1.1)';
                boxShadow = '0 0 15px rgba(234, 179, 8, 0.5)';
              }
              if (isNadir) {
                bgColor = '#a855f7';
                textColor = '#fff';
                transform = 'scale(1.1)';
                boxShadow = '0 0 15px rgba(168, 85, 247, 0.5)';
              }
              if (isHighlighted) {
                boxShadow = '0 0 0 4px #4ade80';
                transform = 'scale(1.25)';
              }
              
              return (
                <div
                  key={idx}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    backgroundColor: bgColor,
                    color: textColor,
                    transform: transform,
                    boxShadow: boxShadow,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: isHighlighted ? 10 : 1
                  }}
                >
                  {char}
                </div>
              );
            })}
          </div>
          <div style={{ 
            marginTop: '16px', 
            display: 'flex', 
            justifyContent: 'space-around', 
            fontSize: '0.75rem',
            color: '#9ca3af'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#eab308', borderRadius: '2px' }}></div>
              <span>Zênite (Pos 0)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#a855f7', borderRadius: '2px' }}></div>
              <span>Nadir (Pos {nadir})</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Área de controles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#e5e7eb'
          }}>
            Alfabeto Customizado:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={alfabeto}
              onChange={(e) => handleAlfabetoChange(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}
              placeholder="Digite o alfabeto..."
              disabled={isAnimating}
            />
            <button
              onClick={() => handleAlfabetoChange(ALFABETO_PADRAO)}
              disabled={isAnimating}
              style={{
                padding: '12px 16px',
                backgroundColor: '#374151',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                opacity: isAnimating ? 0.5 : 1
              }}
              title="Restaurar alfabeto padrão"
            >
              Padrão
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
            {alfabeto.length} caracteres | Cada caractere deve ser único
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => setMode('encrypt')}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: mode === 'encrypt' ? '#059669' : '#374151',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Lock size={20} />
            Encriptar
          </button>
          <button
            onClick={() => setMode('decrypt')}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: mode === 'decrypt' ? '#2563eb' : '#374151',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Unlock size={20} />
            Decriptar
          </button>
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#e5e7eb'
          }}>
            Texto de Entrada:
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.875rem'
            }}
            placeholder="Digite seu texto..."
            disabled={isAnimating}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#e5e7eb'
          }}>
            Resultado:
          </label>
          <div style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            fontFamily: 'monospace',
            color: '#22d3ee',
            minHeight: '48px',
            wordBreak: 'break-all'
          }}>
            {outputText || '...'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={startAnimation}
            disabled={isAnimating || !inputText}
            style={{
              flex: 1,
              background: 'linear-gradient(90deg, #0891b2 0%, #2563eb 100%)',
              color: '#fff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: isAnimating || !inputText ? 'not-allowed' : 'pointer',
              opacity: isAnimating || !inputText ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Play size={20} />
            {isAnimating ? 'Processando...' : 'Iniciar'}
          </button>
          <button
            onClick={resetDisks}
            disabled={isAnimating}
            style={{
              padding: '12px 24px',
              backgroundColor: '#374151',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              opacity: isAnimating ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
      </div>

      {/* Discos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
        gap: '24px',
        marginTop: '8px'
      }}>
        <DiskDisplay disk={leftDisk} label="Disco Esquerdo (Cifra)" highlight={highlightLeft} />
        <DiskDisplay disk={rightDisk} label="Disco Direito (Plano)" highlight={highlightRight} />
      </div>

      {/* Log de Execução */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.4)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        marginTop: '8px'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#22d3ee',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ChevronRight size={20} />
          Log de Execução
        </h3>
        <div style={{
          backgroundColor: '#111827',
          borderRadius: '8px',
          padding: '16px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          color: '#d1d5db'
        }}>
          {animationLog.length === 0 ? (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Aguardando execução...</p>
          ) : (
            animationLog.map((log, idx) => (
              <div key={idx} style={{ whiteSpace: 'pre-wrap', marginBottom: '4px' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Informações */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.4)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        marginTop: '8px'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', color: '#22d3ee' }}>
          Como Funciona o Chaocipher
        </h3>
        
        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ fontSize: '0.875rem', color: '#e5e7eb', lineHeight: '1.6' }}>
            <strong>Contexto Histórico:</strong> Inventado por John F. Byrne em 1918 e mantido secreto até 2010. 
            Byrne acreditava que era "materialmente e matematicamente indecifrável", mas análises modernas 
            revelaram vulnerabilidades significativas (Lasry et al., 2016).
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
          gap: '16px',
          fontSize: '0.875rem',
          color: '#d1d5db',
          marginBottom: '20px'
        }}>
          <div>
            <h4 style={{ fontWeight: '600', color: '#fff', marginBottom: '8px' }}>🔐 Processo de Encriptação:</h4>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Localiza a letra no disco direito (alfabeto plano)</li>
              <li>Recupera a letra correspondente no disco esquerdo (alfabeto cifrado)</li>
              <li>Permuta o disco esquerdo usando a letra cifrada</li>
              <li>Permuta o disco direito usando a letra plana</li>
              <li>Repete para cada caractere (comportamento autokey)</li>
            </ol>
          </div>
          <div>
            <h4 style={{ fontWeight: '600', color: '#fff', marginBottom: '8px' }}>🔓 Processo de Decriptação:</h4>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Localiza a letra no disco esquerdo (alfabeto cifrado)</li>
              <li>Recupera a letra correspondente no disco direito (alfabeto plano)</li>
              <li>Aplica as mesmas permutações da encriptação</li>
              <li>Disco esquerdo: usa letra cifrada para permutar</li>
              <li>Disco direito: usa letra plana descoberta para permutar</li>
            </ol>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
          gap: '16px',
          fontSize: '0.875rem',
          color: '#d1d5db',
          marginBottom: '20px'
        }}>
          <div style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px' }}>
            <h4 style={{ fontWeight: '600', color: '#a855f7', marginBottom: '8px' }}>⚙️ Permutação do Disco Esquerdo:</h4>
            <ol style={{ paddingLeft: '20px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <li>Rotaciona até a letra ficar no zênite (posição 0)</li>
              <li>Extrai o elemento da posição 1</li>
              <li>Desloca posições 3-nadir uma casa à esquerda</li>
              <li>Insere o elemento extraído no nadir (meio do disco)</li>
            </ol>
          </div>
          <div style={{ padding: '12px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px' }}>
            <h4 style={{ fontWeight: '600', color: '#eab308', marginBottom: '8px' }}>⚙️ Permutação do Disco Direito:</h4>
            <ol style={{ paddingLeft: '20px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <li>Rotaciona até a letra ficar no zênite (posição 0)</li>
              <li>Move o zênite para o final do disco</li>
              <li>Extrai o elemento da posição 2</li>
              <li>Desloca posições 4-nadir uma casa à esquerda</li>
              <li>Insere o elemento extraído no nadir</li>
            </ol>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
          <h4 style={{ fontWeight: '600', color: '#ef4444', marginBottom: '8px' }}>⚠️ Vulnerabilidades Conhecidas</h4>
          <p style={{ fontSize: '0.8rem', color: '#d1d5db', lineHeight: '1.5', marginBottom: '8px' }}>
            Segundo Lasry et al. (2016), "Cryptanalysis of Chaocipher and solution of Exhibit 6":
          </p>
          <ul style={{ paddingLeft: '20px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li><strong>Ataque com texto conhecido:</strong> Requer apenas 50-80 caracteres de texto plano/cifrado correspondentes</li>
            <li><strong>Ataque ciphertext-only:</strong> Com 60-80 mensagens cifradas com a mesma chave (in-depth), o algoritmo pode ser quebrado usando Index of Coincidence</li>
            <li><strong>Falha fundamental:</strong> O disco direito não afeta o Index of Coincidence, permitindo ataque "divide-and-conquer"</li>
            <li><strong>Propagação de erros:</strong> Qualquer erro corrompe toda a decriptação subsequente (característica autokey)</li>
          </ul>
        </div>

        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>
            <strong>Referência:</strong> Lasry, G., Rubin, M., Kopal, N., & Wacker, A. (2016). 
            "Cryptanalysis of Chaocipher and solution of Exhibit 6". <em>Cryptologia</em>, 40(2), 
            demonstra que apesar da engenhosidade do sistema, ele não atende aos princípios de 
            Kerckhoffs (1883) de que um sistema deve ser seguro mesmo quando o algoritmo é conhecido.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Chaocipher() {
  return (
    <AlgorithmLayout algorithm={meta}>
      <ChaocipherContent />
    </AlgorithmLayout>
  );
}