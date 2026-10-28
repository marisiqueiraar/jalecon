"""Modelo financeiro v2 da Jalecon: Modelo A (software por assinatura) x Modelo B (agência operada por agentes).

Gera um xlsx com fórmulas. As premissas ficam na aba Premissas (texto azul), com três cenários
e um seletor. Rodar: python 10_v1/financeiro/build_model_v2.py [saida.xlsx] [overrides.json]
O arquivo de overrides (opcional) troca valores de premissas pelo nome da chave; é usado
pelo script de sensibilidade.
"""
import json
import sys

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter as L

OUT = sys.argv[1] if len(sys.argv) > 1 else "/home/user/jalecon/10_v1/financeiro/Jalecon_Modelo_Financeiro_v2.xlsx"
OVR = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}

N = 84  # meses (7 anos)
YEARS = 7
FONT = "Arial"
BLUE = Font(name=FONT, color="0000FF")
BLACK = Font(name=FONT, color="000000")
BOLD = Font(name=FONT, bold=True)
TITLE = Font(name=FONT, bold=True, size=14, color="1F2440")
H2 = Font(name=FONT, bold=True, color="FFFFFF")
HFILL = PatternFill("solid", fgColor="1F2440")
SFILL = PatternFill("solid", fgColor="E9EBF2")
KFILL = PatternFill("solid", fgColor="FBE9E0")
BRL = 'R$ #,##0;(R$ #,##0);-'
NUM = '#,##0;(#,##0);-'
NUM1 = '#,##0.0;(#,##0.0);-'
PCT = '0.0%;(0.0%);-'
MULT = '0.0"x"'

wb = Workbook()
A = {}  # chave -> referência absoluta da célula "usada"


def put(ws, r, c, v, font=BLACK, fmt=None, fill=None, bold=False):
    cell = ws.cell(row=r, column=c, value=v)
    cell.font = Font(name=FONT, bold=bold, color=font.color) if bold else font
    if fmt:
        cell.number_format = fmt
    if fill:
        cell.fill = fill
    return cell


def head(ws, r, labels, c0=1):
    for i, lab in enumerate(labels):
        cell = put(ws, r, c0 + i, lab, H2, fill=HFILL)
        cell.alignment = Alignment(horizontal="left" if i == 0 else "center", wrap_text=True)


def section(ws, r, text, width):
    for c in range(1, width + 1):
        ws.cell(row=r, column=c).fill = SFILL
    put(ws, r, 1, text, BOLD)


# ============================================================ Premissas
P = wb.active
P.title = "Premissas"
P.column_dimensions["A"].width = 58
P.column_dimensions["B"].width = 12
for col in "CDEF":
    P.column_dimensions[col].width = 14
P.column_dimensions["G"].width = 90
put(P, 1, 1, "Jalecon v2 · Premissas", TITLE)
put(P, 2, 1, "Texto azul = premissa editável. A coluna F (Usado) segue o cenário escolhido em C3. A coluna G diz de onde veio cada número.")
put(P, 3, 1, "Cenário (1 = Conservador, 2 = Base, 3 = Otimista)", BOLD)
put(P, 3, 3, OVR.get("cenario", 2), BLUE, fill=KFILL)
put(P, 3, 4, '=CHOOSE(C3,"Conservador","Base","Otimista")', BOLD)
A["cenario_nome"] = "Premissas!$D$3"
row = 5


def scen(key, label, unit, cons, base, opt, fmt, src):
    """Premissa com três cenários; F = valor usado."""
    global row
    vals = OVR.get(key)
    if vals is not None:
        cons = base = opt = vals
    put(P, row, 1, label)
    put(P, row, 2, unit)
    for i, v in enumerate((cons, base, opt)):
        put(P, row, 3 + i, v, BLUE, fmt)
    put(P, row, 6, f"=CHOOSE($C$3,C{row},D{row},E{row})", BLACK, fmt)
    put(P, row, 7, src)
    A[key] = f"Premissas!$F${row}"
    row += 1


def yearly(key, label, unit, vals, fmt, src):
    """Decisão por ano (anos 1 a 7), igual em todos os cenários. Colunas C..I."""
    global row
    vals = OVR.get(key, vals)
    put(P, row, 1, label)
    put(P, row, 2, unit)
    for i, v in enumerate(vals):
        put(P, row, 3 + i, v, BLUE, fmt)
    put(P, row, 10, src)
    A[key] = (row, 3)  # linha, coluna inicial
    row += 1


def sec(text):
    global row
    row += 1
    section(P, row, text, 7)
    row += 1


def yhead():
    global row
    head(P, row, ["", ""] + [f"Ano {y}" for y in range(1, YEARS + 1)] + ["Fonte"])
    row += 1


def shead():
    global row
    head(P, row, ["Premissa", "Unidade", "Conservador", "Base", "Otimista", "Usado", "Fonte ou justificativa"])
    row += 1


