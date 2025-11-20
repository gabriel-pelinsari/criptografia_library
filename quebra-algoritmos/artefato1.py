import math
import random
import string
from typing import Dict, List, Optional, Tuple

ALPHABET = string.ascii_uppercase

class SubstitutionCipher:
    def __init__(self, key: List[str]):
        if len(key) != 26 or sorted(key) != list(ALPHABET):
            raise ValueError("Key deve ser uma permutação de A-Z.")
        self.key = key
        self._mapping = {chr(ord('A') + i): self.key[i] for i in range(26)}

    @staticmethod
    def random_key() -> List[str]:
        key = list(ALPHABET)
        random.shuffle(key)
        return key

    @staticmethod
    def neighbour_key(key: List[str]) -> List[str]:
        new_key = key[:]
        i, j = random.sample(range(26), 2)
        new_key[i], new_key[j] = new_key[j], new_key[i]
        return new_key

    def decrypt(self, ciphertext: str) -> str:
        self._mapping = {chr(ord('A') + i): self.key[i] for i in range(26)}
        mapping = self._mapping

        out_chars = []
        for ch in ciphertext:
            cu = ch.upper()
            if 'A' <= cu <= 'Z':
                plain_char = mapping[cu]
                out_chars.append(plain_char if ch.isupper() else plain_char.lower())
            else:
                out_chars.append(ch)
        return "".join(out_chars)

    @staticmethod
    def pretty_print_key(key: List[str]) -> str:
        line1 = "CIPH:  " + " ".join(ALPHABET)
        line2 = "PLAIN: " + " ".join(key)
        return line1 + "\n" + line2

class EnglishScorer:

    def __init__(self, quadgram_file: Optional[str] = None):
        self.using_quadgrams = False
        self.quadgram_scores: Dict[str, float] = {}
        self.quadgram_floor: float = 0.0

        self.letter_log_probs: Dict[str, float] = {}
        self.letter_floor: float = 0.0

        if quadgram_file is not None:
            try:
                self._load_quadgrams(quadgram_file)
                self.using_quadgrams = True
                print(f"[INFO] Quadgramas carregados de: {quadgram_file}")
            except Exception as e:
                print(f"[WARN] Falha ao carregar quadgramas ({e}).")
                print("[INFO] Usando fallback de frequência de letras.")
                self._setup_letter_model()
        else:
            self._setup_letter_model()

    def _load_quadgrams(self, filepath: str):
        counts: Dict[str, int] = {}
        total = 0

        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                parts = line.strip().split()
                if len(parts) != 2:
                    continue
                quad, count = parts[0].upper(), int(parts[1])
                if len(quad) != 4:
                    continue
                counts[quad] = count
                total += count

        if total == 0:
            raise ValueError("Arquivo de quadgramas vazio ou inválido.")

        self.quadgram_scores = {
            quad: math.log10(count / total)
            for quad, count in counts.items()
        }
        self.quadgram_floor = math.log10(0.01 / total)

    def _setup_letter_model(self):
        freqs = {
            'A': 0.08167,
            'B': 0.01492,
            'C': 0.02782,
            'D': 0.04253,
            'E': 0.12702,
            'F': 0.02228,
            'G': 0.02015,
            'H': 0.06094,
            'I': 0.06966,
            'J': 0.00153,
            'K': 0.00772,
            'L': 0.04025,
            'M': 0.02406,
            'N': 0.06749,
            'O': 0.07507,
            'P': 0.01929,
            'Q': 0.00095,
            'R': 0.05987,
            'S': 0.06327,
            'T': 0.09056,
            'U': 0.02758,
            'V': 0.00978,
            'W': 0.02360,
            'X': 0.00150,
            'Y': 0.01974,
            'Z': 0.00074,
        }
        total = sum(freqs.values())
        self.letter_log_probs = {
            ch: math.log10(freq / total)
            for ch, freq in freqs.items()
        }
        self.letter_floor = math.log10(0.0001 / total)
        print("[INFO] Usando modelo de frequência de letras (sem quadgramas).")

    def score(self, text: str) -> float:
        filtered = "".join(ch for ch in text.upper() if 'A' <= ch <= 'Z')
        if not filtered:
            return -1e9

        if self.using_quadgrams:
            return self._score_quadgrams(filtered)
        else:
            return self._score_letters(filtered)

    def _score_quadgrams(self, text: str) -> float:
        score = 0.0
        if len(text) < 4:
            return self._score_letters(text)

        for i in range(len(text) - 3):
            quad = text[i:i+4]
            score += self.quadgram_scores.get(quad, self.quadgram_floor)
        return score

    def _score_letters(self, text: str) -> float:
        score = 0.0
        for ch in text:
            score += self.letter_log_probs.get(ch, self.letter_floor)
        return score

