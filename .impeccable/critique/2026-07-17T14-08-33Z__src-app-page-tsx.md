---
target: homepage
total_score: 27
p0_count: 2
p1_count: 3
timestamp: 2026-07-17T14-08-33Z
slug: src-app-page-tsx
---
# Critique v2: Homepage — dual-agent (A: design review · B: detector + overlay vivo)

Score: 27/40 (v1 degradada: 29). Olhar mais fundo, problemas estruturais.

## Priority Issues
1. [P0] Form perde dados pós-cálculo (page.tsx:136-141 monta CalculatorForm sem initialData). Fix: defaultValues + reset + currencyDisplays.
2. [P0] Erro de cálculo silencioso (page.tsx:36-40 catch→console.error). Fix: estado de erro amigável.
3. [P1] Banners prazo-vencido (vermelho) × projeção (verde) contraditórios no pico; tom de multa induz pânico em simulação de caso antigo. Fix: reconciliar copy, rebaixar pra informativo, citar de onde conta o prazo.
4. [P1] Light mode: fundos tingidos (emerald/red/yellow/blue-900/20) sem override; herói vira cinza lamacento no claro. Fix: overrides html.light pros tints.
5. [P1] Contraste: botão Calcular 2.3:1 (branco/esmeralda), footer 3.7:1, disclaimer gray-on-amber. Fura WCAG AA do PRODUCT.md. Fix: primary-600 no botão ou texto escuro; footer gray-400; textos âmbar no disclaimer.
6. [P2] LeadGen + 2 AdSense contíguos no resultado = anti-referência do PRODUCT.md. Fix: 1 slot por viewport, mover resultadoMeio pra depois dos exports.
7. [P2] a11y: 5 collapsibles sem aria-expanded; 11 tooltips mesmo aria-label; tabela simulador sem scope; ✓/✗ sem texto.
8. [P3] Slop: stat-strip 10+/100% com side-stripe (viola DESIGN.md), tiles gradiente, pulse dot, cyan fora do semáforo; blog "Jan 2025" sob claim 2026; delay 600ms artificial; "Inicio" sem acento; h1 gradient duplicado na tela de resultado.

## Personas
Jordan: default "sem justa causa" infla expectativa de quem pediu demissão; banners contraditórios ininteligíveis. Casey: redigitar 10 campos no polegar; botão Calcular de form vazio aparece antes do resultado. Sam: collapsibles mudos, tooltips indistintos; aria-live ok.

## Detector (B)
CLI 14 (7 design-system-color drift emerald ramp, 2 gradient-text h1, 2 font-size fora da ramp, 1 overused-font, 1 spinner falso positivo). Overlay vivo: 20 hits — low-contrast botão 2.3:1 e footer 3.7:1, gray-on-color disclaimer ×3, line-length footer 174ch, dark-glow form (assinatura documentada). Falsos positivos: glow laranja do body (extensão), nested-cards do form, strong duplicados.

## Fortes
Prova técnica como identidade (base legal inline); simulador auto-expandido; form protetor (alertas no ponto de escolha).