sec("1. Gerais")
shead()
scen("lancamento", "Mês de lançamento comercial (antes: produto e piloto)", "mês", 5, 4, 4, NUM, "Plano v0: 3 meses de piloto antes da venda")
scen("imp_baixo", "Impostos sobre a receita até R$ 4,8 mi nos últimos 12 meses", "%", 0.163, 0.163, 0.163, PCT, "v2.1: lucro presumido desde o início. O Simples não admite sócio pessoa jurídica, o que impede investidor institucional (contraprova)")
scen("imp_alto", "Impostos sobre a receita acima de R$ 4,8 mi nos últimos 12 meses", "%", 0.163, 0.163, 0.163, PCT, "Lucro presumido para serviços: PIS, COFINS, ISS, IRPJ e CSLL (aprox.)")
scen("meios_pg", "Meios de pagamento", "% da receita", 0.03, 0.03, 0.03, PCT, "Cartão e boleto recorrentes")
scen("sam_med", "Mercado endereçável: médicos que dependem de atrair pacientes particulares", "médicos", 115000, 150000, 230000, NUM, "Relatório 03, seção 1: 635,7 mil médicos × 48% em consultório × 50% dependem de pacientes particulares")
scen("exp_mes", "Expansão para dentistas: mês de início", "mês", 37, 25, 25, NUM, "Decisão; exige base de regras do CFO 196/2019 e produto adaptado")
scen("exp_fator", "Expansão: aquisição adicional sobre a de médicos", "%", 0.4, 0.7, 1.0, PCT, "Dentistas: mais de 450 mil e quase só atendimento particular (CFO, fonte secundária). Concorrência já presente (Sorriai)")
scen("sam_dent", "Mercado endereçável: dentistas", "dentistas", 120000, 180000, 225000, NUM, "450 mil × 40% a 50% com consultório próprio e dependentes de pacientes particulares (suposição)")
scen("exp_custo", "Custo único da expansão (regras, produto, jurídico)", "R$", 400000, 300000, 200000, BRL, "Estimativa")
scen("indic", "Indicação: novos clientes por mês, como % da base ativa", "%", 0.005, 0.01, 0.015, PCT, "Programa de indicação; v0 usava 1%")
scen("parc_mult", "Parcerias: multiplicador sobre o plano de parcerias", "x", 0.6, 1.0, 1.3, MULT, "Residências, sociedades, contadores, coworkings, clube de benefícios da iClinic")

sec("2. Decisões por ano (iguais nos dois modelos e nos três cenários)")
yhead()
yearly("midia", "Orçamento de mídia paga por mês", "R$", [20000, 50000, 100000, 160000, 220000, 280000, 340000], BRL, "Decisão de investimento")
yearly("parc", "Novos clientes por parcerias por mês (antes do multiplicador)", "clientes", [4, 10, 18, 26, 34, 42, 50], NUM, "Plano v0, ampliado")
yearly("hc_prod", "Produto, engenharia e IA (pessoas)", "pessoas", [4, 7, 10, 13, 16, 18, 20], NUM, "Plano de contratação")
yearly("hc_ga", "Administrativo, jurídico e conformidade (pessoas)", "pessoas", [1, 2, 4, 6, 8, 9, 10], NUM, "Plano de contratação")
yearly("prolabore", "Pró-labore por fundador por mês", "R$", [5000, 10000, 15000, 15000, 18000, 18000, 20000], BRL, "Plano v0 (6 fundadores)")
yearly("hc_vendas_A", "Modelo A: vendas e marketing (pessoas)", "pessoas", [2, 4, 7, 10, 13, 15, 17], NUM, "Venda por autosserviço e inside sales")
yearly("hc_vendas_B", "Modelo B: vendas e marketing (pessoas)", "pessoas", [3, 6, 10, 15, 20, 24, 28], NUM, "Venda consultiva: ticket maior pede mais gente")

sec("3. Custos de pessoas e despesas gerais")
shead()
scen("custo_prod", "Custo mensal por pessoa de produto e engenharia (com encargos)", "R$", 20000, 18000, 16000, BRL, "Mercado de São Paulo, pleno e sênior")
scen("custo_vendas", "Custo mensal por pessoa de vendas e marketing", "R$", 11000, 10000, 9000, BRL, "Mercado de São Paulo, com comissão média")
scen("custo_ga", "Custo mensal por pessoa administrativa e jurídica", "R$", 13000, 12000, 11000, BRL, "Mercado de São Paulo")
scen("fundadores", "Número de fundadores", "pessoas", 6, 6, 6, NUM, "Grupo 1")
scen("outras_fixo", "Outras despesas fixas por mês (ferramentas, jurídico, contabilidade)", "R$", 20000, 15000, 12000, BRL, "Estimativa")
scen("outras_pct", "Outras despesas variáveis", "% da receita", 0.04, 0.03, 0.025, PCT, "Estimativa")
scen("marca_pct", "Marca, eventos e conteúdo próprio", "% da mídia", 0.08, 0.05, 0.05, PCT, "Congressos e conteúdo sobre regras do CFM")

