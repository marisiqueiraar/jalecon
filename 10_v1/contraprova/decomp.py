from pymodel import params, summary, PLANS
def refc(P,m): return sum(P[f"{m}_{k}_mix"]*P[f"{m}_{k}_preco"] for k,*_ in PLANS[m])
def show(lbl, m, P):
    r = summary(m, P); print(f"{lbl:55s} {m} ARR7 {r['arr7']/1e6:6.1f} cap {r['cap']/1e6:5.1f} eq {r['eq']} MB5 {r['mb5']:.1%} LTV/CAC {r['ltvcac']:.2f} payback {r['payback']:.1f} m50 {r['m50']}")
for m in "AB":
    show("base equipe", m, params(2))
    show("+ mídia proporcional na expansão (erro 1)", m, params(2, fix_exp_midia=True))
    show("+ LTV com alíquota cheia (erro 2)", m, params(2, fix_ltv_imp=True))
    P=params(2); show("+ custo do mês grátis por indicação (erro 3)", m, params(2, ref_custo=refc(P,m)))
    show("+ custo de implantação (erro 4)", m, params(2, impl_custo={"A":150,"B":800}))
    show("só sem dentistas", m, params(2, exp_mes=999))
    show("expansão corrigida e sem dentistas", m, params(2, exp_mes=999, fix_exp_midia=True))
# moderado
def modB():
    P = params(2, fix_exp_midia=True, fix_ltv_imp=True, impl_custo={"A":150,"B":800})
    P.update({"B_P_churn":.05,"B_G_churn":.04,"B_K_churn":.025,"B_P_esp":55,"B_G_esp":30,"B_K_esp":12,"B_custo_esp":12000,
      "B_P_custo":150,"B_G_custo":250,"B_K_custo":550,"B_P_preco":940,"B_G_preco":1700,"B_K_preco":4275,"B_G_consultas":6,"B_K_consultas":25,
      "setup_haircut":.75,"B_cac":7500,"imp_baixo":.13,"imp_alto":.18,"meios_pg":.04,"indic":.0075,"parc_mult":.8,"exp_mes":31,"exp_fator":.5})
    P["ref_custo"]=refc(P,"B"); return P
def modA():
    P = params(2, fix_exp_midia=True, fix_ltv_imp=True, impl_custo={"A":150,"B":800})
    P.update({"A_E_churn":.075,"A_C_churn":.06,"A_T_churn":.04,"A_K_churn":.03,"A_T_esp":35,"A_K_esp":17,"A_custo_esp":10000,
      "A_E_preco":282,"A_C_preco":662,"A_T_preco":1422,"A_K_preco":3705,"setup_haircut":.75,"A_cac":5500,"imp_baixo":.13,"imp_alto":.18,"meios_pg":.04,
      "indic":.0075,"parc_mult":.8,"exp_mes":31,"exp_fator":.5})
    P["ref_custo"]=refc(P,"A"); return P
print()
for m,f in (("A",modA),("B",modB)):
    r=summary(m,f()); print("MODERADO",m,{k:(round(v,3) if isinstance(v,float) else v) for k,v in r.items()})
