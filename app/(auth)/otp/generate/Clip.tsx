"use client"
import { FiCopy } from "react-icons/fi"
export default function Clip({ secret }) {
  return (
    <p
      style={{ cursor: "copy" }}
      className="flex justify-center gap-2 rounded-md border-2 border-slate-200  px-4 py-2 text-sm text-slate-500 dark:text-slate-400"
      onClick={() => navigator?.clipboard?.writeText(secret)}
    >
      Manually copy the secret
      <FiCopy />
    </p>
  )
}
