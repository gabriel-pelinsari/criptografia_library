import AlgorithmLayout from '../components/AlgorithmLayout.jsx'

export const meta = {
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
}

export default function Algoritmo4() {
  return <AlgorithmLayout algorithm={meta} />
}
