# Artefato 2: Quebrador de Cifras de Permutação

## Visão Geral

Este script implementa um quebrador automático de cifras de permutação clássicas, capaz de lidar com dois tipos principais:
- **Transposição Colunar**: reorganização de caracteres em uma grade de colunas
- **Permutação por Blocos**: reorganização de caracteres dentro de blocos de tamanho fixo

## Como Rodar

### Pré-requisitos

1. Python 3.7 ou superior
2. Dependências necessárias:
   ```bash
   pip install google-genai
   ```

3. Arquivo `quadgrams.txt` no mesmo diretório do script (contém frequências de 4-gramas em inglês)

4. (Opcional) API Key do Google Gemini para melhor seleção de candidatos

### Configuração da API Key do Gemini

Existem duas formas de configurar a API Key:

**Opção 1: Variável de ambiente (recomendado)**
```bash
export GEMINI_API_KEY="sua_chave_aqui"
python artefato2.py
```

**Opção 2: Editar o script diretamente**
```python
GEMINI_API_KEY = "sua_chave_aqui"
```

### Executando o Script

1. Edite o `ciphertext` na função `main()` com o texto cifrado:
```python
ciphertext = "SEUTEXTOCIFRADOAQUI"
```

2. Ajuste os parâmetros opcionais:
```python
min_key_len = 2      # tamanho mínimo da chave a testar
max_key_len = 10     # tamanho máximo da chave a testar
```

3. Execute:
```bash
python artefato2.py
```

### Exemplo de Saída

```
================================================================================
QUEBRADOR DE PERMUTAÇÃO (COLUNAR + BLOCOS)
================================================================================
Ciphertext: UQTHERBICKOFOWNPMXJUEVEDOLERTHODAZYG
Len: 37 caracteres

=== Testando key_len = 2 ===
[COLUNAR] score=-45.23, key=[1, 0], preview=QUHTEBRCIKOOFNWMXPUJEVDEOLETRHDOAZY
[BLOCOS ] score=-52.11, key=[1, 0], preview=QUTHERBICKOFOWNPMXJUEVEDOLERTHODAZYG

...

🎯 MELHOR CANDIDATO ENCONTRADO
================================================================================
Label: block_5
Tipo de cifra: block
Tamanho da chave: 5
Chave estimada: [3, 1, 4, 0, 2]
Score: -12.45

Texto decifrado bruto:
THEQUICKBROWNFOXJUMPEDOVERTHELAZYDOG

--- Sugestão de texto original (Gemini) ---
The quick brown fox jumped over the lazy dog.
================================================================================
```

## Estratégia de Solução

### 1. Análise de Frequências com N-gramas

O script usa **análise estatística de quadrigramas** (sequências de 4 letras) para avaliar a qualidade de cada tentativa de decifração:

- **Arquivo `quadgrams.txt`**: contém frequências de todas as sequências de 4 letras em textos ingleses
- **Score**: quanto maior o score, mais o texto se parece com inglês natural
- **Log-probabilidade**: usa logaritmos para evitar underflow numérico

```python
score = Σ log10(P(quadrigrama))
```

### 2. Busca Exaustiva (Chaves Pequenas)

Para chaves de tamanho ≤ 8:
- Testa **todas as permutações possíveis** (força bruta)
- Garante encontrar a solução ótima
- Complexidade: O(n! × m), onde n = tamanho da chave, m = tamanho do texto

Exemplo: chave de tamanho 5 → 5! = 120 permutações

### 3. Simulated Annealing (Chaves Grandes)

Para chaves de tamanho > 8:
- Usa **recozimento simulado** (metaheurística)
- Evita testar todas as permutações (9! = 362.880, 10! = 3.628.800)
- Processo:
  1. Começa com uma chave aleatória
  2. A cada iteração, troca 2 posições aleatórias
  3. Aceita melhorias sempre
  4. Aceita pioras com probabilidade P = e^(Δscore/temperatura)
  5. Temperatura diminui gradualmente (cooling_rate = 0.99)

Parâmetros ajustáveis:
```python
temperature = 50.0        # temperatura inicial
cooling_rate = 0.99       # taxa de resfriamento
iterations = 100000       # número de iterações
```

### 4. Dois Modelos de Cifra

#### Transposição Colunar
O texto é escrito em uma grade linha por linha e lido coluna por coluna:

