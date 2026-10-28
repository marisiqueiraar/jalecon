"""Réplica em Python do build_model_v2.py (mesma lógica, para buscas rápidas), com correções opcionais.
Correções (flags em P, todas desligadas por padrão = réplica fiel):
  fix_exp_midia: a expansão para dentistas exige mídia proporcional (no original, o fator 1,7 multiplica os clientes de mídia sem gastar mais).
  fix_ltv_imp:   LTV usa a alíquota de regime cheio (imp_alto), não a do Simples.
  ref_custo:     custo do 'mês grátis' por indicação (R$ por cliente indicado).
  impl_custo:    custo humano de implantação por cliente novo (R$), no custo do serviço.
  setup_haircut: fração da taxa de implantação efetivamente cobrada (1 = toda).
"""
import math
SCEN = {}  # key -> (cons, base, opt)
def s(k, c, b, o): SCEN[k] = (c, b, o)
s("lancamento",5,4,4); s("imp_baixo",.11,.11,.11); s("imp_alto",.163,.163,.163); s("meios_pg",.03,.03,.03)
s("sam_med",115000,150000,230000); s("exp_mes",37,25,25); s("exp_fator",.4,.7,1.0); s("sam_dent",120000,180000,225000)
s("exp_custo",400000,300000,200000); s("indic",.005,.01,.015); s("parc_mult",.6,1.0,1.3)
s("custo_prod",20000,18000,16000); s("custo_vendas",11000,10000,9000); s("custo_ga",13000,12000,11000); s("fundadores",6,6,6)
s("outras_fixo",20000,15000,12000); s("outras_pct",.04,.03,.025); s("marca_pct",.08,.05,.05)
YEARLY = {"midia":[20000,50000,100000,160000,220000,280000,340000],"parc":[4,10,18,26,34,42,50],"hc_prod":[4,7,10,13,16,18,20],
"hc_ga":[1,2,4,6,8,9,10],"prolabore":[5000,10000,15000,15000,18000,18000,20000],"hc_vendas_A":[2,4,7,10,13,15,17],"hc_vendas_B":[3,6,10,15,20,24,28]}
PLANS = {"A":[("E",297,0,(.40,.40,.35),(.09,.07,.055),(32,25,20),None,None),("C",697,490,(.45,.45,.45),(.07,.055,.04),(65,50,40),None,None),
 ("T",1497,990,(.12,.12,.15),(.045,.035,.025),(130,100,80),(30,40,50),None),("K",3900,2900,(.03,.03,.05),(.035,.025,.02),(325,250,200),(15,20,25),None)],
 "B":[("P",990,990,(.55,.55,.50),(.045,.035,.025),(155,120,95),(55,70,90),None),("G",1790,1490,(.40,.40,.42),(.04,.03,.02),(285,220,175),(30,40,50),(6,10,15)),
 ("K",4500,3900,(.05,.05,.08),(.03,.022,.015),(650,500,400),(12,15,20),(20,35,50))]}
s("A_cac",6000,4500,3000); s("A_comissao",1800,1500,1200); s("A_custo_esp",9500,9000,8500)
s("B_cac",7500,5500,4000); s("B_comissao",2500,2000,1600); s("B_custo_esp",11000,10000,9000); s("B_valor_consulta",30,30,30)
for m, pl in PLANS.items():
    for k, price, setup, mix, churn, custo, esp, var in pl:
        s(f"{m}_{k}_preco",price,price,price); s(f"{m}_{k}_setup",setup,setup,setup); s(f"{m}_{k}_mix",*mix); s(f"{m}_{k}_churn",*churn); s(f"{m}_{k}_custo",*custo)
        if esp: s(f"{m}_{k}_esp",*esp)
        if var: s(f"{m}_{k}_consultas",*var)

def params(cenario=2, **ov):
    P = {k: v[cenario-1] for k, v in SCEN.items()}
    P.update({k: list(v) for k, v in YEARLY.items()})
    P.update(dict(fix_exp_midia=False, fix_ltv_imp=False, ref_custo=0, impl_custo={"A":0,"B":0}, setup_haircut=1.0))
    P.update(ov); return P

