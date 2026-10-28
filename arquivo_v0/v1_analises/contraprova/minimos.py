import copy
from pymodel import params, summary, unit, PLANS
from decomp import modB, refc
import cenarios as C

def anchors():
    base_c = C.S["1_base_corrigido"]["B"]
    return {"base corrigido": base_c, "moderado": modB(), "cético": C.S["3_cetico"]["B"]}

def setv(P, var, x):
    P = copy.deepcopy(P)
    if var == "churn":   # x = churn da Agenda Cheia; demais planos na mesma proporção do anchor
        r = x / P["B_G_churn"]
        for k in "PGK": P[f"B_{k}_churn"] *= r
    elif var == "esp":   # x = contas por especialista na Agenda Cheia; demais na proporção
        r = x / P["B_G_esp"]
        for k in "PGK": P[f"B_{k}_esp"] *= r
    elif var == "preco": # x = preço fixo da Agenda Cheia; demais na proporção
        r = x / P["B_G_preco"]
        for k in "PGK": P[f"B_{k}_preco"] *= r; P[f"B_{k}_setup"] *= r
        P["ref_custo"] = refc(P, "B")
    elif var == "cac": P["B_cac"] = x
    return P

def metric(P, crit):
    if crit in ("ltvcac", "payback"):
        u = unit("B", P); return u[crit]
    r = summary("B", P)
    if crit == "mb5": return r["mb5"]
    if crit == "h7": return r["arr7"] if (r["m50"] and r["pen50"] <= .03) else min(r["arr7"], 49.99e6)
    if crit == "eq60": return -(r["eq"] or 999)

TARGET = {"mb5": .70, "ltvcac": 3.0, "payback": -12.0, "h7": 50e6, "eq60": -60}
def ok(P, crit):
    v = metric(P, crit)
    if crit == "payback": return -v >= TARGET[crit]
    return v >= TARGET[crit]

def solve(P, var, crit, lo, hi, iters=40):
    """Encontra o limiar de var entre lo e hi em que o critério passa a valer. Retorna (limiar, direção)."""
    a, b = ok(setv(P, var, lo), crit), ok(setv(P, var, hi), crit)
    if a == b: return ("passa em toda a faixa" if a else "não passa em nenhum valor da faixa", None)
    for _ in range(iters):
        mid = (lo + hi) / 2
        if ok(setv(P, var, mid), crit) == a: lo = mid
        else: hi = mid
    return ((lo + hi) / 2, "máximo" if a else "mínimo")

RANGES = {"churn": (0.005, 0.12), "esp": (5, 400), "preco": (500, 6000), "cac": (500, 40000)}
CRITS = {"mb5": ["esp", "preco"], "ltvcac": ["churn", "cac", "preco", "esp"], "payback": ["cac", "preco", "esp"], "h7": ["churn", "cac", "preco"], "eq60": ["churn","cac","preco","esp"]}
if __name__ == "__main__":
    for an, P in anchors().items():
        print("== âncora:", an, "| valores atuais: churn G", round(P["B_G_churn"],4), "esp G", round(P["B_G_esp"],1), "preço G", round(P["B_G_preco"]), "CAC", P["B_cac"])
        for crit, vars_ in CRITS.items():
            for v in vars_:
                lo, hi = RANGES[v]
                print(f"   {crit:8s} {v:6s} ->", solve(P, v, crit, lo, hi))
