import sensors from "@/lib/common/sensors"

export default function setTypeOfSensor(type: string) {
  return sensors[type].type
}