# ---- planos
PLANS = {
    "A": [
        # chave, nome, preço, setup, mix (c,b,o), churn (c,b,o), custo direto (c,b,o), contas por especialista (c,b,o) ou None, variável por mês (c,b,o) ou None, mês início
        ("E", "Essencial", 297, 0, (0.40, 0.40, 0.35), (0.09, 0.07, 0.055), (32, 25, 20), None, None, 1),
        ("C", "Consultório", 697, 490, (0.45, 0.45, 0.45), (0.07, 0.055, 0.04), (65, 50, 40), None, None, 1),
        ("T", "Autoridade", 1497, 990, (0.12, 0.12, 0.15), (0.045, 0.035, 0.025), (130, 100, 80), (30, 40, 50), None, 1),
        ("K", "Clínica", 3900, 2900, (0.03, 0.03, 0.05), (0.035, 0.025, 0.02), (325, 250, 200), (15, 20, 25), None, 13),
    ],
    "B": [
        ("P", "Presença", 990, 990, (0.55, 0.55, 0.50), (0.07, 0.055, 0.035), (155, 120, 95), (35, 50, 70), None, 1),
        ("G", "Agenda Cheia", 1790, 1490, (0.40, 0.40, 0.42), (0.065, 0.05, 0.03), (285, 220, 175), (20, 30, 40), (6, 10, 15), 9),
        ("K", "Clínica", 4500, 3900, (0.05, 0.05, 0.08), (0.035, 0.025, 0.022), (650, 500, 400), (8, 12, 15), (20, 35, 50), 13),
    ],
}
MODEL_SRC = {
    "A": {
        "preco": "Plano v0", "mix": "Plano v0, ajustado", "churn": "Relatório 03, seção 4: referências de 4% a 7% (até 9% abaixo de US$ 100) para software de pequena empresa",
        "custo": "IA (Claude), imagens, hospedagem e publicação; v0 estimava de US$ 4 a US$ 45 por conta",
        "esp": "Gestor de conta humano nos planos Autoridade e Clínica (v0: 1 para 40 e 1 para 20)",
    },
    "B": {
        "preco": "Faixa entre a Doctoralia (R$ 429 a R$ 877) e a mediana de agências (R$ 3.250)", "mix": "Suposição",
        "churn": "v2.1: regra pré-registrada (referência de software para pequenas empresas, 4% a 7%), porque o contrato é mensal. O valor de agência com contrato (2% a 3,5%) virou o cenário otimista",
        "custo": "Agentes de IA (mais peças, anúncios, atendimento no WhatsApp), imagens, hospedagem, API do WhatsApp",
        "esp": "v2.1: agências trabalham com 5 a 30 contas por gerente (contraprova). O otimista (40 a 70) é a aposta a provar no piloto",
    },
}

sec("4. Modelo A: software por assinatura")
shead()
scen("A_cac", "CAC na mídia paga", "R$", 6000, 4500, 3000, BRL, "Relatório 03, seção 4: recuperação do CAC em 8 a 11 meses equivale a R$ 4.500 a R$ 6.100; v0 usava R$ 1.800")
scen("A_comissao", "Custo por cliente vindo de parceria (comissão)", "R$", 1800, 1500, 1200, BRL, "Comissão de cerca de 2 mensalidades")
scen("A_custo_esp", "Custo mensal do gestor de conta (com encargos)", "R$", 9500, 9000, 8500, BRL, "Mercado")
for k, name, price, setup, mix, churn, custo, esp, var, start in PLANS["A"]:
    s = MODEL_SRC["A"]
    scen(f"A_{k}_preco", f"{name}: preço mensal", "R$", price, price, price, BRL, s["preco"])
    scen(f"A_{k}_setup", f"{name}: taxa de implantação", "R$", setup, setup, setup, BRL, s["preco"])
    scen(f"A_{k}_mix", f"{name}: participação nos novos clientes", "%", *mix, PCT, s["mix"] + (" (a partir do mês 13; antes vai para o Consultório)" if start > 1 else ""))
    scen(f"A_{k}_churn", f"{name}: churn mensal", "%", *churn, PCT, s["churn"])
    scen(f"A_{k}_custo", f"{name}: custo direto por conta por mês (IA, infraestrutura)", "R$", *custo, BRL, s["custo"])
    if esp:
        scen(f"A_{k}_esp", f"{name}: contas por gestor humano", "contas", *esp, NUM, s["esp"])

sec("5. Modelo B: agência operada por agentes")
shead()
scen("B_cac", "CAC na mídia paga (venda consultiva)", "R$", 9000, 6500, 5000, BRL, "v2.1: mesmo método do Modelo A (recuperação do CAC em cerca de 8 meses sobre a contribuição ponderada pelos planos)")
scen("B_comissao", "Custo por cliente vindo de parceria (comissão)", "R$", 2500, 2000, 1600, BRL, "Comissão de cerca de 1,5 mensalidade")
scen("B_custo_esp", "Custo mensal do especialista que supervisiona as contas", "R$", 11000, 10000, 9000, BRL, "Profissional de marketing pleno ou sênior")
scen("B_valor_consulta", "Preço por consulta nova agendada e atribuída à Jalecon", "R$", 0, 0, 0, BRL, "v2.1: desligado. Cobrar por paciente recebido pode ferir o art. 59 do Código de Ética Médica (contraprova); só volta com parecer jurídico favorável")
for k, name, price, setup, mix, churn, custo, esp, var, start in PLANS["B"]:
    s = MODEL_SRC["B"]
    scen(f"B_{k}_preco", f"{name}: preço mensal fixo", "R$", price, price, price, BRL, s["preco"])
    scen(f"B_{k}_setup", f"{name}: taxa de implantação", "R$", setup, setup, setup, BRL, s["preco"])
    scen(f"B_{k}_mix", f"{name}: participação nos novos clientes", "%", *mix, PCT, s["mix"] + ((" (a partir do mês 13; antes vai para Agenda Cheia ou Presença)" if k == "K" else " (a partir do mês 9, como no PRD; antes vai para Presença)") if start > 1 else ""))
    scen(f"B_{k}_churn", f"{name}: churn mensal", "%", *churn, PCT, s["churn"])
    scen(f"B_{k}_custo", f"{name}: custo direto por conta por mês (agentes, ferramentas)", "R$", *custo, BRL, s["custo"])
    scen(f"B_{k}_esp", f"{name}: contas por especialista humano", "contas", *esp, NUM, s["esp"])
    if var:
        scen(f"B_{k}_consultas", f"{name}: consultas novas atribuídas por cliente por mês", "consultas", *var, NUM, "Suposição a validar no piloto; medido pelo link de WhatsApp e agenda")

