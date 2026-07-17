---
target: homepage
total_score: 29
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T13-30-41Z
slug: src-app-page-tsx
---
# Critique: Homepage (src/app/page.tsx)

⚠️ DEGRADED: single-context (sub-agentes atingiram limite de sessão; A e B inline)

## Design Health Score
| # | Heurística | Score | Issue-chave |
|---|-----------|-------|-----------|
| 1 | Visibilidade de status | 3 | Sem aria-live no resultado |
| 2 | Sistema ↔ mundo real | 4 | Linguagem simples, tooltips |
| 3 | Controle e liberdade | 3 | Nova Simulação + histórico |
| 4 | Consistência | 3 | Light mode via !important frágil |
| 5 | Prevenção de erro | 2 | Dependentes IR vazio → NaN nas deduções |
| 6 | Reconhecimento > memória | 4 | Tudo visível e rotulado |
| 7 | Flexibilidade/eficiência | 2 | Sem atalhos; simulador compensa |
| 8 | Estética minimalista | 3 | Resultado denso |
| 9 | Recuperação de erro | 2 | alert() nativo nos exports |
| 10 | Ajuda e documentação | 3 | Tooltip sem foco de teclado |
| Total | | 29/40 | Good |

## Anti-Patterns
LLM: identidade própria (grid contador, semáforo de verbas, base legal). Tells: gradient text no h1 (exceção única documentada) e Inter/Jakarta (saturadas, identidade shipada).
Detector 13: 2 gradient-text (globals 217/225), 1 overused-font, 8 design-system-color (drift documental light mode), 1 font-size 3.4rem (falso positivo — clamp documentado), 1 border-accent Button.tsx:47 (falso positivo — spinner).
Browser overlay: não rodou (limite de sessão).

## Priority Issues
1. [P1] Dependentes IR vazio → NaN (valueAsNumber sem fallback) contamina INSS/IRRF/líquido. Fix: fallback 0 + validação. → harden
2. [P1] alert() nativo nos exports; feedback inline no botão. → harden
3. [P2] Resultado enterra o Total Líquido; bloco líder no topo. → layout
4. [P2] Sem prefers-reduced-motion e sem aria-live. → harden
5. [P3] Tooltip sem onFocus/onBlur/Escape. → harden

## Personas
Casey: rolagem longa até o líquido pós-cálculo. Jordan: FGTS pré-marcado sem saber o que é. Sam: tooltips fora do Tab, resultado silencioso.

## Menores
Nome 100+ chars estoura título/PDF; histórico já protegido; !important light mode exige disciplina.

## Perguntas
1. Resultado abrindo com o líquido gigante? 2. O que faria um advogado citar a calculadora? 3. Simulador escondido atrás de clique.
