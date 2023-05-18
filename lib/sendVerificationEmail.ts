// import { render } from "@react-email/render"
// import DefaultEmail from "@/email/emails/default"
// import transporter from "@/lib/nodemailer"
// import { getCurrentUser } from "./session"

// interface LoginCodeProps {
//   code: string
//   to?: string
//   subject?: string
//   text?: string
//   username?: string
// }

// const sendLoginCode = async ({
//   code,
//   to,
//   subject,
//   text,
//   username,
// }: LoginCodeProps) => {
//   const user = await getCurrentUser()
//   // @ts-ignore
//   const emailHtml = render(<DefaultEmail validationCode={code}></DefaultEmail>)

//   if (!to && !user?.email) {
//     throw new Error("Please provide email")
//   }

//   let options = {
//     from: process.env.SMTP_FROM || "ScriptGen <aminbenz.dev@gmail.com>", // sender address
//     to: to || user?.email, // list of receivers
//     subject: subject || "Your login code", // Subject line
//     text: text || "", // plain text body
//     html: emailHtml, // html body
//   }

//   transporter.sendMail(options)
// }