sec("6. Critérios de corte do plano v1 (fixados em 19/10/2026)")
shead()
scen("crit_mb", "H6: margem bruta mínima", "%", 0.70, 0.70, 0.70, PCT, "Plano v1, seção 2")
scen("crit_ltvcac", "H6: LTV/CAC mínimo no plano principal", "x", 3, 3, 3, MULT, "Plano v1, seção 2")
scen("crit_payback", "H6: recuperação máxima do CAC", "meses", 12, 12, 12, NUM, "Plano v1, seção 2")
scen("crit_arr", "H7: receita recorrente anual mínima em até 7 anos", "R$", 50000000, 50000000, 50000000, BRL, "Plano v1, seção 2")
scen("crit_pen", "H7: participação máxima do mercado endereçável quando atingir esse valor", "%", 0.03, 0.03, 0.03, PCT, "Plano v1, seção 2")

sec("7. Ajustes da contraprova (v2.1, 20/10/2026)")
shead()
scen("A_impl", "Modelo A: custo de implantação por cliente novo", "R$", 200, 150, 100, BRL, "Onboarding assistido; antes a taxa de implantação era receita sem custo (contraprova)")
scen("B_impl", "Modelo B: custo de implantação por cliente novo", "R$", 900, 600, 400, BRL, "Cerca de 6 horas de especialista mais ferramentas para marca, site e perfil no Google")
scen("A_ind", "Modelo A: custo por cliente indicado (mês grátis)", "R$", 697, 697, 697, BRL, "Programa de indicação: um mês grátis; antes sem custo (contraprova)")
scen("B_ind", "Modelo B: custo por cliente indicado (mês grátis)", "R$", 1300, 1300, 1300, BRL, "Um mês grátis na mensalidade média ponderada")


def ycell(key, year_ref):
    """Valor de uma decisão anual para o ano dado (referência de célula com o ano)."""
    r, c0 = A[key]
    return f"INDEX(Premissas!$C${r}:$I${r},1,{year_ref})"


