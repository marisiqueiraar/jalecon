# Jalecon

Marketing médico com ética de consultório. Projeto do Grupo 1 da disciplina Digital Innovation Strategy (Insper, 2026).

Equipe de captação e atendimento para clínicas médicas, operada por agentes de IA e supervisionada por um especialista: marca e conteúdo de cada médico, anúncios, WhatsApp com agenda e painel de consultas, com cada peça checada nas regras do CFM (Guardião) antes de ir ao ar.

**Situação (21/10/2026):** o memorando de investimento conclui que não vale investir na Jalecon como software para o médico de consultório. O pivô para clínicas de 5 a 10 médicos é o caminho em teste, com entrevistas com gestores até 28/10 e decisão em 30/10.

## Links

- Demo para clínicas: https://jalecon.vercel.app (modo entrevista, sem preços: https://jalecon.vercel.app/?entrevista=1)
- Manual da marca: https://jalecon.vercel.app/marca/
- Arquivos (modelos financeiros, logos, diretrizes de marca): https://jalecon.vercel.app/arquivos/
- Contato: falejalecon@gmail.com

## Conteúdo do repositório

| Pasta | O que tem |
|---|---|
| `10_v1/` | Material atual: plano v1, roteiros de entrevista (médicos e gestores), mercado e concorrência, modelos financeiros, contraprova, memorando de investimento, pivô para clínicas, roteiro de apresentação e Ficha 2 |
| `10_v1/financeiro/` | Modelos com fórmulas: v2.1 (software x agência) e Modelo C (clínicas), com os scripts que os geram e as análises de sensibilidade |
| `00_Pendencias_e_Proximos_Passos.html` | Pendências da v1 por frente |
| `02_identidade/` | Logos (SVG e PNG), manual da marca, skill de diretrizes de marca para o Claude Design |
| `site/` | Site publicado na Vercel: demo para clínicas (`/`, em `clinica.js` e `clinica-dados.js`, com o Guardião em `guardiao.js`), manual da marca (`/marca`) e arquivos para download (`/arquivos`) |
| `arquivo_v0/` | Primeira versão (15/10), superada. Guardada só para registro |

## Rodar a demo localmente

Abra `site/index.html` no navegador. Não há etapa de build. Todos os dados da demo são fictícios.

## Regerar os modelos financeiros

```bash
pip install openpyxl
python 10_v1/financeiro/build_model_clinicas.py
python 10_v1/financeiro/build_model_v2.py
```

As premissas editáveis ficam na aba `Premissas` de cada planilha. As versões de trabalho estão no Google Sheets do grupo, na pasta "10 · v1 · Decisão de investimento".