class SimulatedAnnealingDecoder:
    def __init__(
        self,
        ciphertext: str,
        scorer: EnglishScorer,
        initial_temp: float = 15.0,
        final_temp: float = 2.0,
        cooling_rate: float = 0.97,
        iterations_per_temp: int = 500,
        random_seed: Optional[int] = None,
    ):
        self.ciphertext = ciphertext
        self.scorer = scorer
        self.initial_temp = initial_temp
        self.final_temp = final_temp
        self.cooling_rate = cooling_rate
        self.iterations_per_temp = iterations_per_temp

        if random_seed is not None:
            random.seed(random_seed)

    def run(self) -> Tuple[List[str], float, str]:
        current_key = SubstitutionCipher.random_key()
        cipher = SubstitutionCipher(current_key)
        current_plain = cipher.decrypt(self.ciphertext)
        current_score = self.scorer.score(current_plain)

        best_key = current_key[:]
        best_score = current_score
        best_plain = current_plain

        T = self.initial_temp

        while T > self.final_temp:
            for _ in range(self.iterations_per_temp):
                new_key = SubstitutionCipher.neighbour_key(current_key)
                cipher_candidate = SubstitutionCipher(new_key)
                new_plain = cipher_candidate.decrypt(self.ciphertext)
                new_score = self.scorer.score(new_plain)

                delta = new_score - current_score
                if delta > 0:
                    accept = True
                else:
                    try:
                        accept_prob = math.exp(delta / T)
                    except OverflowError:
                        accept_prob = 0.0
                    accept = random.random() < accept_prob

                if accept:
                    current_key = new_key
                    current_plain = new_plain
                    current_score = new_score

                    if current_score > best_score:
                        best_key = current_key[:]
                        best_plain = current_plain
                        best_score = current_score

            T *= self.cooling_rate

        return best_key, best_score, best_plain

def preprocess_ciphertext(text: str) -> str:
    return "".join(
        ch.upper() if ch.isalpha() else ch
        for ch in text
    )