# ============================================================ Abas mensais
def model_sheet(m):
    ws = wb.create_sheet(f"Modelo {m}")
    ws.column_dimensions["A"].width = 52
    ws.column_dimensions["B"].width = 4
    for c in range(3, 3 + N):
        ws.column_dimensions[L(c)].width = 11
    ws.freeze_panes = "C3"
    put(ws, 1, 1, f"Modelo {m}: " + ("software por assinatura" if m == "A" else "agência operada por agentes") + " · mês a mês", TITLE)
    R = {}
    r = 2

    pending = []

    def line(key, label, fn, fmt=NUM, bold=False, fill=None):
        nonlocal r
        put(ws, r, 1, label, BOLD if bold else BLACK, fill=fill)
        pending.append((r, fn, fmt, bold, fill))
        R[key] = r
        r += 1

    def flush():
        for rr, fn, fmt, bold, fill in pending:
            for i in range(N):
                col = 3 + i
                put(ws, rr, col, fn(i, col), BLACK, fmt, fill=fill, bold=bold)

    def ref(key, col):
        return f"{L(col)}{R[key]}"

    def prev(key, col):
        return f"{L(col - 1)}{R[key]}" if col > 3 else "0"

    line("mes", "Mês", lambda i, c: i + 1, NUM, bold=True)
    line("ano", "Ano", lambda i, c: f"=ROUNDUP({ref('mes', c)}/12,0)")
    line("ativo", "Venda ativa (1 a partir do lançamento)", lambda i, c: f"=IF({ref('mes', c)}>={A['lancamento']},1,0)")
    line("exp", "Fator de expansão para dentistas", lambda i, c: f"=IF({ref('mes', c)}>={A['exp_mes']},1+{A['exp_fator']},1)", MULT)
    r += 1
    section(ws, r, "Aquisição", 2); r += 1
    line("midia", "Mídia paga no mês", lambda i, c: f"={ycell('midia', ref('ano', c))}*{ref('ativo', c)}*{ref('exp', c)}", BRL)
    line("n_midia", "Novos clientes por mídia paga", lambda i, c: f"={ref('midia', c)}/{A[m + '_cac']}", NUM1)
    line("n_parc", "Novos clientes por parcerias", lambda i, c: f"={ycell('parc', ref('ano', c))}*{A['parc_mult']}*{ref('ativo', c)}*{ref('exp', c)}", NUM1)
    plans = PLANS[m]
    line("n_ind", "Novos clientes por indicação", lambda i, c: f"={prev('tot_ativos', c)}*{A['indic']}*{ref('ativo', c)}" if c > 3 else "=0", NUM1)
    line("n_tot", "Novos clientes no mês", lambda i, c: f"={ref('n_midia', c)}+{ref('n_parc', c)}+{ref('n_ind', c)}", NUM1, bold=True)

    main_plan = plans[1][0]  # Consultório (A) ou Agenda Cheia (B) recebe a fatia da Clínica antes do mês 13
    for k, name, *_rest in plans:
        start = _rest[-1]
        r += 1
        section(ws, r, f"Plano {name}", 2); r += 1
        mixref = A[f"{m}_{k}_mix"]
        if k == "K":
            line(f"mix_{k}", "Participação nos novos", lambda i, c, mixref=mixref: f"=IF({ref('mes', c)}>=13,{mixref},0)", PCT)
        elif m == "B" and k == "P":
            line(f"mix_{k}", "Participação nos novos", lambda i, c, mixref=mixref: f"={mixref}+IF({ref('mes', c)}<9,{A['B_G_mix']}+IF({ref('mes', c)}<13,{A['B_K_mix']},0),0)", PCT)
        elif m == "B" and k == "G":
            line(f"mix_{k}", "Participação nos novos", lambda i, c, mixref=mixref: f"=IF({ref('mes', c)}>=9,{mixref}+IF({ref('mes', c)}<13,{A['B_K_mix']},0),0)", PCT)
        elif k == main_plan:
            line(f"mix_{k}", "Participação nos novos", lambda i, c, mixref=mixref: f"={mixref}+IF({ref('mes', c)}<13,{A[m + '_K_mix']},0)", PCT)
        else:
            line(f"mix_{k}", "Participação nos novos", lambda i, c, mixref=mixref: f"={mixref}", PCT)
        line(f"novos_{k}", "Novos", lambda i, c, k=k: f"={ref('n_tot', c)}*{ref('mix_' + k, c)}", NUM1)
        line(f"perd_{k}", "Cancelados", lambda i, c, k=k: f"={prev('ativos_' + k, c)}*{A[f'{m}_{k}_churn']}", NUM1)
        line(f"ativos_{k}", "Ativos no fim do mês", lambda i, c, k=k: f"={prev('ativos_' + k, c)}+{ref('novos_' + k, c)}-{ref('perd_' + k, c)}", NUM1, bold=True)

    r += 1
    section(ws, r, "Clientes e receita", 2); r += 1
    line("tot_ativos", "Clientes ativos", lambda i, c: "=" + "+".join(ref("ativos_" + p[0], c) for p in plans), NUM, bold=True)
    line("sam", "Mercado endereçável no mês", lambda i, c: f"={A['sam_med']}+IF({ref('mes', c)}>={A['exp_mes']},{A['sam_dent']},0)", NUM)
    line("pen", "Participação no mercado endereçável", lambda i, c: f"={ref('tot_ativos', c)}/{ref('sam', c)}", PCT)
    line("rec_fixa", "Receita de mensalidades", lambda i, c: "=" + "+".join(f"{ref('ativos_' + p[0], c)}*{A[f'{m}_{p[0]}_preco']}" for p in plans), BRL)
    line("rec_setup", "Receita de implantação", lambda i, c: "=" + "+".join(f"{ref('novos_' + p[0], c)}*{A[f'{m}_{p[0]}_setup']}" for p in plans), BRL)
    var_plans = [p for p in plans if p[8]]
    if var_plans:
        line("rec_var", "Receita por consulta agendada", lambda i, c: "=(" + "+".join(f"{ref('ativos_' + p[0], c)}*{A[f'{m}_{p[0]}_consultas']}" for p in var_plans) + f")*{A['B_valor_consulta']}", BRL)
    else:
        line("rec_var", "Receita por consulta agendada", lambda i, c: "=0", BRL)
    line("rec", "Receita bruta", lambda i, c: f"={ref('rec_fixa', c)}+{ref('rec_setup', c)}+{ref('rec_var', c)}", BRL, bold=True)
    line("mrr", "Receita recorrente mensal (mensalidades + consultas)", lambda i, c: f"={ref('rec_fixa', c)}+{ref('rec_var', c)}", BRL)
    line("arr", "Receita recorrente anualizada (MRR × 12)", lambda i, c: f"={ref('mrr', c)}*12", BRL, bold=True)

    def trailing(c):
        # receita dos 12 meses anteriores; forma invariante para poder copiar a coluna para a direita
        last_ = L(2 + N)
        return (f'SUMIFS($C${R["rec"]}:${last_}${R["rec"]},$C${R["mes"]}:${last_}${R["mes"]},">="&({ref("mes", c)}-12),'
                f'$C${R["mes"]}:${last_}${R["mes"]},"<"&{ref("mes", c)})')

    line("imp", "Impostos sobre a receita", lambda i, c: f"={ref('rec', c)}*IF({trailing(c)}>4800000,{A['imp_alto']},{A['imp_baixo']})", BRL)
    line("mpg", "Meios de pagamento", lambda i, c: f"={ref('rec', c)}*{A['meios_pg']}", BRL)
    line("rec_liq", "Receita líquida", lambda i, c: f"={ref('rec', c)}-{ref('imp', c)}-{ref('mpg', c)}", BRL, bold=True)

    r += 1
    section(ws, r, "Custo do serviço", 2); r += 1
    line("cogs_dir", "Custo direto (IA, ferramentas, hospedagem, implantação)", lambda i, c: "=" + "+".join(f"{ref('ativos_' + p[0], c)}*{A[f'{m}_{p[0]}_custo']}" for p in plans) + f"+{ref('n_tot', c)}*{A[m + '_impl']}", BRL)
    esp_plans = [p for p in plans if p[7]]
    line("esp_n", "Especialistas humanos nas contas (pessoas)", lambda i, c: "=" + "+".join(f"{ref('ativos_' + p[0], c)}/{A[f'{m}_{p[0]}_esp']}" for p in esp_plans), NUM1)
    line("cogs_esp", "Custo dos especialistas", lambda i, c: f"={ref('esp_n', c)}*{A[m + '_custo_esp']}", BRL)
    line("cogs", "Custo do serviço total", lambda i, c: f"={ref('cogs_dir', c)}+{ref('cogs_esp', c)}", BRL, bold=True)
    line("lb", "Lucro bruto", lambda i, c: f"={ref('rec_liq', c)}-{ref('cogs', c)}", BRL, bold=True)
    line("mb", "Margem bruta (sobre a receita líquida)", lambda i, c: f"=IF({ref('rec_liq', c)}>0,{ref('lb', c)}/{ref('rec_liq', c)},0)", PCT)

    r += 1
    section(ws, r, "Despesas operacionais", 2); r += 1
    line("d_prod", "Produto, engenharia e IA", lambda i, c: f"={ycell('hc_prod', ref('ano', c))}*{A['custo_prod']}", BRL)
    line("d_vendas", "Equipe de vendas e marketing", lambda i, c: f"={ycell('hc_vendas_' + m, ref('ano', c))}*{A['custo_vendas']}", BRL)
    line("d_ga", "Administrativo, jurídico e conformidade", lambda i, c: f"={ycell('hc_ga', ref('ano', c))}*{A['custo_ga']}", BRL)
    line("d_fund", "Pró-labore dos fundadores", lambda i, c: f"={ycell('prolabore', ref('ano', c))}*{A['fundadores']}", BRL)
    line("d_midia", "Mídia paga", lambda i, c: f"={ref('midia', c)}", BRL)
    line("d_parc", "Comissões de parceria e meses grátis de indicação", lambda i, c: f"={ref('n_parc', c)}*{A[m + '_comissao']}+{ref('n_ind', c)}*{A[m + '_ind']}", BRL)
    line("d_marca", "Marca e eventos", lambda i, c: f"={ref('midia', c)}*{A['marca_pct']}", BRL)
    line("d_outras", "Outras despesas", lambda i, c: f"={A['outras_fixo']}+{ref('rec', c)}*{A['outras_pct']}", BRL)
    line("d_exp", "Custo único da expansão", lambda i, c: f"=IF({ref('mes', c)}={A['exp_mes']},{A['exp_custo']},0)", BRL)
    line("opex", "Despesas operacionais totais", lambda i, c: "=" + "+".join(ref(k, c) for k in ("d_prod", "d_vendas", "d_ga", "d_fund", "d_midia", "d_parc", "d_marca", "d_outras", "d_exp")), BRL, bold=True)

    r += 1
    section(ws, r, "Resultado e caixa", 2); r += 1
    line("ebitda", "EBITDA", lambda i, c: f"={ref('lb', c)}-{ref('opex', c)}", BRL, bold=True, fill=KFILL)
    line("caixa", "Caixa acumulado sem captação", lambda i, c: f"={prev('caixa', c)}+{ref('ebitda', c)}", BRL, bold=True)
    last = L(2 + N)
    line("eq_flag", "Mês de equilíbrio candidato (EBITDA não volta a ficar negativo)", lambda i, c: f'=IF(COUNTIF({L(c)}{R["ebitda"]}:${last}${R["ebitda"]},"<0")=0,{ref("mes", c)},"")', NUM)
    line("arr_flag", "Mês em que a receita anualizada passa do critério H7", lambda i, c: f'=IF(AND({ref("arr", c)}>={A["crit_arr"]},{prev("arr", c) if c > 3 else "0"}<{A["crit_arr"]}),{ref("mes", c)},"")', NUM)
    line("hc", "Pessoas no total (fundadores, equipe e especialistas)", lambda i, c: f"={A['fundadores']}+{ycell('hc_prod', ref('ano', c))}+{ycell('hc_vendas_' + m, ref('ano', c))}+{ycell('hc_ga', ref('ano', c))}+{ref('esp_n', c)}", NUM1)
    flush()
    return ws, R


