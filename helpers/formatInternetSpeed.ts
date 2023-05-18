export default function formatInternetSpeed(speed: number) {
  const units = ["bps", "Kbps", "Mbps", "Gbps"]
  let index = 0
  while (speed >= 1000 && index < units.length - 1) {
    speed /= 1000
    index++
  }
  return `${speed.toFixed(0)} ${units[index]}`
}
