import decimalToHex from "@/lib/calculate/decimal-to-hex";

export default function inclinoMeterFormatSensorString(address: number): string {
  const protocolId = 0x9b; // Assuming fixed value
  const packetId = 0x01;   // Assuming fixed value

  const hexAddress = decimalToHex(address);
  const checksum = calculateChecksum(protocolId, packetId, address);
  console.log(`7e ${ decimalToHex(protocolId)} ${decimalToHex(packetId)} ${hexAddress} ${checksum} 7e`)
  return `7e ${ decimalToHex(protocolId)} ${decimalToHex(packetId)} ${hexAddress} ${checksum} 7e`;
}

function calculateChecksum(protocolId: number, packetId: number, address: number): string {
  const sum = protocolId ^ packetId ^ address;
  return decimalToHex(sum);
}