MS = {}
for m in ("A", "B"):
    MS[m] = model_sheet(m)


# ============================================================ Unidade (economia por cliente)
U = wb.create_sheet("Unidade", 1)
U.column_dimensions["A"].width = 44
for c in range(2, 10):
    U.column_dimensions[L(c)].width = 15
put(U, 1, 1, "Economia por cliente, por plano (cenário selecionado)", TITLE)
put(U, 2, 1, "Contribuição = mensalidade e consultas, menos impostos (alíquota cheia), meios de pagamento, custo direto e parte do especialista humano. LTV = contribuição / churn + taxa de implantação - custo de implantação.")
labels = ["Plano", "Receita mensal", "Contribuição mensal", "Margem de contribuição", "Churn mensal", "LTV", "CAC mídia paga", "LTV/CAC", "Recuperação do CAC (meses)"]
r = 4
UREF = {}
for m in ("A", "B"):
    section(U, r, "Modelo A: software por assinatura" if m == "A" else "Modelo B: agência operada por agentes", 9); r += 1
    head(U, r, labels); r += 1
    for k, name, price, setup, mix, churn, custo, esp, var, start in PLANS[m]:
        put(U, r, 1, name)
        varterm = f"+{A[f'B_{k}_consultas']}*{A['B_valor_consulta']}" if var else ""
        put(U, r, 2, f"={A[f'{m}_{k}_preco']}{varterm}", fmt=BRL)
        espterm = f"-{A[m + '_custo_esp']}/{A[f'{m}_{k}_esp']}" if esp else ""
        put(U, r, 3, f"=B{r}*(1-{A['imp_alto']}-{A['meios_pg']})-{A[f'{m}_{k}_custo']}{espterm}", fmt=BRL)
        put(U, r, 4, f"=C{r}/B{r}", fmt=PCT)
        put(U, r, 5, f"={A[f'{m}_{k}_churn']}", fmt=PCT)
        put(U, r, 6, f"=C{r}/E{r}+{A[f'{m}_{k}_setup']}-{A[m + '_impl']}", fmt=BRL)
        put(U, r, 7, f"={A[m + '_cac']}", fmt=BRL)
        put(U, r, 8, f"=F{r}/G{r}", fmt=MULT)
        put(U, r, 9, f"=G{r}/C{r}", fmt=NUM1)
        UREF[(m, k)] = r
        r += 1
    r += 1

