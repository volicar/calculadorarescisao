'use client';

import { CalculationResult } from '@/types/calculator';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { AdsterraAd }from '@/components/AdsterraAd';
interface ResultDisplayProps {
  result: CalculationResult | null;
}

export const ResultDisplay = ({ result }: ResultDisplayProps) => {
  if (!result) return null;

  const resultItems = [
    { label: 'Saldo de Salário', value: result.saldoSalario },
    { label: 'Férias Proporcionais', value: result.feriasPROPorcionais },
    { label: '13º Proporcional', value: result.decimoTerceiroProporcional },
    { label: 'FGTS + Multa', value: result.fgtsMulta },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <Card title="Resultado">
        <div className="space-y-4">
          {resultItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
              <span className="text-gray-300 text-sm sm:text-base">{item.label}</span>
              <span className="font-medium text-white text-sm sm:text-base">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
          
          <div className="flex justify-between items-center py-3 mt-4 border-t border-gray-600 bg-gray-750 rounded-lg px-4">
            <span className="text-white font-bold text-lg">TOTAL</span>
            <span className="text-primary-400 font-bold text-xl">
              {formatCurrency(result.total)}
            </span>
          </div>
        </div>
      </Card>
      
      {/* Ad Space */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
        <div className="text-gray-400 text-sm mb-2"></div>
        <div className="bg-gray-700 rounded h-32 flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            <AdsterraAd width={300} height={250} />
            </span>
        </div>
      </div>
    </div>
  );
};