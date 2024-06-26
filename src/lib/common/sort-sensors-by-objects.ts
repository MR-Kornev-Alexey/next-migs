export default function sortSensorsByObjectId(sensors) {
  return sensors.sort((a, b) => {
    if (a.object.id < b.object.id) {
      return -1;
    }
    if (a.object.id > b.object.id) {
      return 1;
    }
    return 0;
  });
}
