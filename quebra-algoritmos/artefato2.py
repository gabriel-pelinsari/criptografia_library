import sys
import math
import random
import itertools
import json
import os
from pathlib import Path
from typing import List, Tuple, Dict

from google import genai

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY_HERE")


class NgramScorer:
    def __init__(self, ngramfile: str, n: int = 4):
        self.n = n
        self.ngrams: Dict[str, float] = {}
        self.floor = None
        self._load_ngrams(ngramfile)

    def _load_ngrams(self, filename: str):
        total = 0
        with open(filename, 'r') as f:
            for line in f:
                parts = line.strip().split()
                if len(parts) == 2:
                    ngram, count = parts[0], int(parts[1])
                    self.ngrams[ngram] = count
                    total += count

        for ngram in self.ngrams:
            self.ngrams[ngram] = math.log10(self.ngrams[ngram] / total)
        self.floor = math.log10(0.01 / total)

    def score(self, text: str) -> float:
        text = text.upper().replace(' ', '').replace('\n', '')
        score = 0.0
        for i in range(len(text) - self.n + 1):
            ngram = text[i:i + self.n]
            score += self.ngrams.get(ngram, self.floor)
        return score


class PermutationBreaker:
    def __init__(self, scorer: NgramScorer):
        self.scorer = scorer

    def _columnar_decrypt(self, ciphertext: str, key: List[int]) -> str:
        ciphertext = ciphertext.upper().replace(' ', '').replace('\n', '')
        n_cols = len(key)
        n_rows = math.ceil(len(ciphertext) / n_cols)

        sorted_positions = sorted(range(n_cols), key=lambda x: key[x])

        col_lengths = [n_rows] * n_cols
        remainder = len(ciphertext) % n_cols
        if remainder != 0:
            for col in range(remainder, n_cols):
                col_lengths[col] = n_rows - 1

        grid = [[''] * n_cols for _ in range(n_rows)]
        idx = 0
        for col_pos in sorted_positions:
            for row in range(col_lengths[col_pos]):
                if idx < len(ciphertext):
                    grid[row][col_pos] = ciphertext[idx]
                    idx += 1

        return ''.join(''.join(row) for row in grid)

    def _simulated_annealing_columnar(
        self,
        ciphertext: str,
        key_length: int,
        temperature: float = 50.0,
        cooling_rate: float = 0.99,
        iterations: int = 100000
    ) -> Tuple[List[int], str]:
        key = list(range(key_length))
        random.shuffle(key)

        best_key = key.copy()
        best_text = self._columnar_decrypt(ciphertext, best_key)
        best_score = self.scorer.score(best_text)

        current_key = key.copy()
        current_score = best_score
        temp = temperature

        for _ in range(iterations):
            i, j = random.sample(range(key_length), 2)
            current_key[i], current_key[j] = current_key[j], current_key[i]

            text = self._columnar_decrypt(ciphertext, current_key)
            score = self.scorer.score(text)
            delta = score - current_score

            if delta > 0 or random.random() < math.exp(delta / temp):
                current_score = score
                if score > best_score:
                    best_score = score
                    best_key = current_key.copy()
                    best_text = text
            else:
                current_key[i], current_key[j] = current_key[j], current_key[i]

            temp *= cooling_rate

        return best_key, best_text

    def break_columnar(self, ciphertext: str, key_length: int) -> Tuple[str, List[int], float]:
        if key_length <= 8:
            best_score = float('-inf')
            best_key, best_text = None, None
            for perm in itertools.permutations(range(key_length)):
                key = list(perm)
                text = self._columnar_decrypt(ciphertext, key)
                score = self.scorer.score(text)
                if score > best_score:
                    best_score = score
                    best_key = key
                    best_text = text
            return best_text, best_key, best_score
        else:
            key, text = self._simulated_annealing_columnar(ciphertext, key_length)
            score = self.scorer.score(text)
            return text, key, score

    def _block_decrypt(self, ciphertext: str, key: List[int]) -> str:
        ciphertext = ciphertext.upper().replace(' ', '').replace('\n', '')
        n = len(key)
        plaintext_blocks = []

        for k in range(0, len(ciphertext), n):
            block = ciphertext[k:k + n]
            if len(block) < n:
                # bloco incompleto: mantém como está
                plaintext_blocks.append(block)
                break

            plain_block = ['?'] * n
            for i in range(n):
                j = key[i]
                plain_block[i] = block[j]
            plaintext_blocks.append(''.join(plain_block))

        return ''.join(plaintext_blocks)

    def _simulated_annealing_block(
        self,
        ciphertext: str,
        key_length: int,
        temperature: float = 50.0,
        cooling_rate: float = 0.99,
        iterations: int = 100000
    ) -> Tuple[List[int], str]:
        key = list(range(key_length))
        random.shuffle(key)

        best_key = key.copy()
        best_text = self._block_decrypt(ciphertext, best_key)
        best_score = self.scorer.score(best_text)

        current_key = key.copy()
        current_score = best_score
        temp = temperature

        for _ in range(iterations):
            i, j = random.sample(range(key_length), 2)
            current_key[i], current_key[j] = current_key[j], current_key[i]

            text = self._block_decrypt(ciphertext, current_key)
            score = self.scorer.score(text)
            delta = score - current_score

            if delta > 0 or random.random() < math.exp(delta / temp):
                current_score = score
                if score > best_score:
                    best_score = score
                    best_key = current_key.copy()
                    best_text = text
            else:
                current_key[i], current_key[j] = current_key[j], current_key[i]

            temp *= cooling_rate

        return best_key, best_text

    def break_block(self, ciphertext: str, key_length: int) -> Tuple[str, List[int], float]:
        if key_length <= 8:
            best_score = float('-inf')
            best_key, best_text = None, None
            for perm in itertools.permutations(range(key_length)):
                key = list(perm)
                text = self._block_decrypt(ciphertext, key)
                score = self.scorer.score(text)
                if score > best_score:
                    best_score = score
                    best_key = key
                    best_text = text
            return best_text, best_key, best_score
        else:
            key, text = self._simulated_annealing_block(ciphertext, key_length)
            score = self.scorer.score(text)
            return text, key, score


