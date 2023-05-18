import sendLoginCode from "@/lib/sendLoginCode"

export default async function Email() {
  await sendLoginCode()

  return (
    <div>
      <h1>Send Email</h1>
      {/* <button>{`Your code is: ${t.code}`}</button> */}
    </div>
  )
}
