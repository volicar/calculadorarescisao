'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { CalculatorFormData } from '@/types/calculator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { validateDates } from '@/utils/calculations';
import { formatCurrencyInput } from '@/utils/formatters';
import { useState } from 'react';

interface CalculatorFormProps {
  onSubmit: (data: CalculatorFormData) => void;
  loading?: boolean;
}

export const CalculatorForm = ({ onSubmit, loading = false }: CalculatorFormProps) => {
  const [salaryDisplay, setSalaryDisplay] = useState('R$ 0,00');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CalculatorFormData>({
    defaultValues: {
      salarioMensal: 0,
      dataAdmissao: '',
      dataDemissao: '',
      avisoPrevio: 'indenizado',
      temFGTS: true,
      tipoContrato: 'normal',
      motivoRescisao: 'dispensa_sem_justa_causa', // Valor padrão mais apropriado
      tempoContrato: 0
    }
  });

  const dataAdmissao = watch('dataAdmissao');
  const dataDemissao = watch('dataDemissao');
  const tipoContrato = watch('tipoContrato');

  const today = new Date().toISOString().split("T")[0];

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = value ? parseInt(value) / 100 : 0;
    setValue('salarioMensal', numericValue);
    setSalaryDisplay(formatCurrencyInput(value));
  };

  const avisoPrevioOptions = [
    { value: 'indenizado', label: 'Indenizado' },
    { value: 'trabalhado', label: 'Trabalhado' },
    { value: 'nao_aplicavel', label: 'Não Aplicável' }
  ];

  const tipoContratoOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'experiencia', label: 'Experiência' }
  ];

  // Opções para contrato NORMAL (mais completas)
  const motivoRescisaoNormalOptions = [
    { value: 'dispensa_sem_justa_causa', label: 'Dispensa sem Justa Causa' },
    { value: 'dispensa_com_justa_causa', label: 'Dispensa com Justa Causa' },
    { value: 'pedido_demissao', label: 'Pedido de Demissão' },
    { value: 'comum_acordo', label: 'Comum Acordo' },
    { value: 'termino_contrato', label: 'Término do Contrato' },
    { value: 'aposentadoria', label: 'Aposentadoria' }
  ];

  // Opções para contrato de EXPERIÊNCIA (apenas as aplicáveis)
  const motivoRescisaoExperienciaOptions = [
    { value: 'dispensa_sem_justa_causa', label: 'Dispensa sem Justa Causa' },
    { value: 'dispensa_com_justa_causa', label: 'Dispensa com Justa Causa' },
    { value: 'pedido_demissao', label: 'Pedido de Demissão' },
    { value: 'comum_acordo', label: 'Comum Acordo' }
  ];

  const onFormSubmit: SubmitHandler<CalculatorFormData> = (data) => {
    // Validação adicional das datas
    if (dataAdmissao && dataDemissao && !validateDates(dataAdmissao, dataDemissao)) {
      return;
    }
    onSubmit(data);
  };

  return (
    <Card title="Preencha seus dados trabalhistas" className="animate-fade-in">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Nome (Opcional) */}
        <div>
          <label className="bg-gray-800/50 block text-sm font-medium mb-2">
            Nome <span className="text-gray-400 text-xs">(opcional)</span>
          </label>
          <Input
            type="text"
            className="bg-gray-800/50"
            placeholder="Digite seu nome"
            {...register('nome' as keyof CalculatorFormData)}
            error={(errors as any).nome?.message}
          />
        </div>

        {/* Tipo de Contrato */}
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de Contrato</label>
          <Select
            options={tipoContratoOptions}
            {...register('tipoContrato')}
            error={errors.tipoContrato?.message}
          />
        </div>

        {/* MOTIVO DA RESCISÃO - Apenas para contrato NORMAL */}
        {tipoContrato === 'normal' && (
          <div>
            <label className="block text-sm font-medium mb-2">Motivo da Rescisão</label>
            <Select
              options={motivoRescisaoNormalOptions}
              {...register('motivoRescisao')}
              error={errors.motivoRescisao?.message}
              className="bg-gray-700/50 border border-gray-600 text-gray-200
                focus:ring-emerald-500/20 focus:border-emerald-500/50 
                hover:border-emerald-500/30 transition-colors cursor-pointer"
            />
          </div>
        )}

        {/* Campos específicos para contrato de experiência */}
        {tipoContrato === 'experiencia' && (
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Dias Trabalhados
            </label>
            <Input
              type="number"
              min={1}
              max={90}
              {...register('tempoContrato', {
                required: 'Dias trabalhados é obrigatório',
                min: { value: 1, message: 'Mínimo de 1 dia' },
                max: { value: 90, message: 'Máximo de 90 dias' }
              })}
              className="bg-gray-700/50 border-gray-600 text-gray-200 
                focus:ring-emerald-500/20 focus:border-emerald-500/50 
                hover:border-emerald-500/30 transition-colors"
              placeholder="Entre 1 e 90 dias"
              error={errors.tempoContrato?.message}
            />
            <div className="mt-2 text-xs text-gray-400">
              Período máximo de 90 dias para contrato de experiência
            </div>
          </div>
        )}

        {/* Salário Mensal */}
        <div>
          <label className="block text-sm font-medium mb-2">Salário Mensal</label>
          <Input
            value={salaryDisplay}
            onChange={handleSalaryChange}
            placeholder="Digite seu salário (R$)"
            error={errors.salarioMensal?.message}
            inputMode='numeric'
          />
        </div>

        {/* Datas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Data Admissão */}
          <div>
            <label className="block text-sm font-medium mb-2">Data de Admissão</label>
            <Input
              type="date"
              max={today}
              {...register('dataAdmissao', {
                required: 'Data de admissão é obrigatória',
                validate: (value) => {
                  if (new Date(value) > new Date()) {
                    return 'Data de admissão não pode ser futura';
                  }
                  return true;
                }
              })}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (new Date(e.target.value) > new Date()) {
                  e.target.value = today;
                }
              }}
              error={errors.dataAdmissao?.message}
            />
          </div>

          {/* Data Demissão */}
          <div>
            <label className="block text-sm font-medium mb-2">Data de Demissão</label>
            <Input
              type="date"
              min={dataAdmissao || undefined}
              max={today}
              {...register('dataDemissao', {
                required: 'Data de demissão é obrigatória',
                validate: (value) => {
                  const dem = new Date(value);
                  const hoje = new Date();

                  if (dem > hoje) {
                    return 'Data de demissão não pode ser futura';
                  }
                  if (dataAdmissao && !validateDates(dataAdmissao, value)) {
                    return 'Data de demissão deve ser posterior à admissão';
                  }
                  return true;
                }
              })}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (new Date(e.target.value) > new Date()) {
                  e.target.value = today;
                }
              }}
              error={errors.dataDemissao?.message}
            />
          </div>
        </div>

        {/* FGTS Checkbox */}
        <div className="flex items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
          <div className="flex items-center flex-1">
            <input
              type="checkbox"
              {...register('temFGTS')}
              id="fgts-checkbox"
              className="h-5 w-5 rounded border-gray-600 bg-gray-700/50 
                accent-emerald-500 
                focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-0 
                hover:border-emerald-500/50 transition-colors cursor-pointer"
            />
            <label
              htmlFor="fgts-checkbox"
              className="ml-3 text-sm font-medium text-gray-200 hover:text-emerald-400 
                transition-colors select-none cursor-pointer"
            >
              Possui FGTS depositado
            </label>
          </div>
        </div>

        {/* Aviso Prévio - apenas para contrato normal */}
        {tipoContrato === 'normal' && (
          <div>
            <label className="block text-sm font-medium mb-2">Aviso Prévio</label>
            <Select
              options={avisoPrevioOptions}
              {...register('avisoPrevio')}
              error={errors.avisoPrevio?.message}
            />
          </div>
        )}

        {/* Botão de Calcular */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={loading}
        >
          Calcular Agora
        </Button>
      </form>
    </Card>
  );
};