def choose_with_gemini(candidates: Dict[str, Dict]) -> Tuple[str, str]:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_API_KEY_HERE":
        raise RuntimeError("GEMINI_API_KEY não configurada.")

    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = (
        "We are breaking a classical cipher. Below are several candidate decryptions.\n"
        "Each candidate has a label, a cipher mode (columnar or block), a key length,\n"
        "and the decrypted text.\n\n"
        "Your tasks:\n"
        "1) Decide which candidate label has the most plausible English plaintext.\n"
        "2) Provide a cleaned-up suggestion of the original plaintext in natural English,\n"
        "   with NORMAL SPACES between words and proper punctuation.\n"
        "   You MUST segment the text into words. Do NOT return an all-caps string\n"
        "   without spaces. The suggestion should look like a normal English sentence,\n"
        "   for example: \"Tomorrow at the break of dawn, the silence of the mountains...\".\n\n"
        "Respond ONLY in valid JSON with the following format:\n"
        "{\n"
        "  \"best_label\": \"<label>\",\n"
        "  \"suggestion\": \"<your suggested plaintext>\"\n"
        "}\n\n"
        "Candidates:\n\n"
    )

    for label, info in candidates.items():
        prompt += (
            f"Label: {label}\n"
            f"Mode: {info['mode']}\n"
            f"Key length: {info['key_len']}\n"
            f"Decrypted text: {info['text']}\n\n"
        )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    raw = (response.text or "").strip()
    print("\n--- Resposta bruta do Gemini ---\n")
    print(raw)
    
    # Remove markdown code blocks if present
    if raw.startswith("```"):
        # Remove first line (```json or ```)
        lines = raw.split('\n')
        if len(lines) > 2:
            # Remove first and last lines
            raw = '\n'.join(lines[1:-1]).strip()
    
    # Try to parse JSON
    data = json.loads(raw)  # se quebrar, o caller trata
    best_label = data["best_label"]
    suggestion = data["suggestion"]

    # Pequena proteção: se o modelo ainda assim devolver tudo colado, avisamos.
    if " " not in suggestion.strip():
        # Não tento segmentar automaticamente (isso já é papel do LLM),
        # só deixo explícito para você debugar se acontecer.
        print("⚠️ Aviso: a sugestão do Gemini veio sem espaços. Verifique o prompt/saída:")
        print(suggestion)

    return best_label, suggestion


