---
target: homepage
total_score: 33
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T19-51-30Z
slug: src-app-page-tsx
---
# Critique v5: Homepage — dual-agent (A: code review · B: detector + overlay home+resultado)

Score: 33/40 (trend 29→27→32→30→33). Contrastes anteriores confirmados AA; B achou 3 restantes no LeadGenCard+simulador (corrigidos nesta rodada).

## Heurísticas (A)
1 Visibilidade 4 | 2 Mundo real 4 | 3 Controle 3 | 4 Consistência 3 | 5 Prevenção 3 | 6 Reconhecimento 4 | 7 Flexibilidade 3 | 8 Minimalismo 2 | 9 Recuperação 3 | 10 Ajuda 4 = 33/40

## Contraste (B mediu, agora corrigido)
- LeadGenCard botão "Falar com Advogado" branco/emerald 2.54:1 → texto escuro
- LeadGenCard disclaimer gray-400 3.8:1 → gray-300
- Simulador subtítulo gray-400 3.83:1 → gray-300
- Traços "—" e X do simulador gray-600 (~1.9:1) → gray-400; X seguro gray-500 → gray-400
Home: zero contraste real abaixo de 4.5:1 (só artefato de background-clip:text).

## Backlog de PRODUTO (não bug — decisão do usuário)
- P1 blog datado "Jan 2025" sob claim "mais atualizada" — risco credibilidade RH
- P1 hero repete prova INSS/IRRF/tabelas 3-4×; mobile: copy antes do form (form-first ajudaria persona ansioso)
- P2 peak-end: AdSense+LeadGen fecham a jornada no clímax (roça anti-referência AdSense)
- P2 erro de cálculo some o resultado (beco sem saída) — manter form visível
- P3 Sparkles decorativo; FOUC de tema no light (aplica só client-side)

## Falsos positivos (B)
gradient h1 (background-clip artefato); border-accent Button = spinner; overused-font Inter = identidade; 4 design-system-color = overrides light; gray-on-color SimuladorCenarios:101 = badge gray-900/emerald 8.9:1 (direção invertida da regra).

## Fortes
Card resultado (número-herói); disciplina de a11y (overrides light minuciosos, aria-live, reduced-motion, scope/caption); substância protetora (alertas contextuais, prazo graduado, base legal por verba).
