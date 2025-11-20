# Quebra-Algoritmos

Scripts para quebra automática de cifras clássicas.

## Início Rápido

### Artefato 1: Quebra de Substituição

```bash
python artefato1.py
```

**Edite o texto cifrado:** Linha 228-230 em `artefato1.py`

### Artefato 2: Quebra de Permutação

```bash
# 1. Instalar dependências
pip install google-genai

# 2. Configurar API (opcional)
export GEMINI_API_KEY="sua_chave"

# 3. Executar
python artefato2.py
```

**Edite o texto cifrado:** Linha 307 em `artefato2.py`

## Arquivos Necessários

- `english_quadgrams.txt` ou `quadgrams.txt` - Base de dados de n-gramas (3.6 MB)
- Os scripts Python (`artefato1.py`, `artefato2.py`)

## Obter API Key do Gemini (Artefato 2)

1. Acesse: https://makersuite.google.com/app/apikey
2. Clique em "Get API Key"
3. Configure: `export GEMINI_API_KEY="sua_chave"`

## Documentação Completa

Consulte o [README principal](../README.md) para documentação detalhada.
