interface Sensor {
  name: string;
  id: string;
  sensor_id: string;
  designation: string;
  network_number: number;
  model: string;
  data: string[];
}

const sortedSensors = async (allSensors: Sensor[]): Promise<{ fullData: Sensor[], ids: string[] }> => {
  if (Array.isArray(allSensors)) {
    // Filter unique sensors
    const uniqueSensors = allSensors.reduce((acc: Sensor[], current: Sensor) => {
      const exists = acc.find(item => item.id === current.id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Sort sensors by model
    uniqueSensors.sort((a, b) => a.model.localeCompare(b.model));

    // Create an array of sensor IDs
    const ids = uniqueSensors.map(sensor => sensor.id);

    // Return the sorted unique sensors and their IDs
    return { fullData: uniqueSensors, ids };
  }
  return { fullData: [], ids: [] };
};

export default sortedSensors;