```
Chave: [2, 0, 1]
Plain: "HELLOWORLD"

Grid (escrita):
H E L
L O W
O R L
D

Grid (leitura por ordem da chave):
Coluna 0 (2º): H L O D
Coluna 1 (3º): E O R
Coluna 2 (1º): L W L

Cipher: LWLELORHLOD
```

#### Permutação por Blocos
O texto é dividido em blocos e cada posição dentro do bloco é permutada:

```
Chave: [2, 0, 1]
Plain: "HELLOWORLD"

Blocos:
HEL → (aplica permutação) → LHE
LOW → (aplica permutação) → WLO
ORL → (aplica permutação) → RLO
D   → (incompleto, mantém) → D

Cipher: LHEWLORLLOD
```

### 5. Seleção com IA (Gemini)

Após gerar todos os candidatos:
1. Envia todos para o **Google Gemini 2.5 Flash**
2. O modelo analisa qual parece mais inglês natural
3. **Bonus**: sugere o texto original com espaços e pontuação corretos

Prompt enviado ao Gemini:
- Lista todos os candidatos (modo, tamanho da chave, texto)
- Pede para escolher o melhor
- Pede para formatar o texto com espaços e pontuação

**Fallback**: Se o Gemini falhar, usa o candidato com maior score de n-gramas

### 6. Tratamento de Resposta do Gemini

O script remove automaticamente formatação markdown da resposta:
```python
# Remove ```json ... ``` se presente
if raw.startswith("```"):
    lines = raw.split('\n')
    raw = '\n'.join(lines[1:-1]).strip()
```

## Limitações

### 1. Tamanho da Chave
- **Chaves muito grandes** (>12): o simulated annealing pode não convergir para a solução ótima
- **Solução**: aumentar o número de iterações ou temperatura inicial
- **Trade-off**: maior tempo de execução

### 2. Texto Curto
- **Textos muito curtos** (<30 caracteres): análise de n-gramas menos confiável
- **Razão**: poucos quadrigramas para avaliar
- **Recomendação mínima**: ≥50 caracteres para melhor precisão

### 3. Idioma
- **Apenas inglês**: o arquivo `quadgrams.txt` contém frequências do inglês
- **Outros idiomas**: requer arquivo de n-gramas específico
- **Textos mistos**: podem não ser detectados corretamente

### 4. Tipo de Cifra
- **Apenas permutações**: não quebra cifras de substituição (César, Vigenère, etc.)
- **Não detecta automaticamente**: você precisa saber que é uma permutação
- **Híbridas**: cifras que combinam substituição + permutação não são suportadas

### 5. Caracteres Especiais
- **Remove espaços e pontuação**: assume texto sem formatação
- **Apenas letras**: números e símbolos são ignorados
- **Case-insensitive**: converte tudo para maiúsculas

### 6. Performance
- **Chave = 8**: ~40.320 permutações → alguns segundos
- **Chave = 9**: ~362.880 permutações → usa annealing
- **Chave = 10**: ~3.628.800 permutações → usa annealing
- **Range amplo** (2-15): pode levar minutos para testar todos os tamanhos

### 7. Dependência de API Externa
- **Gemini API**: requer conexão com internet e API key válida
- **Quotas**: APIs gratuitas têm limites de requisições
- **Fallback**: funciona sem Gemini, mas a seleção pode ser menos precisa

### 8. Formato de Resposta
- **JSON obrigatório**: o Gemini deve retornar JSON válido
- **Markdown**: o script remove ```json automaticamente
- **Formato incorreto**: cai no fallback de n-gramas

## Melhorias Futuras

1. **Auto-detecção de idioma**: suporte para múltiplos idiomas
2. **Detecção automática do tipo de cifra**: distinguir entre colunar e blocos
3. **Análise de espaçamento**: tentar preservar espaços originais
4. **Paralelização**: testar múltiplos tamanhos de chave simultaneamente
5. **Interface gráfica**: facilitar uso para não-programadores
6. **Suporte a cifras híbridas**: combinar com quebradores de substituição
7. **Otimização do annealing**: ajuste automático de parâmetros baseado no texto

## Referências

- **Análise de frequências**: [Cryptanalysis of Classical Ciphers](https://en.wikipedia.org/wiki/Frequency_analysis)
- **Simulated Annealing**: Kirkpatrick, S., Gelatt, C. D., & Vecchi, M. P. (1983). "Optimization by simulated annealing"
- **N-gram analysis**: [Practical Cryptography](http://practicalcryptography.com/cryptanalysis/)
