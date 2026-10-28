# MVP ao vivo: roteiro dos 5 minutos

O MVP é o protótipo funcional descrito na Ficha 3. Na banca, mostramos um fluxo só, do diagnóstico ao painel, sem passear por todas as telas.

**Endereço:** https://jalecon.vercel.app/?banca=1

Com `?banca=1`, a lateral vira o roteiro: 5 passos clicáveis na ordem, a frase-guia de cada um, o tempo-alvo, um cronômetro de 5 minutos (laranja aos 4:30, vermelho aos 5:00) e o botão "Preparar a demo".

## Antes de começar (no intervalo das 20h15)

1. Abrir o endereço acima no Chrome do computador que vai ao projetor. Testar a internet da sala.
2. Tela cheia (F11) e zoom em 100%. Conferir se a lateral e o celular aparecem inteiros.
3. Clicar em **Preparar a demo (começa do zero)**. Isso apaga qualquer teste anterior e carrega a clínica de exemplo.
4. Deixar o vídeo de 60 segundos aberto numa segunda aba, como plano B.
5. Combinar quem clica e quem fala. Sugestão: uma pessoa clica e outra narra.

## Os 5 passos

Ao começar, clicar em **Iniciar** no cronômetro.

| Passo | Tempo | O que clicar | O que falar (curto) |
|---|---|---|---|
| 1. Raio-x da clínica | 0:00 a 0:45 | Passo 1. Rolar até "Onde a clínica perde pacientes". | "Este é o diagnóstico da Clínica Movimento, uma clínica de exemplo com 6 médicos. A partir das respostas do gestor, o raio-x calcula quantos contatos ficam sem resposta e quantas consultas a clínica deixa de ganhar. Esses números mudam se o gestor mudar as respostas." |
| 2. Guardião e aprovação | 0:45 a 2:00 | Passo 2. Mostrar os trechos marcados. Clicar em **Aplicar as sugestões do Guardião** e depois em **Aprovar como diretor técnico**. Mostrar o registro. | "Este post do ortopedista promete eliminar a dor de vez e garante resultado. O Guardião encontra três violações das regras do CFM, explica cada uma com a norma e sugere a troca. Com um clique, a peça fica liberada. Só o diretor técnico aprova, e cada decisão fica registrada com data, hora e as regras checadas: é a proteção dele no CRM." |
| 3. A banca testa o Guardião | 2:00 a 3:00 | Passo 3. Apagar o texto e digitar uma frase que alguém da banca ditar. | "Para mostrar que não é um texto pronto: alguém da banca nos dita uma frase de anúncio?" Se ninguém sugerir: "Sou a melhor dermatologista de São Paulo, resultado garantido e sem dor." O resultado aparece enquanto se digita. |
| 4. WhatsApp que agenda | 3:00 a 4:00 | Passo 4. Clicar nas mensagens do paciente até escolher um horário. Mostrar o resumo para a recepção. | "São 22h47. Hoje, esse paciente ficaria sem resposta até o dia seguinte. O agente responde, segue as regras do CFM (não promete resultado, não pede exames) e marca direto na agenda do médico." |
| 5. Painel | 4:00 a 5:00 | Passo 5. Mostrar o cartão "Hoje, nesta demonstração", depois os blocos "Por canal" e "Por médico". | "No painel, o gestor vê o que acabamos de fazer: a peça aprovada e o paciente agendado fora do horário. E vê o que nenhuma agência mostra hoje: contatos e consultas por canal e por médico. Essa é a métrica-chave do piloto." |

## O que é real e o que é simulado (para a arguição)

- **Roda de verdade no navegador:** o cálculo do raio-x, o Guardião (as regras do CFM, a marcação dos trechos e as sugestões), a aprovação com registro, a conversa do WhatsApp gravando na agenda e o cartão "ao vivo" do painel.
- **Simulado:** os números do "mês 3 do piloto" no painel (calculados a partir do diagnóstico, não medidos), os dados da clínica e dos médicos (fictícios) e o WhatsApp, que neste protótipo segue um roteiro em vez de usar IA.
- **Se perguntarem "o WhatsApp é IA?":** "Neste protótipo, a conversa é roteirizada, para a demo ser previsível. No piloto, é um agente de IA com as mesmas regras do Guardião e supervisão humana, ligado ao WhatsApp Business da clínica."
- **Se perguntarem "e se o Guardião errar?":** "Ele não decide sozinho: quem aprova é o diretor técnico. As regras estão sendo validadas por um advogado de direito médico, e o protótipo avisa quais ainda estão em validação."

## Plano B: vídeo de 60 segundos

Gravar a tela seguindo o mesmo fluxo, mais rápido (Windows: Win + Alt + R pela Xbox Game Bar; Mac: Cmd + Shift + 5). Sem áudio, porque a fala é ao vivo.

| Tempo | Tela |
|---|---|
| 0 a 8 s | Raio-x: o título "contatos ficam sem resposta" e o funil |
| 8 a 25 s | Post "Dor no joelho": trechos marcados → Aplicar as sugestões → Aprovar → registro |
| 25 a 35 s | Teste do Guardião: digitar "resultado garantido" e ver o bloqueio aparecer |
| 35 a 50 s | WhatsApp: conversa até escolher o horário e o resumo para a recepção |
| 50 a 60 s | Painel: o cartão "Hoje, nesta demonstração" e o bloco "Por canal" |

Antes de gravar, clicar em "Preparar a demo". Salvar o arquivo no computador da apresentação e no Drive (pasta "10 · Entregas da disciplina").
