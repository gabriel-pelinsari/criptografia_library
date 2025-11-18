# Criptografia Library

Biblioteca digital criada para organizar e demonstrar cinco algoritmos de criptografia diferentes, cada um com rota própria, descrição guiada e espaço para simulação. O objetivo é facilitar a apresentação do trabalho do grupo, permitindo que qualquer pessoa entenda rapidamente a proposta, navegue pelos algoritmos e teste entradas/saídas sem conhecer previamente a implementação.

## Integrantes

- Gabriel Pelinsari
- Ever Costa
- Paula Piva
- Leandro Gomes
- Rodrigo Santos

## Visão geral

| Página | Descrição |
| --- | --- |
| **Landing / Biblioteca** | Explica o conceito do projeto, apresenta estatísticas e lista cada algoritmo como um card em formato de linha. Cada card abre uma rota independente (`/algoritmo-x`) com o conteúdo preparado pelo integrante responsável. |
| **Rota do algoritmo** | Mostra hero com resumo, nível e complexidade, cards de destaque (quando usar, vantagens, cuidados) e um playground para inserir inputs/outputs. O layout segue o design inspirado no sistema V0dev. |

## Principais recursos

- **Design System inspirado no V0dev**: componentes reutilizáveis (hero, cards, painéis, botões) com glassmorphism e gradientes dinâmicos.
- **Roteamento por slug**: cada integrante ganha uma URL dedicada, pronta para compartilhar (`/algoritmo-1` até `/algoritmo-5`). Basta atualizar o array `algorithms` para criar novas rotas.
- **Placeholders de simulação**: área pré-formatada para inputs, parâmetros, mensagens e saídas (buffers, assinaturas, hashes etc.).
- **Copy orientada ao visitante**: textos explicam o fluxo completo para quem cai no site pela primeira vez, garantindo entendimento rápido.

## Arquitetura e tecnologias

- **Vite + React 19**
- **React Router DOM 7** para gerenciar as rotas `/` e `/:slug`
- **CSS puro** (App.css + variáveis globais) para o design system

```
criptografia_library/
├── README.md
└── frontend/
    ├── package.json
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    └── public/
```

## Como executar

1. Acesse a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Rode o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
   O Vite exibirá a URL local (geralmente `http://localhost:5173`).
4. Para gerar a build de produção:
   ```bash
   npm run build
   ```

## Como adicionar um novo algoritmo

1. Abra `frontend/src/App.jsx` e localize o array `algorithms`.
2. Adicione um novo objeto com:
   - `slug`: identificador da rota (ex.: `algoritmo-6`).
   - `label`: nome amigável para exibir nos cards.
   - `summary`: resumo do que o visitante verá.
   - `level`, `complexity`, `tokens`, `highlights`.
   - `accent`: cor de destaque (utilize uma das variáveis disponíveis em `index.css`).
3. Rode `npm run dev` e acesse `/algoritmo-6` para testar.

O roteador cria a página automaticamente e mantém o mesmo visual. O componente `AlgorithmPage` centraliza a UI da rota; caso queira personalizar cada membro ainda mais, basta renderizar componentes específicos dentro do bloco do playground.