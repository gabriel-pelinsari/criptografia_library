import AlgorithmLayout from '../components/AlgorithmLayout.jsx'

export const meta = {
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
}

export default function Algoritmo5() {
  return <AlgorithmLayout algorithm={meta} />
}
