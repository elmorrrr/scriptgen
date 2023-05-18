import { toast } from "@/hooks/use-toast"

interface ConfigData {
  name: string
  email: string
  phone: string
  address: string
  service_type?: "residential" | "business"
  service_speed?: "100 Mbps" | "500 Mbps" | "1 Gbps"
  device_type?: "router" | "switch"
  device_model: string
  device_firmware_version: string
  device_ip_address: string
  subnet_mask: string
  default_gateway: string
  dns_server_1: string
  dns_server_2?: string
  dhcp_server_ip_address?: string
  status: string
}

export function generateSecret() {
  const length = 16
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let secret = ""
  for (let i = 0, n = charset.length; i < length; ++i) {
    secret += charset.charAt(Math.floor(Math.random() * n))
  }
  return secret
}

export function generateScript(config: ConfigData): string {
  const {
    device_model,
    device_ip_address,
    subnet_mask,
    default_gateway,
    dns_server_1,
    dns_server_2,
    status,
  } = config
  const username = config.email.split("@")[0]

  const secret = generateSecret()
  const script = `configure terminal
  hostname ${device_model}
  ip address ${device_ip_address} ${subnet_mask}
  ip default-gateway ${default_gateway}
  ip name-server ${dns_server_1}
  ip name-server ${dns_server_2 ?? ""}
  username ${username} secret ${secret}
  interface wireless 0
  ssid ${username}-wifi
  encryption WPA2 passphrase ${secret}
  exit
  ip dhcp pool dhcp-server
  network ${device_ip_address} ${subnet_mask}
  default-router ${default_gateway}
  lease 86400
  exit
  end`.trim()

  return script
}

export function downloadScript(script) {
  const blob = new Blob([script], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "script.txt"
  link.click()
}

export function copyScriptToClipboard(script) {
  navigator.clipboard
    .writeText(script)
    .then(() => toast({ title: "Script copied to clipboard" }))
    .catch((err) =>
      toast({
        title: "Failed to copy the script text",
        variant: "destructive",
      })
    )
}

export default generateScript