if __name__ == "__main__":
    ciphertext = """
    gth vgddya ytv hxpbsk-mhwht chtsm. sbys nym nym ydd. ytv mxqsk chtsm gj xs nym xt fhttxhm. fhttxhm mywhv gth ytv sng ys y sxlh ik irddvgextp sbh pagcha ytv sbh whphsyidh lyt ytv sbh irscbha rtsxd gth'm cbhhom irathv nxsb sbh mxdhts xlfrsysxgt gj fyamxlgtk sbys mrcb cdgmh vhydxtp xlfdxhv. sbahh sxlhm vhddy cgrtshv xs. gth vgddya ytv hxpbsk-mhwht chtsm. ytv sbh thqs vyk ngrdv ih cbaxmslym.sbhah nym cdhyadk tgsbxtp dhjs sg vg irs jdgf vgnt gt sbh mbyiik dxssdh cgrcb ytv bgnd. mg vhddy vxv xs. nbxcb xtmsxpyshm sbh lgayd ahjdhcsxgt sbys dxjh xm lyvh rf gj mgim, mtxjjdhm, ytv mlxdhm, nxsb mtxjjdhm fahvglxtysxtp.nbxdh sbh lxmsahmm gj sbh bglh xm payvryddk mrimxvxtp jagl sbh jxams msyph sg sbh mhcgtv, syoh y dggo ys sbh bglh. y jratxmbhv jdys ys $8 fha nhho. xs vxv tgs hqycsdk ihppya vhmcaxfsxgt, irs xs chasyxtdk byv sbys ngav gt sbh dggo-grs jga sbh lhtvxcytck muryv.xt sbh whmsxirdh ihdgn nym y dhssha-igq xtsg nbxcb tg dhssha ngrdv pg, ytv yt hdhcsaxc irssgt jagl nbxcb tg lgasyd jxtpha cgrdv cgyq y axtp. ydmg yffhasyxtxtp sbhahrtsg nym y cyav ihyaxtp sbh tylh "la. zylhm vxddxtpbyl kgrtp."sbh "vxddxtpbyl" byv ihht jdrtp sg sbh iahheh vraxtp y jgalha fhaxgv gj fagmfhaxsk nbht xsm fgmmhmmga nym ihxtp fyxv $30 fha nhho. tgn, nbht sbh xtcglh nym mbarto sg $20, sbh dhssham gj "vxddxtpbyl" dggohv idraahv, ym sbgrpb sbhk nhah sbxtoxtp mhaxgrmdk gj cgtsaycsxtp sg y lgvhms ytv rtymmrlxtp v. irs nbhthwha la. zylhm vxddxtpbyl kgrtp cylh bglh ytv ahycbhv bxm jdys yigwh bh nym cyddhv "zxl" ytv pahysdk brpphv ik lam. zylhm vxddxtpbyl kgrtp, ydahyvk xtsagvrchv sg kgr ym vhddy. nbxcb xm ydd whak pggv.vhddy jxtxmbhv bha cak ytv ysshtvhv sg bha cbhhom nxsb sbh fgnvha ayp. mbh msggv ik sbh nxtvgn ytv dggohv grs vrddk ys y pahk cys nydoxtp y pahk jhtch xt y pahk iycokyav. sg-lgaagn ngrdv ih cbaxmslym vyk, ytv mbh byv gtdk $1.87 nxsb nbxcb sg irk zxl y fahmhts. mbh byv ihht mywxtp hwhak fhttk mbh cgrdv jga lgtsbm, nxsb sbxm ahmrds. snhtsk vgddyam y nhho vghmt's pg jya. hqfhtmhm byv ihht pahysha sbyt mbh byv cydcrdyshv. sbhk ydnykm yah. gtdk $1.87 sg irk y fahmhts jga zxl. bha zxl. lytk y byffk bgra mbh byv mfhts fdyttxtp jga mglhsbxtp txch jga bxl. mglhsbxtp jxth ytv ayah ytv mshadxtp--mglhsbxtp zrms y dxssdh ixs thya sg ihxtp ngasbk gj sbh bgtgra gj ihxtp gnthv ik zxl.sbhah nym y fxha-pdymm ihsnhht sbh nxtvgnm gj sbh aggl. fhabyfm kgr bywh mhht y fxha-pdymm xt yt $8 iys. y whak sbxt ytv whak ypxdh fhamgt lyk, ik gimhawxtp bxm ahjdhcsxgt xt y ayfxv mhurhtch gj dgtpxsrvxtyd msaxfm, gisyxt y jyxadk yccraysh cgtchfsxgt gj bxm dggom. vhddy, ihxtp mdhtvha, byv lymshahv sbh yas
    """

    ciphertext = preprocess_ciphertext(ciphertext)

    scorer = EnglishScorer(quadgram_file="./quebra-algoritmos/english_quadgrams.txt")

    decoder = SimulatedAnnealingDecoder(
        ciphertext=ciphertext,
        scorer=scorer,
        initial_temp=15.0,
        final_temp=2.0,
        cooling_rate=0.97,
        iterations_per_temp=100,
        random_seed=42,
    )

    best_key, best_score, best_plain = decoder.run()

    print("==== Best score ====")
    print(best_score)
    print("\n==== Best key ====")
    print(SubstitutionCipher.pretty_print_key(best_key))
    print("\n==== Decrypted text ====")
    print(best_plain)