def run(m, P, N=84):
    pl = PLANS[m]; keys = [p[0] for p in pl]; main = keys[1]
    act = {k: 0.0 for k in keys}; tot_prev = 0.0; recs = []; cash = 0.0
    out = {k: [] for k in ("rec","rec_liq","lb","ebitda","caixa","arr","arr_fixa","tot","pen","novos","n_midia","n_parc","n_ind","esp_n","rec_var","rec_setup","mrr")}
    for mes in range(1, N+1):
        ano = math.ceil(mes/12); y = ano-1; ativo = 1 if mes >= P["lancamento"] else 0
        exp = 1 + P["exp_fator"] if mes >= P["exp_mes"] else 1
        midia_base = P["midia"][y]*ativo
        midia = midia_base*(exp if P["fix_exp_midia"] else 1)
        n_midia = midia_base/P[f"{m}_cac"]*exp
        n_parc = P["parc"][y]*P["parc_mult"]*ativo*exp
        n_ind = tot_prev*P["indic"]*ativo if mes > 1 else 0
        n_tot = n_midia+n_parc+n_ind
        novos = {}
        for k in keys:
            mix = P[f"{m}_{k}_mix"]
            if k == "K": mx = mix if mes >= 13 else 0
            elif k == main: mx = mix + (P[f"{m}_K_mix"] if mes < 13 else 0)
            else: mx = mix
            novos[k] = n_tot*mx
        for k in keys:
            act[k] = act[k] + novos[k] - act[k]*P[f"{m}_{k}_churn"]
        tot = sum(act.values())
        rec_fixa = sum(act[k]*P[f"{m}_{k}_preco"] for k in keys)
        rec_setup = sum(novos[k]*P[f"{m}_{k}_setup"] for k in keys)*P["setup_haircut"]
        rec_var = sum(act[p[0]]*P[f"{m}_{p[0]}_consultas"] for p in pl if p[7])*P["B_valor_consulta"]
        rec = rec_fixa+rec_setup+rec_var
        trailing = sum(recs[max(0, mes-13):mes-1])  # meses m-12..m-1
        imp = rec*(P["imp_alto"] if trailing > 4800000 else P["imp_baixo"])
        rec_liq = rec - imp - rec*P["meios_pg"]
        recs.append(rec)
        cogs_dir = sum(act[k]*P[f"{m}_{k}_custo"] for k in keys) + n_tot*P["impl_custo"][m]
        esp_n = sum(act[p[0]]/P[f"{m}_{p[0]}_esp"] for p in pl if p[6])
        lb = rec_liq - cogs_dir - esp_n*P[f"{m}_custo_esp"]
        opex = (P["hc_prod"][y]*P["custo_prod"] + P[f"hc_vendas_{m}"][y]*P["custo_vendas"] + P["hc_ga"][y]*P["custo_ga"] + P["prolabore"][y]*P["fundadores"]
                + midia + n_parc*P[f"{m}_comissao"] + midia*P["marca_pct"] + P["outras_fixo"] + rec*P["outras_pct"] + (P["exp_custo"] if mes == P["exp_mes"] else 0)
                + n_ind*P["ref_custo"])
        ebitda = lb - opex; cash += ebitda
        sam = P["sam_med"] + (P["sam_dent"] if mes >= P["exp_mes"] else 0)
        for k, v in (("rec",rec),("rec_liq",rec_liq),("lb",lb),("ebitda",ebitda),("caixa",cash),("arr",12*(rec_fixa+rec_var)),("arr_fixa",12*rec_fixa),
                     ("tot",tot),("pen",tot/sam),("novos",n_tot),("n_midia",n_midia),("n_parc",n_parc),("n_ind",n_ind),("esp_n",esp_n),("rec_var",rec_var),("rec_setup",rec_setup),("mrr",rec_fixa+rec_var)):
            out[k].append(v)
        tot_prev = tot
    return out

def unit(m, P, k=None):
    k = k or ("C" if m == "A" else "G")
    pl = {p[0]: p for p in PLANS[m]}[k]
    rev = P[f"{m}_{k}_preco"] + (P[f"{m}_{k}_consultas"]*P["B_valor_consulta"] if pl[7] else 0)
    imp = P["imp_alto"] if P["fix_ltv_imp"] else P["imp_baixo"]
    c = rev*(1-imp-P["meios_pg"]) - P[f"{m}_{k}_custo"] - (P[f"{m}_custo_esp"]/P[f"{m}_{k}_esp"] if pl[6] else 0)
    cac = P[f"{m}_cac"]
    # LTV com custo de implantação líquido da taxa cobrada (só nas correções)
    impl = P["impl_custo"][m] - P[f"{m}_{k}_setup"]*P["setup_haircut"] if P["fix_ltv_imp"] else 0
    ltv = c/P[f"{m}_{k}_churn"] - impl
    return dict(rev=rev, contrib=c, ltv=ltv, ltvcac=ltv/cac, payback=cac/c if c > 0 else float("inf"))

def summary(m, P, crit_arr=50e6):
    o = run(m, P)
    eb = o["ebitda"]; eq = None
    for i in range(84):
        if all(e >= 0 for e in eb[i:]): eq = i+1; break
    m50 = next((i+1 for i in range(84) if o["arr"][i] >= crit_arr and (i == 0 or o["arr"][i-1] < crit_arr)), None)
    m50f = next((i+1 for i in range(84) if o["arr_fixa"][i] >= crit_arr), None)
    y5 = slice(48, 60)
    u = unit(m, P)
    return dict(arr5=o["arr"][59], arr7=o["arr"][83], arr7_fixa=o["arr_fixa"][83], eq=eq, cap=-min(0, min(o["caixa"])), mb5=sum(o["lb"][y5])/sum(o["rec_liq"][y5]),
                ltvcac=u["ltvcac"], payback=u["payback"], m50=m50, pen50=(o["pen"][m50-1] if m50 else None), m50_fixa=m50f, cli5=o["tot"][59], cli7=o["tot"][83])
if __name__ == "__main__":
    for c in (1,2,3):
        P = params(c)
        for m in "AB": print(c, m, {k:(round(v,3) if isinstance(v,float) else v) for k,v in summary(m,P).items()})