# ============================================================ Resumo
S = wb.create_sheet("Resumo", 0)
S.column_dimensions["A"].width = 58
for c in range(2, 18):
    S.column_dimensions[L(c)].width = 14
put(S, 1, 1, "Jalecon v2 · Resumo comparativo", TITLE)
put(S, 2, 1, "Cenário:", BOLD)
put(S, 2, 2, f"={A['cenario_nome']}", BOLD)
put(S, 3, 1, "Troque o cenário na aba Premissas, célula C3. Valores em reais nominais.")


def ysum(m, key, y, how="sum"):
    ws, R = MS[m]
    rng = f"'Modelo {m}'!$C${R[key]}:${L(2 + N)}${R[key]}"
    anos = f"'Modelo {m}'!$C${R['ano']}:${L(2 + N)}${R['ano']}"
    if how == "sum":
        return f"=SUMIF({anos},{y},{rng})"
    col = L(2 + 12 * y)
    return f"='Modelo {m}'!{col}{R[key]}"


r = 5
for m in ("A", "B"):
    section(S, r, "Modelo A: software por assinatura" if m == "A" else "Modelo B: agência operada por agentes", 8); r += 1
    head(S, r, ["Indicador"] + [f"Ano {y}" for y in range(1, YEARS + 1)]); r += 1
    rows = [
        ("Clientes ativos (fim do ano)", "tot_ativos", "end", NUM),
        ("Receita bruta", "rec", "sum", BRL),
        ("Receita recorrente anualizada (fim do ano)", "arr", "end", BRL),
        ("Lucro bruto", "lb", "sum", BRL),
        ("EBITDA", "ebitda", "sum", BRL),
        ("Caixa acumulado sem captação (fim do ano)", "caixa", "end", BRL),
        ("Pessoas (fim do ano)", "hc", "end", NUM),
        ("Participação no mercado endereçável (fim do ano)", "pen", "end", PCT),
    ]
    for label, key, how, fmt in rows:
        put(S, r, 1, label)
        for y in range(1, YEARS + 1):
            put(S, r, 1 + y, ysum(m, key, y, how), fmt=fmt)
        if key == "lb":
            r += 1
            put(S, r, 1, "Margem bruta (sobre a receita líquida)")
            for y in range(1, YEARS + 1):
                put(S, r, 1 + y, f"=IFERROR({ysum(m, 'lb', y)[1:]}/{ysum(m, 'rec_liq', y)[1:]},0)", fmt=PCT)
        r += 1
    r += 1

section(S, r, "Indicadores-chave e critérios de corte", 8); r += 1
head(S, r, ["Indicador", "Modelo A", "Modelo B", "Critério", "A passa?", "B passa?"]); r += 1
KEY = {}


def keyrow(label, fa, fb, fmt, crit=None, test=None):
    global r
    put(S, r, 1, label)
    put(S, r, 2, fa, fmt=fmt)
    put(S, r, 3, fb, fmt=fmt)
    if crit is not None:
        put(S, r, 4, crit[0], fmt=crit[1])
    if test:
        put(S, r, 5, test.format(v=f"B{r}"))
        put(S, r, 6, test.format(v=f"C{r}"))
    KEY[label] = r
    r += 1


def rng(m, key):
    ws, R = MS[m]
    return f"'Modelo {m}'!$C${R[key]}:${L(2 + N)}${R[key]}"


def at(m, key, month_expr):
    return f"INDEX({rng(m, key)},1,{month_expr})"


keyrow("Receita recorrente anualizada no ano 5", f"={at('A', 'arr', 60)}", f"={at('B', 'arr', 60)}", BRL)
keyrow("Receita recorrente anualizada no ano 7", f"={at('A', 'arr', 84)}", f"={at('B', 'arr', 84)}", BRL)
keyrow("Mês de equilíbrio (EBITDA positivo daí em diante)", f'=IFERROR(1/(1/MIN({rng("A", "eq_flag")})),"não chega")', f'=IFERROR(1/(1/MIN({rng("B", "eq_flag")})),"não chega")', NUM)
keyrow("Capital necessário (pior caixa acumulado)", f"=-MIN(0,MIN({rng('A', 'caixa')}))", f"=-MIN(0,MIN({rng('B', 'caixa')}))", BRL)
keyrow("Margem bruta no ano 5", f"=SUMIF('Modelo A'!$C$3:${L(2 + N)}$3,5,{rng('A', 'lb')})/SUMIF('Modelo A'!$C$3:${L(2 + N)}$3,5,{rng('A', 'rec_liq')})",
       f"=SUMIF('Modelo B'!$C$3:${L(2 + N)}$3,5,{rng('B', 'lb')})/SUMIF('Modelo B'!$C$3:${L(2 + N)}$3,5,{rng('B', 'rec_liq')})", PCT,
       (f"={A['crit_mb']}", PCT), '=IF({v}>=' + A["crit_mb"] + ',"Sim","Não")')
