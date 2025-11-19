import React, { useState } from 'react';
import { Play, RotateCcw, Lock, Unlock, ChevronRight } from 'lucide-react';
import AlgorithmLayout from '../components/AlgorithmLayout.jsx';

const ALFABETO_PADRAO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?.:*()&%123456789¨";

export const meta = {
  slug: 'chaocipher',
  label: 'Chaocipher',
  summary:
    'Algoritmo de criptografia clássico que utiliza dois discos rotativos com permutações dinâmicas a cada caractere, tornando a cifra altamente resistente à análise de frequência.',
  level: 'Avançado',
  complexity: 'O(n)',
  tokens: ['Simétrica', 'Substituição', 'Histórico'],
  accent: 'var(--accent-cyan)',
  highlights: [
    {
      title: 'Quando usar',
      description: 'Ideal para fins educacionais e demonstração de técnicas de criptografia clássica com permutações dinâmicas.',
    },
    {
      title: 'Vantagem',
      description: 'Resistente à análise de frequência devido às permutações constantes dos discos a cada caractere processado.',
    },
    {
      title: 'Cuidados',
      description: 'Ambas as partes precisam do mesmo alfabeto inicial. Mantenha o alfabeto em segredo como parte da chave.',
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
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#22d3ee' }}>
          Como Funciona o Chaocipher
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, 1fr)' : '1fr',
          gap: '16px',
          fontSize: '0.875rem',
          color: '#d1d5db'
        }}>
          <div>
            <h4 style={{ fontWeight: '600', color: '#fff', marginBottom: '8px' }}>🔐 Encriptação:</h4>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Busca letra no disco direito (plano)</li>
              <li>Pega letra na mesma posição no disco esquerdo (cifra)</li>
              <li>Permuta disco esquerdo com a letra cifrada</li>
              <li>Permuta disco direito com a letra plana</li>
            </ol>
          </div>
          <div>
            <h4 style={{ fontWeight: '600', color: '#fff', marginBottom: '8px' }}>🔓 Decriptação:</h4>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Busca letra no disco esquerdo (cifra)</li>
              <li>Pega letra na mesma posição no disco direito (plano)</li>
              <li>Permuta disco esquerdo com a letra cifrada</li>
              <li>Permuta disco direito com a letra plana descoberta</li>
            </ol>
          </div>
          <div>
            <h4 style={{ fontWeight: '600', color: '#fff', marginBottom: '8px' }}>🔄 Permutações:</h4>
            <p style={{ marginBottom: '8px' }}><strong>Disco Esquerdo:</strong></p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Rotaciona até char no zênite</li>
              <li>Extrai posição 1 → insere no nadir (meio)</li>
            </ul>
            <p style={{ marginBottom: '8px', marginTop: '8px' }}><strong>Disco Direito:</strong></p>
            <ul style={{ paddingLeft: '20px', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Rotaciona até char no zênite</li>
              <li>Move zênite para o fim</li>
              <li>Extrai posição 2 → insere no nadir (meio)</li>
            </ul>
          </div>
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