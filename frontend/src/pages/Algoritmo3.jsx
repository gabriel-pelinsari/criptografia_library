import AlgorithmLayout from '../components/AlgorithmLayout.jsx'

export const meta = {
  slug: 'criador-3',
  label: 'Algoritmo 3',
  summary: 'Slot do integrante 3. Indicado para algoritmos de stream com autenticacao embutida (AEAD).',
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
}

export default function Algoritmo3() {
  return <AlgorithmLayout algorithm={meta} />
}
