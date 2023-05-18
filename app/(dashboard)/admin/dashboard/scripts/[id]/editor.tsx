"use client"

import { downloadScript, copyScriptToClipboard } from "@/helpers/script"

import { Button } from "@components"

export default function Script({ script }: { script: string }) {
  const THEME = "white" // white or dark

  const preStyle = {
    fontFamily: "monospace",
    fontSize: "14px",
    backgroundColor: THEME === "dark" ? "#050505" : "#f5f5f5",
    color: THEME === "dark" ? "#f5f5f5" : "#050505",
    padding: "10px",
    border: "1px solid gray",
    maxHeight: "400px", // Set a maximum height for the scrollable area
    overflow: "auto",
  }

  return (
    <div className="mb-4 grid gap-2">
      <pre contentEditable={true} style={preStyle}>
        {script}
      </pre>
      <div className="flex justify-end gap-2">
        <Button onClick={() => downloadScript(script)}>Download</Button>
        <Button onClick={() => copyScriptToClipboard(script)}>Copy</Button>
      </div>
    </div>
  )
}
