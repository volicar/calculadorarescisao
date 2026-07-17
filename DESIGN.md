---
name: Rescisão Online
description: Calculadora de rescisão trabalhista — precisa, gratuita e protetora
colors:
  primary: "#22c55e"
  primary-hover: "#16a34a"
  primary-active: "#15803d"
  primary-soft: "#4ade80"
  ink-dark-bg: "#111827"
  surface-dark: "#1f2937"
  border-dark: "#374151"
  text-on-dark: "#ffffff"
  text-muted-dark: "#d1d5db"
  text-faint-dark: "#9ca3af"
  bg-light: "#f9fafb"
  surface-light: "#f3f4f6"
  border-light: "#d1d5db"
  ink-light: "#111827"
  alert-warning: "#facc15"
  alert-danger: "#f87171"
  info-blue: "#60a5fa"
  verba-fgts: "#c084fc"
  verba-aviso: "#fb923c"
  gradient-emerald-mid: "#10b981"
  gradient-teal: "#2dd4bf"
  gradient-emerald-light: "#059669"
  gradient-teal-light: "#0d9488"
  primary-on-light: "#047857"
  primary-on-light-deep: "#065f46"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  display-number:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1.15
  headline:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.05em"
rounded:
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-on-dark}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted-dark}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.md}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-on-dark}"
    rounded: "{rounded.md}"
    padding: "12px 12px"
---

# Design System: Rescisão Online

## 1. Overview

**Creative North Star: "A Folha Aberta"**

