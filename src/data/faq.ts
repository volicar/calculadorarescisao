// Perguntas frequentes — fonte única para a seção visual da home e para o FAQPage schema.
export interface FaqItem {
  pergunta: string;
  resposta: string;
}

export const faqItems: FaqItem[] = [
  {
    pergunta: 'A calculadora é gratuita? Preciso me cadastrar?',
    resposta:
      'Sim, é 100% gratuita e não exige cadastro nem login. Você informa os dados do contrato e recebe o cálculo na hora. Nenhum dado é enviado para servidores — todo o cálculo acontece no seu navegador.',
  },
  {
    pergunta: 'Os valores são exatos?',
    resposta:
      'São uma estimativa próxima do real, calculada com as tabelas oficiais de INSS e IRRF de 2026 e a legislação vigente. Os valores finais constam na folha de rescisão emitida pelo empregador (TRCT). Para casos com adicional de insalubridade, acordos coletivos ou situações específicas, consulte um advogado trabalhista.',
  },
  {
    pergunta: 'Como fica o Imposto de Renda na rescisão em 2026?',
    resposta:
      'A Lei 15.270/2025 isenta de Imposto de Renda quem tem rendimento tributável de até R$ 5.000 por mês, com redução gradual até R$ 7.350. Na prática, a maioria das rescisões passou a não ter desconto de IRRF sobre o saldo de salário e o 13º em 2026. A calculadora já aplica essa regra automaticamente.',
  },
  {
    pergunta: 'Tenho direito a aviso prévio? Como funciona a projeção?',
    resposta:
      'Na dispensa sem justa causa você tem direito a 30 dias de aviso prévio, mais 3 dias por ano trabalhado, até o limite de 90 dias (Lei 12.506/2011). Quando o aviso é indenizado, esse período projeta a data de término do contrato para frente, aumentando férias e 13º proporcionais (OJ 82 da SDI-1 do TST). A calculadora faz essa projeção sozinha.',
  },
  {
    pergunta: 'Quem pede demissão tem direito a quê?',
    resposta:
      'No pedido de demissão você recebe saldo de salário, férias vencidas e proporcionais + 1/3 e 13º proporcional. Perde a multa de 40% do FGTS, não pode sacar o FGTS e não tem direito ao seguro-desemprego. Também deve cumprir ou indenizar o aviso prévio ao empregador.',
  },
  {
    pergunta: 'Qual a diferença entre demissão sem justa causa e comum acordo?',
    resposta:
      'Na dispensa sem justa causa você recebe multa de 40% do FGTS, saca 100% do saldo e tem direito ao seguro-desemprego. No comum acordo (Art. 484-A da CLT), a multa cai para 20%, você saca 80% do FGTS, o aviso prévio indenizado é pela metade e não há seguro-desemprego. Use o simulador de cenários para comparar lado a lado.',
  },
  {
    pergunta: 'Meus dados ficam salvos em algum lugar?',
    resposta:
      'Não. O cálculo roda inteiramente no seu navegador e nada é enviado para nenhum servidor. O histórico de cálculos, se você usar, fica salvo apenas no seu próprio dispositivo (localStorage) e pode ser apagado a qualquer momento.',
  },
];
