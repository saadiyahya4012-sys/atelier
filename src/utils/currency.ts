/**
 * Format price in Moroccan Dirhams (DH) with consistent thousand separators
 * Examples: 299 DH, 1 250 DH, 2 499 DH
 */
export const formatPrice = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 DH';
  }
  const formatted = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  }).format(amount);

  return `${formatted} DH`;
};
