import { ServerClient } from "postmark"

const client = ServerClient(process.env.POSTMARK_API_KEY || "")
export default client
