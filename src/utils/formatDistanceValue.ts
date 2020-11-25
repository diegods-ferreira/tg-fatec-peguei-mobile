const formatDistanceValue = (value: number): string =>
  Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(value);

export default formatDistanceValue;
