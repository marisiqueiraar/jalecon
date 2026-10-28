import json, sys
from run import *
ML = ["Mídia paga no mês","Novos clientes por mídia paga","Novos clientes por parcerias","Novos clientes por indicação","Novos clientes no mês",
"Clientes ativos","Receita de mensalidades","Receita de implantação","Receita por consulta agendada","Receita bruta","Impostos sobre a receita",
"Equipe de vendas e marketing","Comissões de parceria","Marca e eventos","Especialistas humanos nas contas (pessoas)","Custo dos especialistas",
"Custo direto (IA, ferramentas, hospedagem)","EBITDA","Caixa acumulado sem captação","Receita recorrente anualizada (MRR × 12)","Despesas operacionais totais","Lucro bruto","Receita líquida"]
p = build_many({"base": {"cenario": 2}})
R = read(p["base"], ML)
json.dump(R, open("runs/base_diag.json","w"), ensure_ascii=False, default=str)
for m in "AB":
    d = R["_monthly"][m]
    print("== Modelo", m, {k: R[k][m] for k in SHORT})
    for y in range(1,8):
        s = slice((y-1)*12, y*12)
        f = lambda k: sum(d[k][s])
        new = f("Novos clientes no mês"); nm=f("Novos clientes por mídia paga"); np_=f("Novos clientes por parcerias"); ni=f("Novos clientes por indicação")
        acq = f("Mídia paga no mês")+f("Equipe de vendas e marketing")+f("Comissões de parceria")+f("Marca e eventos")
        print(f"ano {y}: novos {new:7.0f} (midia {nm/new:4.0%} parc {np_/new:4.0%} indic {ni/new:4.0%}) | CAC midia efetivo {f('Mídia paga no mês')/max(nm,1e-9):7.0f} | CAC totalmente carregado {acq/new:7.0f} | setup% {f('Receita de implantação')/f('Receita bruta'):4.1%} var% {f('Receita por consulta agendada')/f('Receita bruta'):4.1%} | esp {d['Especialistas humanos nas contas (pessoas)'][y*12-1]:5.1f} | ativos {d['Clientes ativos'][y*12-1]:6.0f} | EBITDA {f('EBITDA')/1e6:6.2f} | caixa {d['Caixa acumulado sem captação'][y*12-1]/1e6:6.2f}")
print(R["_unidade"])
