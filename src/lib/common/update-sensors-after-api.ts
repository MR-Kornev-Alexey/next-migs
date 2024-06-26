export default async function updateSensorsAfterAPI(currentSensors, updateSensor) {
  // Log the updateSensor object for debugging
  console.log('updateSensor ----', updateSensor);

  // Iterate over currentSensors and update them if there's a matching sensor by id
  return currentSensors.map(sensor => {
    if (sensor.id === updateSensor.id) {
      return {...sensor, ...updateSensor};
    }
    return sensor;
  });
}
