---
target: homepage
total_score: 32
p0_count: 0
p1_count: 0
timestamp: 2026-07-17T18-42-20Z
slug: src-app-page-tsx
---
# Critique v3: Homepage — inline (sub-agentes sem cota; detector + análise própria)

Score: 32/40 (v1 29, v2 27). Correções P0-P3 do critique v2 aplicadas e verificadas em produção/browser.

## Heurísticas (vs v2)
| # | Heurística | v2 | v3 | Nota |
|---|-----------|----|----|------|
| 1 | Status | 3 | 3 | Estado de erro + aria-live + delay 150ms |
| 2 | Mundo real | 4 | 4 | Base legal, tooltips |
| 3 | Controle | 1 | 3 | Form preserva dados pós-cálculo (P0 corrigido) |
| 4 | Consistência | 3 | 3 | Férias Vencidas azul (semáforo); líquida não duplica mais |
| 5 | Prevenção erro | 3 | 3 | max/min datas, alerta salário mínimo |
| 6 | Reconhecimento | 2 | 3 | Form cheio ao lado do resultado |
| 7 | Flexibilidade | 3 | 3 | Histórico, simulador, 4 exports |
| 8 | Minimalismo | 2 | 3 | AdSense após exports; 1 bloco comercial junto ao resultado |
| 9 | Recuperação erro | 2 | 3 | Falha de cálculo mostra mensagem |
| 10 | Ajuda | 4 | 4 | Tooltips rotulados, memória, checklist |
| Total | | 27 | 32 | Good |

## Corrigido desde v2
P0: form preserva estado; erro visível. P1: banners reordenados+copy protetora; light tints; contraste botão (texto escuro) e footer. P2: AdSense reposicionado; aria-expanded x5; tooltips rotulados x12; tabela simulador acessível. P3: stat-strip sem números fabricados; tiles sólidos; sem pulse; Início; delay 150ms; líquida duplicada removida.

## Restante (backlog, não crítico)
- Detector 9: overused-font (Inter, identidade), 2 gradient-text (h1, exceção documentada), 4 design-system-color (overrides light novos — drift documental), 1 font-size (clamp hero, falso positivo), 1 border-accent (spinner, falso positivo). Slop real ~zero.
- Homepage repete conteúdo em 3 listas (bullets hero, "O que é calculado", "Diferenciais") — consolidável.
- Blog na home com artigos "Jan 2025" sob claim 2026.
- Default "sem justa causa" infla expectativa de quem pediu demissão (persona Jordan).
- Light mode via !important continua frágil por design.

## Fortes
Prova técnica como identidade; simulador auto-expandido; form protetor que preserva estado (agora vira ferramenta de exploração "e se").