O sistema visual encena uma folha de rescisão aberta sobre a mesa — todo número visível, toda regra citada, nada escondido do trabalhador. O tema escuro é o padrão: o usuário chega ansioso, muitas vezes à noite, no celular; o fundo grafite (#111827) com o grid quadriculado sutil evoca papel milimetrado de contador, e o verde esmeralda aparece como a caneta que destaca o que importa: o dinheiro dele. É um sistema de ferramenta com voz de aliado: sério, claro, protetor — nunca frio como um órgão público, nunca barulhento como portal de anúncios.

O sistema rejeita explicitamente (de PRODUCT.md): o portal de calculadora entupido de AdSense, o site jurídico engessado e o template de SaaS genérico. A densidade é média: formulário respirado em seções, resultado em lista rubrica-a-rubrica como um TRCT legível.

**Key Characteristics:**
- Dark-first com light mode completo (overrides `html.light` em globals.css)
- Grid quadriculado fixo (`.grid-canvas`) como assinatura de "papel de contador" em todas as páginas
- Verde esmeralda = dinheiro/ação; cores semânticas fixas por tipo de verba
- Base legal citada ao lado de cada número (lei, súmula, portaria)
- Mobile-first: inputs ≥16px, alvos ≥44px, fluxo completo com uma mão

## 2. Colors

Paleta comprometida: o esmeralda carrega ação e dinheiro; os grafites carregam o palco; as cores semânticas nunca trocam de papel.

### Primary
- **Verde Esmeralda** (#22c55e): botões de ação, valores positivos, badges de confiança, foco de inputs. É a cor do "quanto você recebe". Hover #16a34a, active #15803d. No dark, textos de destaque usam o tom claro #4ade80; no light, escurecem para #15803d (override obrigatório).

### Neutral
- **Grafite Profundo** (#111827): fundo do site no dark; texto principal no light.
- **Grafite Superfície** (#1f2937): cards, inputs, painéis no dark. No light vira #f3f4f6.
- **Grafite Borda** (#374151): bordas e divisores no dark; #d1d5db no light.
- **Branco/Cinzas de texto** (#ffffff, #d1d5db, #9ca3af): título, corpo, apoio no dark. Todos têm override de contraste no light.

### Tertiary (semânticas de verba e alerta)
- **Amarelo Alerta** (#facc15): avisos (estabilidade, salário abaixo do mínimo, pedido de demissão). No light escurece p/ #a16207.
- **Vermelho Perigo** (#f87171): justa causa, prazo vencido. Light: #b91c1c.
- **Azul Info** (#60a5fa): notas informativas, férias proporcionais. Light: #1d4ed8.
- **Roxo FGTS** (#c084fc) e **Laranja Aviso Prévio** (#fb923c): cores fixas dessas rubricas no resultado. Light: #7e22ce / #c2410c.

### Named Rules
**A Regra do Semáforo de Verbas.** Cada rubrica do resultado tem cor fixa e imutável: verde = salário, azul = férias, amarelo = 13º, roxo = FGTS, laranja = aviso. O usuário aprende a paleta uma vez e lê qualquer tela.
**A Regra do Override Claro.** Nenhuma cor clara (–300/–400 do Tailwind) toca o light mode sem override `html.light` correspondente em globals.css. Contraste mínimo 4.5:1 no corpo.

## 3. Typography

**Display Font:** Plus Jakarta Sans (fallback Inter, sans-serif)
**Body Font:** Inter (fallback system sans)

**Character:** dupla geométrica-humanista sóbria: Jakarta dá peso e personalidade aos títulos sem parecer escritório de advocacia; Inter mantém formulário e números neutros e legíveis.

### Hierarchy
- **Display** (700, clamp(2.25rem→3.4rem), lh 1.1, ls -0.02em): só o h1 do hero.
- **Headline** (700, 1.875–2.25rem, lh 1.2): títulos de seção ("Como Funciona?").
- **Title** (600, 1.125rem, lh 1.4): títulos de card e do resultado.
- **Body** (400, 1rem, lh 1.625): parágrafos, máx ~65ch.
- **Label** (600, 0.75rem, tracking-wider, UPPERCASE): cabeçalhos de seção do formulário e do resultado ("CONTRATO", "VERBAS RESCISÓRIAS").

### Named Rules
**A Regra do Número Herói.** Valores monetários no resultado são sempre mais pesados (font-medium+) que seus rótulos; o Total Bruto/Líquido é o maior texto do card.

## 4. Elevation

Sistema quase plano com camadas tonais: profundidade vem da escala de grafites (#111827 → #1f2937 → rgba de gray-800/50), não de sombras. Exceções deliberadas: o card do formulário no hero carrega o `form-glow` (anel esmeralda 1px + sombra verde difusa 24px/64px) como assinatura única da página; cards com `.card-lift` sobem 4px no hover com sombra esmeralda suave.

### Shadow Vocabulary
- **form-glow** (`0 0 0 1px rgba(34,197,94,0.15), 0 24px 64px -24px rgba(34,197,94,0.25)`): exclusivo do card do formulário no hero.
- **card-lift hover** (`0 12px 32px -12px rgba(34,197,94,0.25)` + translateY(-4px)): cards clicáveis (blog, como funciona).

### Named Rules
**A Regra do Brilho Único.** O glow esmeralda existe em um lugar por viewport: o formulário no hero. Duplicá-lo dilui a hierarquia.

## 5. Components

### Buttons
- **Shape:** cantos suaves (rounded-lg, 8px)
- **Primary:** esmeralda #22c55e, texto branco, font-medium; padding md 8×16px, lg 12×24px
- **Hover / Focus:** hover escurece um passo (#16a34a); focus ring 2px esmeralda com offset; loading = spinner inline + "Calculando..."
- **Secondary:** cinza #4b5563; **Outline:** borda gray-600, texto gray-300, hover preenche gray-700/50

### Cards / Containers
- **Corner Style:** rounded-lg/xl (8–12px)
- **Background:** #1f2937 sólido; sub-blocos internos usam rgba (gray-800/50, /30, /20)
- **Shadow Strategy:** shadow-lg discreto de base; ver Elevation
- **Border:** 1px gray-700 (ou /50) sempre presente
- **Internal Padding:** 16px mobile, 24px desktop

### Inputs / Fields
- **Style:** fundo #1f2937, borda gray-600, rounded-lg, texto branco, fonte ≥16px (anti-zoom iOS), altura ≥48px em datas no mobile
- **Focus:** ring 2px esmeralda, borda transparente
- **Error:** borda e ring vermelhos + mensagem abaixo; campos monetários usam máscara "R$ 0,00" controlada
- **Tooltips:** ícone `?` ao lado do label em todo campo técnico

### Navigation
- Header sticky com blur (`bg-gray-900/95 backdrop-blur`), logo com disco esmeralda, link ativo sublinhado esmeralda, toggle de tema Sol/Lua, menu hambúrguer no mobile.

### Resultado (componente assinatura)
Lista rubrica-a-rubrica estilo TRCT: rótulo à esquerda, valor colorido à direita (Regra do Semáforo), Total em bloco destacado, deduções colapsáveis com base legal citada, banners de alerta (estabilidade/prazo/projeção do aviso) acima do card.

## 6. Do's and Don'ts

### Do:
- **Do** citar a base legal (lei, súmula, portaria) ao lado de cada número ou regra exibida — "prova antes de promessa".
- **Do** usar ícones lucide-react para todo pictograma de UI; emojis só dentro de conteúdo exportado (mensagem de WhatsApp, TXT).
- **Do** manter o grid `.grid-canvas` e os glows do hero em qualquer página nova — é a assinatura do site.
- **Do** adicionar override `html.light` para qualquer cor -300/-400 nova usada como texto.
- **Do** manter inputs com fonte ≥16px e alvos ≥44px no mobile.

### Don't:
- **Don't** parecer "portal de calculadora entupido de AdSense": nunca anúncio entre campos do formulário ou entre rubricas do resultado (anti-referência de PRODUCT.md).
- **Don't** parecer "site jurídico engessado": nada de juridiquês sem tooltip, paredes de texto ou tom intimidador (anti-referência de PRODUCT.md).
- **Don't** parecer "template de SaaS genérico": sem novos gradientes decorativos; o gradiente de texto existente é restrito ao h1 do hero e não se replica (anti-referência de PRODUCT.md).
- **Don't** usar border-left/right colorida >1px como accent; alertas usam borda completa + fundo tingido.
- **Don't** trocar as cores fixas das rubricas do resultado (Regra do Semáforo).
- **Don't** usar cinza claro sobre fundo tingido; contraste do corpo ≥4.5:1 nos dois temas.
