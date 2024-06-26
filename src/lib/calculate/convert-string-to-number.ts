export default async function convertStringToNumber(stringValue) {
  // Проверяем, является ли строка допустимым числом с запятой, точкой или отрицательным знаком
  const numericSingleCommaOrDotRegex = /^-?[0-9]+([,.][0-9]{1,2})?$/;
  if (!numericSingleCommaOrDotRegex.test(stringValue)) {
    throw new Error('Строка не является допустимым числом с запятой, точкой или с отрицательным знаком');
  }
  console.log(stringValue)
  // Определяем, содержит ли строка запятую или точку, и выполняем соответствующую операцию
  if (stringValue.includes(',')) {
    // Преобразуем строку в число, заменяя запятую на точку
    return parseFloat(stringValue.replace(',', '.'));
  } else if (stringValue.includes('.')) {
    // Преобразуем строку в число без замены символов
    return parseFloat(stringValue);
  }

  // Если строка не содержит ни запятой, ни точки, преобразуем ее в целое число
  return parseInt(stringValue, 10);
}
