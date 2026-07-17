'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { CalculatorFormData } from '@/types/calculator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { validateDates } from '@/utils/calculations';
import { formatCurrencyInput } from '@/utils/formatters';
import { useState } from 'react';
import { ChevronDown, AlertTriangle, Info } from 'lucide-react';

interface CalculatorFormProps {
  onSubmit: (data: CalculatorFormData) => void;
  loading?: boolean;
}

const TOOLTIPS = {
  tipoContrato: 'Contrato Normal: CLT por prazo indeterminado. Contrato de Experiência: prazo máximo de 90 dias, usado para avaliar o empregado antes de efetivação.',
  motivoRescisao: 'O motivo define quais verbas você tem direito. Dispensa sem justa causa garante FGTS + multa e seguro desemprego. Justa causa perde quase todos os direitos.',
  avisoPrevio: 'Indenizado: a empresa paga o período sem você trabalhar. Trabalhado: você continua trabalhando durante o aviso (redução de 2h/dia ou 7 dias ao final). Não Aplicável: nos casos em que não há aviso prévio (pedido de demissão sem cumprimento, etc.).',
  salario: 'Informe seu salário bruto mensal. Se tiver comissões ou adicionais habituais (noturno, insalubridade, periculosidade), use os campos abaixo para incluí-los na base de cálculo.',
  fgts: 'O FGTS é o Fundo de Garantia por Tempo de Serviço. Se o empregador depositou regularmente os 8% mensais, marque esta opção para incluir o saldo e eventual multa no cálculo.',
  estabilidade: 'Gestantes, cipeiros, dirigentes sindicais e acidentados do trabalho têm estabilidade provisória e não podem ser demitidos sem justa causa durante o período protegido.',
  dependentesIR: 'Cada dependente reduz a base de cálculo do IRRF em R$ 189,59/mês. Incluindo filhos menores de 21 anos, cônjuge sem renda, pais e outros previstos na legislação.',
  comissoes: 'Inclua aqui a média das comissões recebidas nos últimos 12 meses. Comissões habituais integram a remuneração e devem compor a base de cálculo das verbas rescisórias.',
  adicionais: 'Adicionais pagos de forma habitual (noturno, insalubridade, periculosidade) integram a remuneração para fins de rescisão. Inclua a média mensal recebida.',
  horasExtras: 'Horas extras habituais integram a remuneração para fins rescisórios (Súmula 45 e 172 TST). Informe a média mensal recebida nos últimos 12 meses.',
  feriasVencidas: 'Marque se você tem um período aquisitivo completo (12 meses) de férias que ainda não foi gozado. Férias vencidas são devidas em qualquer tipo de rescisão, inclusive justa causa, acrescidas de 1/3.',
  saldoFGTS: 'Consulte o saldo real da sua conta do FGTS no app FGTS ou site da Caixa. A multa de 40% (ou 20% no comum acordo) incide sobre o saldo total depositado, com juros e correção — informar o valor real deixa o cálculo mais preciso.',
};