ua, ub = UREF[("A", "C")], UREF[("B", "G")]
keyrow("LTV/CAC do plano principal (Consultório / Agenda Cheia), mídia paga", f"=Unidade!H{ua}", f"=Unidade!H{ub}", MULT,
       (f"={A['crit_ltvcac']}", MULT), '=IF({v}>=' + A["crit_ltvcac"] + ',"Sim","Não")')
keyrow("Recuperação do CAC do plano principal (meses)", f"=Unidade!I{ua}", f"=Unidade!I{ub}", NUM1,
       (f"={A['crit_payback']}", NUM), '=IF({v}<=' + A["crit_payback"] + ',"Sim","Não")')
keyrow("Mês em que a receita anualizada chega a R$ 50 mi", f'=IFERROR(1/(1/MIN({rng("A", "arr_flag")})),"não chega")', f'=IFERROR(1/(1/MIN({rng("B", "arr_flag")})),"não chega")', NUM)
pa = KEY["Mês em que a receita anualizada chega a R$ 50 mi"]
keyrow("Participação no mercado nesse mês", f'=IF(ISNUMBER(B{pa}),{at("A", "pen", f"B{pa}")},"")', f'=IF(ISNUMBER(C{pa}),{at("B", "pen", f"C{pa}")},"")', PCT,
       (f"={A['crit_pen']}", PCT), '=IF(ISNUMBER({v}),IF({v}<=' + A["crit_pen"] + ',"Sim","Não"),"Não chega a R$ 50 mi")')
keyrow("Receita por pessoa no ano 5", f"=SUMIF('Modelo A'!$C$3:${L(2 + N)}$3,5,{rng('A', 'rec')})/{at('A', 'hc', 60)}",
       f"=SUMIF('Modelo B'!$C$3:${L(2 + N)}$3,5,{rng('B', 'rec')})/{at('B', 'hc', 60)}", BRL)
keyrow("Clientes ativos no ano 5", f"={at('A', 'tot_ativos', 60)}", f"={at('B', 'tot_ativos', 60)}", NUM)
wa = "+".join(f"{A[f'A_{p[0]}_mix']}*Unidade!F{UREF[('A', p[0])]}" for p in PLANS["A"])
wb_ = "+".join(f"{A[f'B_{p[0]}_mix']}*Unidade!F{UREF[('B', p[0])]}" for p in PLANS["B"])
keyrow("LTV/CAC ponderado pelo mix de novos clientes (mídia paga)", f"=({wa})/{A['A_cac']}", f"=({wb_})/{A['B_cac']}", MULT,
       (f"={A['crit_ltvcac']}", MULT), '=IF({v}>=' + A["crit_ltvcac"] + ',"Sim","Não")')

r += 1
put(S, r, 1, "Como ler: H6 exige as três linhas com 'Sim' (margem, LTV/CAC e recuperação do CAC). H7 exige chegar a R$ 50 mi de receita anualizada em até 7 anos com no máximo 3% do mercado endereçável.")
r += 1
put(S, r, 1, "As abas Cenarios e Sensibilidade são geradas pelo script sensibilidade_v2.py: são valores, não fórmulas. Ao mudar premissas, rode o script de novo.")

# ============================================================ Leia-me
LM = wb.create_sheet("Leia-me", 1)
LM.column_dimensions["A"].width = 130
texts = [
    ("Jalecon v2 · Como usar este modelo", TITLE),
    ("Compara dois desenhos de negócio com as mesmas condições de mercado:", BOLD),
    ("Modelo A, software por assinatura: o médico usa a plataforma e faz o trabalho com ajuda da IA (planos de R$ 297 a R$ 3.900, como no v0).", BLACK),
    ("Modelo B, agência operada por agentes: uma equipe de agentes de IA executa marca, site, Google, conteúdo, anúncios e atendimento no WhatsApp; um especialista humano supervisiona dezenas de contas; parte do preço é cobrada por consulta agendada.", BLACK),
    ("", BLACK),
    ("Abas: Resumo (comparação e critérios de corte), Leia-me, Unidade (economia por cliente), Premissas (tudo o que pode ser mudado), Modelo A e Modelo B (mês a mês, 84 meses), Cenarios e Sensibilidade (geradas por script).", BLACK),
    ("Premissas em azul. Troque o cenário em Premissas!C3. Cada premissa tem a fonte na coluna G; as referências vêm do relatório 03 (mercado e concorrência).", BLACK),
    ("O caixa é calculado sem captação: o pior caixa acumulado é o capital necessário até o equilíbrio (sem reserva). A captação recomendada soma 6 meses de reserva a esse valor.", BLACK),
    ("Versão 2.1 (20/10/2026): incorpora a contraprova. Impostos de lucro presumido desde o início; churn, CAC e capacidade dos especialistas do Modelo B pela regra pré-registrada; cobrança por consulta desligada (art. 59 do Código de Ética Médica); custos de implantação e de indicação; mídia proporcional à expansão; Agenda Cheia a partir do mês 9.", BLACK),
    ("Limitações: churn e CAC ainda são referências de mercado, não medição própria; não há sazonalidade; as consultas atribuídas no Modelo B são suposição a validar em piloto.", BLACK),
]
for i, (t, f) in enumerate(texts, start=1):
    c = put(LM, i, 1, t, f)
    c.alignment = Alignment(wrap_text=True)

wb.save(OUT)
print("ok", OUT)
