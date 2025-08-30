export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};

export const formatCurrencyInput = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  const formattedValue = (parseInt(numericValue) / 100).toFixed(2);
  return formatCurrency(parseFloat(formattedValue));
};

export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};