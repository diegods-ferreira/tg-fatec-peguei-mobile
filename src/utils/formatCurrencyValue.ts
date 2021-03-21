const formatCurrencyValue = (value: number): string => {
  const formattedValue = Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `R$ ${formattedValue}`;
};

export default formatCurrencyValue;