def main():
    ciphertext = "ROTOMTAROWRBTHEFOEAKTNDAWLIHESOEENCMEFTHATOUNIWINSSELLBETHATHTREDOOETRLIPSWAVLADNINCEICPREROSEFOIMATDINGUWYEDBOSEEKVRFSUALEILNANCEARDSTTYTEGITHESERLLGWYYSKERILLTCFLEETTHENONSIIRCAREYEDBOSACHRELDINONOTEHLYTHGWEIHTTOFEWEIRSNAPOHTBUTGIEWETFHTOSIHEHTYTORSIHATTUABOWETOBETRITN"

    script_dir = Path(__file__).parent
    ngram_file = script_dir / 'quadgrams.txt'
    if not ngram_file.exists():
        print(f"Erro: Arquivo de n-gramas não encontrado em '{ngram_file}'!")
        sys.exit(1)

    scorer = NgramScorer(str(ngram_file))
    breaker = PermutationBreaker(scorer)

    print("=" * 80)
    print("QUEBRADOR DE PERMUTAÇÃO (COLUNAR + BLOCOS)")
    print("=" * 80)
    print(f"Ciphertext: {ciphertext}")
    print(f"Len: {len(ciphertext)} caracteres")

    min_key_len = 2
    max_key_len = 10
    candidates: Dict[str, Dict] = {}

    for key_len in range(min_key_len, max_key_len + 1):
        print(f"\n=== Testando key_len = {key_len} ===")

        text_col, key_col, score_col = breaker.break_columnar(ciphertext, key_len)
        label_col = f"columnar_{key_len}"
        candidates[label_col] = {
            "mode": "columnar",
            "key_len": key_len,
            "key": key_col,
            "text": text_col,
            "score": score_col,
        }
        print(f"[COLUNAR] score={score_col:.2f}, key={key_col}, preview={text_col[:60]}")

        text_blk, key_blk, score_blk = breaker.break_block(ciphertext, key_len)
        label_blk = f"block_{key_len}"
        candidates[label_blk] = {
            "mode": "block",
            "key_len": key_len,
            "key": key_blk,
            "text": text_blk,
            "score": score_blk,
        }
        print(f"[BLOCOS ] score={score_blk:.2f}, key={key_blk}, preview={text_blk[:60]}")

    best_label = None
    suggestion = None
    try:
        best_label, suggestion = choose_with_gemini(candidates)
        print("\n✅ Gemini usado para escolha do melhor candidato.")
    except Exception as e:
        print(f"\n⚠️ Falha ao usar Gemini ({e}). Usando melhor score de n-gramas.")
        best_label = max(candidates.keys(), key=lambda lab: candidates[lab]["score"])
        suggestion = candidates[best_label]["text"]

    best = candidates[best_label]

    print("\n" + "=" * 80)
    print("🎯 MELHOR CANDIDATO ENCONTRADO")
    print("=" * 80)
    print(f"Label: {best_label}")
    print(f"Tipo de cifra: {best['mode']}")
    print(f"Tamanho da chave: {best['key_len']}")
    print(f"Chave estimada: {best['key']}")
    print(f"Score: {best['score']:.2f}")
    print("\nTexto decifrado bruto:\n")
    print(best["text"])
    print("\n--- Sugestão de texto original (Gemini) ---\n")
    print(suggestion)
    print("=" * 80)


if __name__ == '__main__':
    main()
