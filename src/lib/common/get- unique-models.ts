const getUniqueModels = (data) => {
  const models = data.map(sensor => sensor.model);
  return [...new Set(models)];
};
export default  getUniqueModels;
