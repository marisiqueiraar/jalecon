---
name: jalecon-brand
description: Diretrizes de marca da Jalecon (plataforma de marketing médico com IA e conformidade CFM). Use sempre que criar slides, telas, posts, páginas, documentos ou qualquer peça visual ou texto com a marca Jalecon, ou quando pedirem "na identidade da Jalecon". Define logotipos, cores, tipografia, tom de voz, elementos gráficos e regras para as identidades geradas para médicos.
---

# Jalecon: diretrizes de marca (v1.1)

Jalecon é uma plataforma que cria e gerencia a presença digital de médicos com IA, com revisão humana conversacional e checagem de conformidade com as regras do CFM. Assinatura: **"Marketing médico com ética de consultório."**

Personalidade: **confiável, moderna, humana**. Arquétipo: o Sábio Cuidador (o colega experiente que orienta com calma).

## Logotipos (pasta `assets/`)

| Arquivo | Quando usar |
|---|---|
| `jalecon-logo-horizontal.svg` | Versão principal, fundos claros |
| `jalecon-logo-horizontal-negativo.svg` | Fundos tinta (#1F2440) ou fotos escuras |
| `jalecon-logo-vertical.svg` / `-negativo.svg` | Capas, materiais quadrados, com assinatura |
| `jalecon-icone.svg` / `jalecon-icone-claro.svg` | App, avatar, favicon (mínimo 16 px) |
| `jalecon-simbolo.svg` | Símbolo solto, uso gráfico grande |
| `jalecon-wordmark.svg` | Só o nome, quando o ícone já aparece por perto |

Regras:
- O símbolo são duas lapelas de jaleco formando um "V" de aprovação: lapela tinta (humano) + lapela damasco (IA). Nunca separar, girar, distorcer ou recolorir.
- Na horizontal, use sempre o ícone (quadrado arredondado) ao lado do nome; o símbolo solto ao lado do nome pode ser lido como a letra "V".
- Área de proteção = altura do "a" de jalecon. Tamanho mínimo horizontal: 96 px.
- Nome no texto: **Jalecon**. No logo, minúsculas. Nunca "JalecON", "JALECON" ou "Jalecon.ia".

## Cores (`tokens.css`, `tokens.json`)

| Token | Hex | Papel |
|---|---|---|
| Tinta | `#1F2440` | Primária: texto, títulos, fundos fortes |
| Tinta 70 | `#4A4F6E` | Texto secundário |
| Jaleco | `#F7F8FA` | Fundo base (branco frio do jaleco) |
| Névoa | `#E9EBF2` | Superfícies de apoio |
| Linha | `#D7DAE5` | Bordas |
| Damasco | `#E8A27C` | Acento humano: formas, destaques, gráficos. **Nunca texto sobre fundo claro (1,9:1).** |
| Argila | `#9C5A36` | Acento em texto, links, avisos de bloqueio (4,8:1 sobre Jaleco) |
| Sálvia / Sálvia escura | `#8FAE9B` / `#3F6B57` | Aprovado, "checado" |
| Âmbar escuro | `#8A6416` | Aviso discreto |
| Noite | `#141728` | Fundo do modo escuro |

Proporção sugerida: 60% Jaleco/branco, 30% Tinta, 10% Damasco + Sálvia.

Cores proibidas como cor de marca: vermelho (sangue/emergência), preto dominante e roxo (luto no Brasil), verde-hospitalar e azul-clínico (genéricos da categoria), amarelo saturado (alerta). Não usar degradês chamativos nem neon.

## Tipografia

- **Fraunces Soft** (Google Fonts, eixo SOFT = 100), pesos 500 e 600: títulos, números de destaque, citações. Use com moderação. Fallback: Georgia. Link: `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,500..600,100&display=swap`
- **Nunito Sans** (Google Fonts), pesos 400, 600, 700: texto, interface, legendas. Humanista, levemente arredondada. Fallback: Arial.
- As duas famílias têm licença aberta (SIL OFL), o que permite embutir nos sites e posts gerados para os médicos. Não use fontes de bancos com licença por instalação (como Envato Elements) em peças que a plataforma distribui.
- Escala: 52 / 35 / 25 / 20 / 16 / 13 px. Títulos com `text-wrap: balance`; texto corrido com até ~66 caracteres por linha.
- Rótulos em caixa-alta: Nunito Sans 600, 13 px, espaçamento 0,12–0,14em, cor Argila (claro) ou Damasco (escuro).

## Elementos gráficos

- **A diagonal do V** (≈67°, ângulo da lapela damasco): único recurso gráfico recorrente. Uma por peça, em cantos ou divisões. Nunca como padrão repetido.
- **Selo "Checado pelo Guardião"**: círculo Sálvia escura com o símbolo + texto "Checado pelo Guardião · CFM 2.336/2023". Só em peças que passaram pela checagem.
- Cantos arredondados de 14 px em cartões; ícone com raio de 24%.
- Sem emoji em materiais institucionais. Ícones de traço simples, 1,5–2 px.
- Fotografia: médicos reais em ambiente de consultório, luz natural, sem poses de "influencer", sem imagens de pacientes identificáveis.

## Tom de voz

Falamos como um colega experiente: claro, responsável, acolhedor.

- Frases curtas, voz ativa, sem jargão de marketing.
- **Nunca prometer resultado** ("garantido", "100%", "lote sua agenda em 7 dias"). Dizer "checado", nunca "garantido".
- Explicar a regra e o motivo quando algo é bloqueado, e sugerir a correção.
- Ser transparente sobre IA: "criado com IA e revisado por você".
- Vocabulário: paciente, consulta, agenda, conteúdo educativo, presença digital. Evitar: lead, viral, hack, bombar, engajamento a qualquer custo.

Exemplos:
- Sim: "Seu calendário de novembro está pronto. 3 posts precisam da sua aprovação."
- Sim: "Este texto promete resultado, o que a Resolução CFM 2.336/2023 não permite. Sugerimos: 'O tratamento pode ajudar a…'"
- Não: "Bora bombar seu Insta!!! Conteúdo viral garantido 🚀"

## Identidades geradas para médicos

A Jalecon não assina as peças dos médicos. Cada médico recebe uma identidade própria a partir da especialidade e da personalidade. Pontos de partida:

| Família | Cores | Tom |
|---|---|---|
| Pediatria "Algodão" | #F2B8A2 #A9C8E8 #F3DE9B #3D4A66 | Suave, acolhedor |
| Psiquiatria "Quietude" | #9DB4A5 #D9D3C7 #3E5A5B #EDEAE4 | Calmo, discreto |
| Ortopedia "Movimento" | #2E3440 #3A7BD5 #E98A4B #EEF1F5 | Energia, precisão |
| Gastroenterologia "Equilíbrio" | #7C8B5A #E6DCC6 #2F3B2E #C99A6B | Natural, didático |
| Cardiologia "Ritmo" | #22304A #D99A9A #F4EFEC #6C8EAD | Sóbrio, confiável |
| Cirurgia geral "Precisão" | #36454F #6C8EAD #F5F6F7 #B8C4CF | Técnico, seguro |

Regras obrigatórias em toda peça de médico (Res. CFM 2.336/2023): nome + CRM/UF + "MÉDICO(A)" + RQE quando citar especialidade; sem promessa de resultado; antes/depois só com texto educativo, indicações e possíveis complicações; nenhuma imagem de paciente sem consentimento; contraste mínimo 4,5:1.

## Checklist rápido antes de entregar

1. Logo correto para o fundo, com área de proteção.
2. Só cores da paleta; damasco nunca como texto sobre claro.
3. Fraunces Soft só em títulos; Nunito Sans no resto.
4. Nenhuma promessa de resultado; tom calmo e claro.
5. Em peças de médico: CRM, "MÉDICO(A)" e RQE presentes.
