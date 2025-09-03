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
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'Calculadora de Rescisão Online — Calcule seus direitos CLT',
  description: 'Use nossa calculadora de rescisão online para simular FGTS, férias, 13º salário e aviso prévio. Rápido, fácil e gratuito.',
};


export default function CalculadoraPage() {
  return (
    <div>
      <h1>Calculadora de Rescisão Online</h1>
      {/* ... seu componente de cálculo ... */}
    </div>
  );
}


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
    <Card title="Preencha seus dados trabalhistas" className="animate-fade-in">
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
          <div>
            <Input
              label="Data Admissão"
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
                  e.target.value = today; // trava manualmente se digitar futuro
                }
              }}
              error={errors.dataAdmissao?.message}
            />
          </div>
          
          {/* Data Demissão */}
          <div>
            <Input
              label="Data Demissão"
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
                  e.target.value = today; // trava manualmente se digitar futuro
                }
              }}
              error={errors.dataDemissao?.message}
            />
          </div>
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
