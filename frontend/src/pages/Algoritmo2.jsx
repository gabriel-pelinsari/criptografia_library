import AlgorithmLayout from '../components/AlgorithmLayout.jsx'

export const meta = {
  slug: 'criador-2',
  label: 'Algoritmo 2',
  summary:
    'Slot do integrante 2. Ideal para um algoritmo assimetrico usado em troca de chaves ou assinaturas digitais.',
  level: 'Avancado',
  complexity: 'O(n^3)',
  tokens: ['Assimetrica', 'Assinatura', 'Troca segura'],
  accent: 'var(--accent-purple)',
  highlights: [
    {
      title: 'Quando usar',
      description: 'Troca inicial de chaves, emissao de certificados e autenticacao de mensagens.',
    },
    {
      title: 'Vantagem',
      description: 'Compatibilidade com TLS, PKI interna e integra facilmente com bibliotecas existentes.',
    },
    {
      title: 'Cuidados',
      description: 'Nao cifrar arquivos grandes diretamente; combine com um algoritmo simetrico.',
    },
  ],
}

export default function Algoritmo2() {
  return <AlgorithmLayout algorithm={meta} />
}
