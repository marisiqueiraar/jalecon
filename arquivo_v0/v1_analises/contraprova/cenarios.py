import json, copy
from pymodel import params, summary, unit, run

CORR = dict(fix_exp_midia=True, fix_ltv_imp=True, ref_custo=0, impl_custo={"A":150,"B":800})
def corr(P):
    P.update(CORR); return P

def ceticoB():
    P = params(1)  # parte do conservador da própria equipe
    P.update(corr({}))
    P.update({"B_P_churn":.055,"B_G_churn":.045,"B_K_churn":.03,
              "B_P_esp":45,"B_G_esp":25,"B_K_esp":10,"B_custo_esp":13500,
              "B_P_custo":185,"B_G_custo":315,"B_K_custo":700,
              "B_P_preco":890,"B_G_preco":1610,"B_K_preco":4050,
              "B_G_consultas":5,"B_K_consultas":18,"setup_haircut":0.5,
              "B_cac":9000,"B_comissao":2500,
              "imp_baixo":.15,"imp_alto":.20,"meios_pg":.05})
    return P
def ceticoA():
    P = params(1); P.update(corr({}))
    P.update({"A_E_churn":.08,"A_C_churn":.06,"A_T_churn":.045,"A_K_churn":.03,
              "A_T_esp":30,"A_K_esp":15,"A_custo_esp":10500,
              "A_E_preco":267,"A_C_preco":627,"A_T_preco":1347,"A_K_preco":3510,"setup_haircut":0.5,
              "A_cac":6000,"A_comissao":1800,"imp_baixo":.15,"imp_alto":.20,"meios_pg":.05})
    return P
def refcost(P, m):  # mês grátis por indicação = mensalidade média ponderada pelo mix
    from pymodel import PLANS
    P["ref_custo"] = sum(P[f"{m}_{k}_mix"]*P[f"{m}_{k}_preco"] for k,*_ in PLANS[m])
    return P

S = {}
S["0_base_equipe"] = {m: params(2) for m in "AB"}
S["1_base_corrigido"] = {m: refcost(corr(params(2)), m) for m in "AB"}
# regra pré-registrada: churn de referência de SaaS PME (5,5% Agenda/Consultório, 7% Presença... ) + CAC por payback de 9,5 meses
def prereg(m):
    P = refcost(corr(params(2)), m)
    if m == "B":
        P.update({"B_P_churn":.055,"B_G_churn":.055,"B_K_churn":.035})
        c = unit("B", P)["contrib"]; P["B_cac"] = round(9.5*c, -2)
    else:
        c = unit("A", P)["contrib"]; P["A_cac"] = round(9.5*c, -2)
    return P
S["2_regra_pre_registrada"] = {m: prereg(m) for m in "AB"}
S["3_cetico"] = {"A": refcost(ceticoA(), "A"), "B": refcost(ceticoB(), "B")}
nb = refcost(ceticoB(), "B"); nb.update({"B_G_consultas":0,"B_K_consultas":0})
S["4_cetico_sem_cobranca_por_consulta"] = {"A": refcost(ceticoA(), "A"), "B": nb}
S["5_cetico_sem_dentistas"] = {m: dict(P, exp_mes=999) for m, P in S["3_cetico"].items()}

res = {}
for name, d in S.items():
    res[name] = {}
    for m in "AB":
        r = summary(m, d[m]); res[name][m] = r
        print(name, m, f"ARR5 {r['arr5']/1e6:6.1f} ARR7 {r['arr7']/1e6:6.1f} (só fixa {r['arr7_fixa']/1e6:6.1f}) cap {r['cap']/1e6:6.1f} eq {r['eq']} MB5 {r['mb5']:.1%} LTV/CAC {r['ltvcac']:.2f} payback {r['payback']:.1f} m50 {r['m50']} pen {r['pen50']} cli5 {r['cli5']:.0f} cli7 {r['cli7']:.0f} CAC {d[m][m+'_cac']}")
json.dump({"res":res,"params":{n:{m:{k:v for k,v in P.items()} for m,P in d.items()} for n,d in S.items()}}, open("runs/cenarios.json","w"), default=str, ensure_ascii=False, indent=1)
