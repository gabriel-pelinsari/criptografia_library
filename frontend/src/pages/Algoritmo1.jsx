import AlgorithmLayout from '../components/AlgorithmLayout.jsx'

export const meta = {
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
}

export default function Algoritmo1() {
  return <AlgorithmLayout algorithm={meta} />
}
