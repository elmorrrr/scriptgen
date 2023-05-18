import { toast } from "@/hooks/use-toast"

const PROVIDERS = {
  topnet: 400,
  hexabyte: 300,
  globalnet: 200,
}

export function generateHexCode() {
  let hex = ""
  for (let i = 0; i < 16; i++) {
    hex += Math.floor(Math.random() * 16).toString(16)
  }
  return hex.toUpperCase()
}

function getUpstreamPort(provider) {
  switch (provider) {
    case "topnet":
      return "9/./0-1"
    case "hexabyte":
      return "10/./0-1"
    case "globalnet":
      return ["9/./0-1", "10/./0-1"][Math.floor(Math.random() * 2)]
    default:
      throw new Error("Invalid provider")
  }
}

export function generateScript({
  name,
  cin,
  address,
  provider,
  speed,
  service,
  serial_number,
}) {
  const vlan = PROVIDERS[provider]
  return `huawei(config)#vlan ${vlan} smart
huawei(config)#port vlan ${vlan} ${getUpstreamPort(provider)}
huawei(config)#traffic table ip index <100> name ftth_${address
    .replace(/\s+/g, "_")
    .toLowerCase()}_${service} cir ${speed} priority 0 priority-policy local-setting
huawei(config)#DBA-profile add profile-id <100> profile-name <dba_profile_100M> type4 ${
    service === "HSI" ? "max" : "fix"
  } ${speed} 
huawei(config)# ont-lineprofile gpon profile-id <2> profile-name <Line-Profile-HG8245H5>  
huawei(config-gpon-lineprofile-<2>)#tcont <1> dba-profile-id <100>
huawei(config-gpon-lineprofile-<2>)#gem add <1> eth tcont <1>
huawei(config-gpon-lineprofile-<2>)#gem mapping <1> <0> vlan ${vlan / 2}
huawei(config-gpon-lineprofile-<2>)#quit
huawei(config)#ont-srvprofile gpon profile-id <3> profile-name <svrprofile_HG8245H>
huawei(config-gpon-srvprofile-<3>)#ont-port eth <4> pots <2>
huawei(config)#interface gpon <0/17>
huawei(config-if-gpon-<0/17>)#ont add <1> <0> sn-auth ${serial_number} 
omci ont-lineprofile-id <2> ont-srvprofile-id <3>
huawei(config-if-gpon-<0/17>)#quit
huawei(config)#service-port vlan ${vlan} gpon <0/2/7> ont <0> gemport <1> multi-service user-vlan ${
    vlan / 2
  } tag-transform translate inbound traffic-table index <18> outbound traffic-table index <8>`
}

export function downloadScript(script, fileName = "script.txt") {
  const blob = new Blob([script], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.download = fileName
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function copyScriptToClipboard(script) {
  navigator.clipboard.writeText(script).then(
    () => {
      toast({ title: "Text copied to clipboard." })
    },
    (err) => {
      toast({
        title: "Error copying text to clipboard",
        variant: "destructive",
      })
    }
  )
}
