import twilio from "twilio"

// const accountSid =
//   process.env.TWILIO_ACCOUNT_SID
// const authToken =
//   process.env.TWILIO_AUTH_TOKEN
// const twilioNumber = process.env.TWILIO_NUMBER

const accountSid = "ACccbec772641f5fb1dfe8773ba5efd2b8"
const authToken = "b8d2cc3b93272212ac81793ad42c1df0"
const twilioNumber = "+16072603947"

const client = new twilio(accountSid, authToken)

// const twiml = new twilio.twiml.VoiceResponse();
// twiml.say(`Your OTP is: ${code}`);
// twiml.pause({ length: 1 });
// twiml.say('Thank you for using our service!');

interface MessageProps {
  from: string
  to: string
  body: string
  mediaUrl: string[]
}

interface CallProps {
  from: string
  to: string
  twiml: string
  url?: string
}

export const sendMessage = async (
  to: string,
  msg: string,
  mediaUrls: string[] = []
) => {
  return await client.messages.create({
    from: twilioNumber,
    to,
    body: msg,
    // mediaUrl: mediaUrls,
  })
}

export const sendCall = (to: string, msg: string, url?: string) => {
  if (typeof msg === "string") {
    msg = `<Response><Say>${msg}</Say></Response>`
  }

  return client.calls.create({
    from: twilioNumber,
    to,
    twiml: msg,
    // url,
  })
}

export default client
