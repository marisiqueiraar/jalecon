# Jalecon

Marketing médico com ética de consultório. Projeto do Grupo 1 da disciplina Digital Innovation Strategy (Insper, 2026).

Plataforma que cria e gerencia a presença digital de médicos com IA: diagnóstico inteligente, marca, site, conteúdo e campanhas, revisão conversacional pelo médico e checagem de conformidade com as regras do CFM (Guardião), com resultado medido em consultas agendadas.

## Conteúdo do repositório

| Pasta | O que tem |
|---|---|
| `site/` | Site publicado na Vercel: demo navegável (`/`), manual da marca (`/marca`) e arquivos para download (`/arquivos`) |
| `01_estrategia/` | Estratégia, posicionamento e estudo de nomes |
| `02_identidade/` | Logos (SVG e PNG), manual da marca, skill de diretrizes de marca para o Claude Design |
| `03_plano/` | Plano de negócios e modelo financeiro (`Jalecon_Modelo_Financeiro.xlsx` e o script que o gera) |
| `05_demo/` | Código-fonte da demo |
| `06_validacao/` | Kit de validação com médicos (roteiro, questionário, planilha de síntese) |

## Rodar a demo localmente

Abra `site/index.html` no navegador. Não há etapa de build. Todos os dados da demo são fictícios.

## Regerar o modelo financeiro

```bash
pip install openpyxl
python 03_plano/build_model.py
```

As premissas editáveis estão na aba `Premissas` da planilha (texto azul).
