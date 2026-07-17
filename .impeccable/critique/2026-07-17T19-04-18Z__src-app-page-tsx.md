---
target: homepage
total_score: 30
p0_count: 0
p1_count: 1
timestamp: 2026-07-17T19-04-18Z
slug: src-app-page-tsx
---
# Critique v4: Homepage — dual-agent (A: design review · B: detector + overlay home+resultado)

Score: 30/40 (trend 29→27→32→30). O 32 foi inline sem overlay; v4 mediu contraste real no navegador.

## Heurísticas (A)
1 Visibilidade 3 | 2 Mundo real 4 | 3 Controle 3 | 4 Consistência 3 | 5 Prevenção 3 | 6 Reconhecimento 3 | 7 Flexibilidade 3 | 8 Minimalismo 2 | 9 Recuperação 3 | 10 Ajuda 3 = 30/40

## Achado novo acionável: contraste AA na tela de resultado (B mediu)
- text-gray-400 sobre emerald-900/20 (subtexto herói, cards seguro) ×6 = 3.8:1 (precisa 4.5)
- rodapé simulador text-gray-500 = 3.0:1
- badge "Melhor" branco sobre esmeralda mobile = 2.5:1
- "(opcional)" no form text-gray-500 ~3.4:1
Fura WCAG AA do PRODUCT.md. A também apontou (P1).

## Melhorou desde v2/v3
Slop baixo (gradient só h1, lucide, Como Funciona = 1 painel consolidado). Form preserva estado; erro visível; banners reordenados; a11y simulador (scope/caption). Card resultado elogiado (número-herói). Copy protetora (prazo graduado).

## Backlog não-crítico (A)
- Blog datado "Jan 2025" sob claim "mais atualizada" — risco credibilidade persona RH
- Hero repete "sem cadastro" (subtítulo+chip) e simulador (bullet+seção)
- Peak-end diluído: AdSense fecha jornada; ideal seria checklist/próximo passo
- Drift token: saldo text-green-400 vs #22c55e do semáforo
- Siglas INSS/IRRF/1/3 sem tooltip inline no resultado (persona Casey)

## Falsos positivos (B)
border-accent Button.tsx:48 = spinner; overused-font Inter = identidade; 4 design-system-color = overrides light.

## Fortes
Card resultado (hierarquia número-herói); copy protetora (prazo graduado, avisos no ponto de escolha); simulador auto-executado com a11y.
