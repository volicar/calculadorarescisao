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
      periodoFerias: 0,
      tipoContrato: 'normal',
      motivoRescisao: 'empresa',
      tempoContrato: 0
    }
  });

  const dataAdmissao = watch('dataAdmissao');
  const dataDemissao = watch('dataDemissao');
  const tipoContrato = watch('tipoContrato');

  const today = new Date().toISOString().split("T")[0];

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

  const tipoContratoOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'experiencia', label: 'Experiência' }
  ];

  const motivoRescisaoOptions = [
    { value: 'empresa', label: 'Empresa' },
    { value: 'funcionario', label: 'Funcionário' }
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
        {/* Tipo de Contrato */}
        <Select
          label="Tipo de Contrato"
          options={tipoContratoOptions}
          {...register('tipoContrato')}
          error={errors.tipoContrato?.message}
        />

        {/* Campos específicos para contrato de experiência */}
        {tipoContrato === 'experiencia' && (
          <>
            <Select
              label="Motivo da Rescisão"
              options={motivoRescisaoOptions}
              {...register('motivoRescisao')}
              error={errors.motivoRescisao?.message}
            />
            
            <div>
              <div className='ml-1 mb-1 text-sm'>Dias Trabalhados</div>
              <Input
                type="number"
                min={1}
                max={90}
                {...register('tempoContrato', {
                  required: 'Dias trabalhados é obrigatório',
                  min: { value: 1, message: 'Mínimo de 1 dia' },
                  max: { value: 90, message: 'Máximo de 90 dias' }
                })}
                error={errors.tempoContrato?.message}
              />
            </div>
          </>
        )}

        {/* Salário Mensal */}
        <div>
          <div className='ml-1 mb-1 text-sm'>Salário Mensal</div>
          <Input
            label="Salário Mensal"
            value={salaryDisplay}
            onChange={handleSalaryChange}
            placeholder="Digite seu salário (R$)"
            error={errors.salarioMensal?.message}
          />
        </div>

        {/* Datas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Data Admissão */}
          <div>
            <div className='ml-1 mb-1 text-sm'>Data de Admissão</div>
            <Input
              label="Data de Admissão"
              type="date"
              placeholder="dd/mm/aaaa"
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
            <div className='ml-1 mb-1 text-sm'>Data de Demissão</div>
            <Input
              label="Data de Demissão"
              type="date"
              placeholder="dd/mm/aaaa"
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
        
        {/* Aviso Prévio - apenas para contrato normal */}
        {tipoContrato === 'normal' && (
          <Select
            label="Aviso Prévio"
            options={avisoPrevioOptions}
            {...register('avisoPrevio')}
            error={errors.avisoPrevio?.message}
          />
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