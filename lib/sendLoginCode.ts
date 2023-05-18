import { render } from "@react-email/render"
import { Email } from "@/email/emails/default"
import transporter from "@/lib/nodemailer"
import { getCurrentUser } from "./session"

interface LoginCodeProps {
  to?: string
  subject?: string
  text?: string
  username?: string
  activateLink?: string
  code?: string
}

const sendLoginCode = async (
  code: string = "CODE",
  {
    to,
    subject = "Activate account",
    text = "Your login code",
  }: LoginCodeProps = {}
) => {
  // Ensure that 'code' is provided
  if (!code) {
    throw new Error("sendLoginCode function requires a 'code' parameter.")
  }

  const user = await getCurrentUser()
  const emailHtml = render(
    Email({
      user,
      validationCode: code,
      activateLink: `${process.env.SITE_URL}/api/v1/activate/users/${user?.id}`,
    })
  )
  const userEmail = to || user?.email
  const sender = process.env.SMTP_FROM
  const isValidEmail = [code, sender, userEmail, subject, text].every(Boolean)

  // Ensure that all email parameters are valid
  if (!isValidEmail) {
    throw new Error("Not a valid email")
  }

  const mailOptions = {
    from: sender,
    to: userEmail,
    subject,
    text,
    html: emailHtml,
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(
          "❌ ~ file: sendLoginCode.ts:42 ~ transporter.sendMail ~ error:",
          error.message
        )
        reject(error)
      } else {
        resolve(info)
      }
    })
  })
}

export default sendLoginCode
