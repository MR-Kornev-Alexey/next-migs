export default function decimalToHex(decimal: number): string {
  if (decimal < 0) {
    // Для отрицательных чисел можно использовать отрицательный знак перед результатом
    return '-' + Math.abs(decimal).toString(16).padStart(2, '0');
  }
  return decimal.toString(16).padStart(2, '0');
}
