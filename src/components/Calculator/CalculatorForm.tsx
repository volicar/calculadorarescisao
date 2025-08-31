'use client';

import { useForm } from 'react-hook-form';
import { CalculatorFormData } from '@/types/calculator';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { validateDates } from '@/utils/calculations';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
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
    setValue 
  } = useForm<CalculatorFormData>({
    defaultValues: {
      salarioMensal: 0,
      dataAdmissao: '',
      dataDemissao: '',
      avisoPrevio: 'indenizado',
      temFGTS: true,
      periodoFerias: 0
    }
  });

  const dataAdmissao = watch('dataAdmissao');
  const dataDemissao = watch('dataDemissao');

  const today = new Date().toISOString().split("T")[0]; // data de hoje YYYY-MM-DD

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(value) / 100;
    setValue('salarioMensal', numericValue);
    setSalaryDisplay(formatCurrencyInput(value));
  };

  const avisoPrevioOptions = [
    { value: 'indenizado', label: 'Indenizado' },
    { value: 'trabalhado', label: 'Trabalhado' },
    { value: 'nao_aplicavel', label: 'Não Aplicável' }
  ];

  const onFormSubmit = (data: CalculatorFormData) => {
    if (dataAdmissao && dataDemissao && !validateDates(dataAdmissao, dataDemissao)) {
      return;
    }
    onSubmit(data);
  };

  return (
    <Card title="Calculadora de Rescisão Trabalhista" className="animate-fade-in">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Salário Mensal */}
        <div>
          <Input
            label="Salário Mensal"
            value={salaryDisplay}
            onChange={handleSalaryChange}
            placeholder="R$ 0,00"
            error={errors.salarioMensal?.message}
          />
        </div>

        {/* Datas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Data Admissão */}
          <Input
            label="Data Admissão"
            type="date"
            max={today} // não permite datas futuras
            {...register('dataAdmissao', { 
              required: 'Data de admissão é obrigatória',
              validate: (value) => {
                if (new Date(value) > new Date()) {
                  return 'Data de admissão não pode ser futura';
                }
                return true;
              }
            })}
            error={errors.dataAdmissao?.message}
          />
          
          {/* Data Demissão */}
          <Input
            label="Data Demissão"
            type="date"
            min={dataAdmissao || undefined} // não pode ser antes da admissão
            max={today} // trava no hoje
            {...register('dataDemissao', { 
              required: 'Data de demissão é obrigatória',
              validate: (value) => {
                const dem = new Date(value);
                if (dem > new Date()) {
                  return 'Data de demissão não pode ser futura';
                }
                if (dataAdmissao && !validateDates(dataAdmissao, value)) {
                  return 'Data de demissão deve ser posterior à admissão';
                }
                return true;
              }
            })}
            error={errors.dataDemissao?.message}
          />
        </div>

        {/* Aviso Prévio */}
        <Select
          label="Aviso Prévio"
          options={avisoPrevioOptions}
          {...register('avisoPrevio')}
          error={errors.avisoPrevio?.message}
        />

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
