"""Helper: build model with overrides (and optional patched builder), recalc via LibreOffice, read outputs."""
import json, os, subprocess, sys, openpyxl
HERE = os.path.dirname(os.path.abspath(__file__))
RUNS = os.path.join(HERE, "runs")
KEYS = ["Receita recorrente anualizada no ano 5","Receita recorrente anualizada no ano 7","Mês de equilíbrio (EBITDA positivo daí em diante)",
"Capital necessário (pior caixa acumulado)","Margem bruta no ano 5","LTV/CAC do plano principal (Consultório / Agenda Cheia), mídia paga",
"Recuperação do CAC do plano principal (meses)","Mês em que a receita anualizada chega a R$ 50 mi","Participação no mercado nesse mês","Clientes ativos no ano 5"]
SHORT = ["arr5","arr7","eq","cap","mb5","ltvcac","payback","m50","pen50","cli5"]

def build_many(cases, builder="build_orig.py"):
    paths = {}
    for name, ov in cases.items():
        j = os.path.join(RUNS, name + ".json"); x = os.path.join(RUNS, name + ".xlsx")
        json.dump(ov, open(j, "w"))
        b = ov.get("_builder", builder)
        subprocess.run(["python3", os.path.join(HERE, b), x, j], check=True, capture_output=True)
        paths[name] = x
    out = os.path.join(RUNS, "out"); os.makedirs(out, exist_ok=True)
    pl = list(paths.values())
    for i in range(0, len(pl), 10):
        subprocess.run(["soffice", "--headless", "--calc", "--convert-to", "xlsx:Calc MS Excel 2007 XML", "--outdir", out] + pl[i:i+10], check=True, capture_output=True, timeout=900)
    return {n: os.path.join(out, os.path.basename(p)) for n, p in paths.items()}

def read(path, monthly=()):
    wb = openpyxl.load_workbook(path, data_only=True)
    S = wb["Resumo"]
    rows = {S.cell(r, 1).value: r for r in range(1, S.max_row + 1)}
    res = {}
    for k, lab in zip(SHORT, KEYS):
        r = rows[lab]; res[k] = {"A": S.cell(r, 2).value, "B": S.cell(r, 3).value}
    res["_monthly"] = {}
    for m in ("A", "B"):
        ws = wb[f"Modelo {m}"]
        lab = {ws.cell(r, 1).value: r for r in range(1, ws.max_row + 1)}
        d = {}
        for name in monthly:
            r = lab[name]; d[name] = [ws.cell(r, c).value for c in range(3, 87)]
        res["_monthly"][m] = d
    U = wb["Unidade"]
    res["_unidade"] = [[U.cell(r, c).value for c in range(1, 10)] for r in range(1, U.max_row + 1)]
    return res