export const CalculatorForm = ({ onSubmit, loading = false }: CalculatorFormProps) => {
  const [salaryDisplay, setSalaryDisplay] = useState('R$ 0,00');
  const [showAdicionais, setShowAdicionais] = useState(false);
  const [showEstabilidade, setShowEstabilidade] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CalculatorFormData>({
    defaultValues: {
      salarioMensal: 0,
      comissoes: 0,
      adicionaisHabituais: 0,
      mediaHorasExtras: 0,
      temFeriasVencidas: false,
      saldoFGTSReal: 0,
      dataAdmissao: '',
      dataDemissao: '',
      avisoPrevio: 'indenizado',
      temFGTS: true,
      tipoContrato: 'normal',
      motivoRescisao: 'dispensa_sem_justa_causa',
      tempoContrato: 0,
      temEstabilidade: false,
      numeroDependentesIR: 0,
    },
  });

  const dataAdmissao = watch('dataAdmissao');
  const dataDemissao = watch('dataDemissao');
  const tipoContrato = watch('tipoContrato');
  const motivoRescisao = watch('motivoRescisao');
  const temEstabilidade = watch('temEstabilidade');

  const today = new Date().toISOString().split('T')[0];

  const isJustaCausa = motivoRescisao === 'dispensa_com_justa_causa';
  const isPedidoDemissao = motivoRescisao === 'pedido_demissao';
  const isSemJustaCausa = motivoRescisao === 'dispensa_sem_justa_causa';

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = value ? parseInt(value) / 100 : 0;
    setValue('salarioMensal', numericValue);
    setSalaryDisplay(formatCurrencyInput(value));
  };

  const avisoPrevioOptions = [
    { value: 'indenizado', label: 'Indenizado (empresa paga sem trabalhar)' },
    { value: 'trabalhado', label: 'Trabalhado (continua trabalhando)' },
    { value: 'nao_aplicavel', label: 'Dispensado / Não Aplicável' },
  ];

  const tipoContratoOptions = [
    { value: 'normal', label: 'Normal (prazo indeterminado)' },
    { value: 'experiencia', label: 'Experiência (máx. 90 dias)' },
  ];

  const motivoRescisaoNormalOptions = [
    { value: 'dispensa_sem_justa_causa', label: 'Dispensa sem Justa Causa' },
    { value: 'dispensa_com_justa_causa', label: 'Dispensa com Justa Causa' },
    { value: 'pedido_demissao', label: 'Pedido de Demissão' },
    { value: 'comum_acordo', label: 'Comum Acordo (Art. 484-A CLT)' },
    { value: 'termino_contrato', label: 'Término do Contrato' },
    { value: 'aposentadoria', label: 'Aposentadoria' },
  ];

  const motivoRescisaoExperienciaOptions = [
    { value: 'dispensa_sem_justa_causa', label: 'Dispensa sem Justa Causa' },
    { value: 'dispensa_com_justa_causa', label: 'Dispensa com Justa Causa' },
    { value: 'pedido_demissao', label: 'Pedido de Demissão' },
    { value: 'comum_acordo', label: 'Comum Acordo' },
  ];

  const tipoEstabilidadeOptions = [
    { value: 'gestante', label: 'Gestante' },
    { value: 'acidente', label: 'Acidente de Trabalho' },
    { value: 'cipa', label: 'Membro da CIPA' },
    { value: 'sindical', label: 'Dirigente Sindical' },
    { value: 'outro', label: 'Outro tipo de estabilidade' },
  ];

  const onFormSubmit: SubmitHandler<CalculatorFormData> = (data) => {
    if (dataAdmissao && dataDemissao && !validateDates(dataAdmissao, dataDemissao)) {
      return;
    }
    onSubmit(data);
  };

  return (
    <Card title="Preencha seus dados trabalhistas" className="animate-fade-in">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Nome <span className="text-gray-400 text-xs">(opcional)</span>
          </label>
          <Input
            type="text"
            className="bg-gray-800/50"
            placeholder="Digite seu nome"
            {...register('nome' as keyof CalculatorFormData)}
            error={(errors as Record<string, { message?: string }>).nome?.message}
          />
        </div>

        {/* Tipo de Contrato */}
        <div>
          <label className="flex items-center text-sm font-medium mb-2">
            Tipo de Contrato
            <Tooltip content={TOOLTIPS.tipoContrato} />
          </label>
          <Select
            options={tipoContratoOptions}
            {...register('tipoContrato')}
            error={errors.tipoContrato?.message}
          />
        </div>

        {/* Motivo da Rescisão */}
        {tipoContrato === 'normal' && (
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              Motivo da Rescisão
              <Tooltip content={TOOLTIPS.motivoRescisao} />
            </label>
            <Select
              options={motivoRescisaoNormalOptions}
              {...register('motivoRescisao')}
              error={errors.motivoRescisao?.message}
            />

            {/* Alerta justa causa */}
            {isJustaCausa && (
              <div className="mt-2 p-3 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">
                  Na dispensa por justa causa, o empregado perde o direito ao 13° proporcional, aviso prévio e multa do FGTS. Apenas o saldo de salário e férias vencidas são devidos.
                </p>
              </div>
            )}

            {/* Aviso pedido demissão */}
            {isPedidoDemissao && (
              <div className="mt-2 p-3 bg-yellow-900/20 border border-yellow-700/40 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">
                  No pedido de demissão, o empregado perde o direito à multa do FGTS e ao seguro desemprego. Deve também cumprir (ou indenizar) o aviso prévio.
                </p>
              </div>
            )}
          </div>
        )}

        {tipoContrato === 'experiencia' && (
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              Motivo da Rescisão
              <Tooltip content={TOOLTIPS.motivoRescisao} />
            </label>
            <Select
              options={motivoRescisaoExperienciaOptions}
              {...register('motivoRescisao')}
              error={errors.motivoRescisao?.message}
            />
          </div>
        )}

        {/* Contrato de Experiência: dias */}
        {tipoContrato === 'experiencia' && (
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Dias Trabalhados no Contrato de Experiência
            </label>
            <Input
              type="number"
              min={1}
              max={90}
              {...register('tempoContrato', {
                required: 'Dias trabalhados é obrigatório',
                min: { value: 1, message: 'Mínimo de 1 dia' },
                max: { value: 90, message: 'Máximo de 90 dias' },
              })}
              placeholder="Entre 1 e 90 dias"
              error={errors.tempoContrato?.message}
            />
            <p className="mt-1 text-xs text-gray-400">Máximo de 90 dias para contratos de experiência (CLT Art. 445)</p>
          </div>
        )}

        {/* Salário */}
        <div>
          <label className="flex items-center text-sm font-medium mb-2">
            Salário Mensal Bruto
            <Tooltip content={TOOLTIPS.salario} />
          </label>
          <Input
            value={salaryDisplay}
            onChange={handleSalaryChange}
            placeholder="R$ 0,00"
            error={errors.salarioMensal?.message}
            inputMode="numeric"
          />
        </div>

        {/* Adicionais salariais (opcional) */}
        <div className="border border-gray-700/50 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdicionais(!showAdicionais)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/30 hover:bg-gray-800/50 transition-colors text-sm font-medium text-gray-300"
          >
            <span className="flex items-center gap-2">
              <span>Comissões e Adicionais Habituais</span>
              <span className="text-xs text-gray-500 font-normal">(opcional)</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdicionais ? 'rotate-180' : ''}`} />
          </button>

          {showAdicionais && (
            <div className="p-4 space-y-4 bg-gray-800/20">
              <div>
                <label className="flex items-center text-xs font-medium text-gray-300 mb-1.5">
                  Média mensal de comissões
                  <Tooltip content={TOOLTIPS.comissoes} />
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  {...register('comissoes', { min: 0, valueAsNumber: true })}
                  placeholder="R$ 0,00"
                  error={errors.comissoes?.message}
                />
              </div>
              <div>
                <label className="flex items-center text-xs font-medium text-gray-300 mb-1.5">
                  Adicionais habituais (noturno, insalubridade, etc.)
                  <Tooltip content={TOOLTIPS.adicionais} />
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  {...register('adicionaisHabituais', { min: 0, valueAsNumber: true })}
                  placeholder="R$ 0,00"
                  error={errors.adicionaisHabituais?.message}
                />
              </div>
              <div>
                <label className="flex items-center text-xs font-medium text-gray-300 mb-1.5">
                  Média mensal de horas extras
                  <Tooltip content={TOOLTIPS.horasExtras} />
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  {...register('mediaHorasExtras', { min: 0, valueAsNumber: true })}
                  placeholder="R$ 0,00"
                  error={errors.mediaHorasExtras?.message}
                />
              </div>
            </div>
          )}
        </div>

        {/* Férias vencidas */}
        {tipoContrato === 'normal' && (
          <div className="flex items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <input
              type="checkbox"
              {...register('temFeriasVencidas')}
              id="ferias-vencidas-checkbox"
              className="h-5 w-5 rounded border-gray-600 bg-gray-700/50 accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="ferias-vencidas-checkbox" className="ml-3 text-sm font-medium text-gray-200 cursor-pointer flex items-center">
              Possui férias vencidas (não gozadas)
              <Tooltip content={TOOLTIPS.feriasVencidas} />
            </label>
          </div>
        )}

        {/* Datas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Data de Admissão</label>
            <Input
              type="date"
              max={today}
              {...register('dataAdmissao', {
                required: 'Data de admissão é obrigatória',
                validate: (value) => {
                  if (new Date(value) > new Date()) return 'Data não pode ser futura';
                  return true;
                },
              })}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (new Date(e.target.value) > new Date()) e.target.value = today;
              }}
              error={errors.dataAdmissao?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Data de Demissão</label>
            <Input
              type="date"
              min={dataAdmissao || undefined}
              max={today}
              {...register('dataDemissao', {
                required: 'Data de demissão é obrigatória',
                validate: (value) => {
                  if (new Date(value) > new Date()) return 'Data não pode ser futura';
                  if (dataAdmissao && !validateDates(dataAdmissao, value))
                    return 'Deve ser posterior à admissão';
                  return true;
                },
              })}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (new Date(e.target.value) > new Date()) e.target.value = today;
              }}
              error={errors.dataDemissao?.message}
            />
          </div>
        </div>

        {/* FGTS */}
        <div className="border border-gray-700/50 rounded-lg overflow-hidden">
          <div className="flex items-center p-4 bg-gray-800/50">
            <input
              type="checkbox"
              {...register('temFGTS')}
              id="fgts-checkbox"
              className="h-5 w-5 rounded border-gray-600 bg-gray-700/50 accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="fgts-checkbox" className="ml-3 text-sm font-medium text-gray-200 cursor-pointer flex items-center">
              Possui FGTS depositado
              <Tooltip content={TOOLTIPS.fgts} />
            </label>
          </div>

          {watch('temFGTS') && (
            <div className="p-4 bg-gray-800/20">
              <label className="flex items-center text-xs font-medium text-gray-300 mb-1.5">
                Saldo atual da conta do FGTS
                <Tooltip content={TOOLTIPS.saldoFGTS} />
                <span className="ml-1.5 text-gray-500 font-normal">(opcional — melhora a precisão)</span>
              </label>
              <Input
                type="number"
                min={0}
                step={0.01}
                {...register('saldoFGTSReal', { min: 0, valueAsNumber: true })}
                placeholder="Deixe em branco para estimar automaticamente"
                error={errors.saldoFGTSReal?.message}
              />
            </div>
          )}
        </div>

        {/* Aviso Prévio (contrato normal) */}
        {tipoContrato === 'normal' && (
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              Aviso Prévio
              <Tooltip content={TOOLTIPS.avisoPrevio} />
            </label>
            <Select
              options={avisoPrevioOptions}
              {...register('avisoPrevio')}
              error={errors.avisoPrevio?.message}
            />
            {/* Nota aviso trabalhado */}
            {watch('avisoPrevio') === 'trabalhado' && isSemJustaCausa && (
              <p className="mt-1.5 text-xs text-blue-400">
                Durante o aviso trabalhado, você tem direito à redução de 2 horas por dia ou 7 dias corridos ao final do período.
              </p>
            )}
          </div>
        )}

        {/* Dependentes IR */}
        <div>
          <label className="flex items-center text-sm font-medium mb-2">
            Dependentes para IR
            <Tooltip content={TOOLTIPS.dependentesIR} />
            <span className="ml-1.5 text-xs text-gray-400 font-normal">(afeta desconto de IRRF)</span>
          </label>
          <Input
            type="number"
            min={0}
            max={20}
            {...register('numeroDependentesIR', { min: 0, max: 20, valueAsNumber: true })}
            placeholder="0"
            error={errors.numeroDependentesIR?.message}
          />
        </div>

        {/* Estabilidade provisória */}
        <div className="border border-gray-700/50 rounded-lg overflow-hidden">
          <div className="flex items-center p-4 bg-gray-800/30">
            <input
              type="checkbox"
              {...register('temEstabilidade')}
              id="estabilidade-checkbox"
              className="h-5 w-5 rounded border-gray-600 bg-gray-700/50 accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="estabilidade-checkbox" className="ml-3 text-sm font-medium text-gray-200 cursor-pointer flex items-center">
              Possui estabilidade provisória
              <Tooltip content={TOOLTIPS.estabilidade} />
            </label>
          </div>

          {temEstabilidade && (
            <div className="p-4 bg-gray-800/20">
              <label className="block text-xs font-medium text-gray-300 mb-2">Tipo de estabilidade</label>
              <Select
                options={tipoEstabilidadeOptions}
                {...register('tipoEstabilidade')}
              />
              <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-700/40 rounded flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">
                  Você pode ter direito a indenização adicional pelo período de estabilidade. Consulte um advogado trabalhista.
                </p>
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={loading}
        >
          Calcular Rescisão
        </Button>
      </form>
    </Card>
  );
};
