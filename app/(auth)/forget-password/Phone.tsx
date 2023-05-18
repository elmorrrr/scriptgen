"use client"
import Link from "next/link"
import { Icons } from "@/components/icons"
import api from "@/lib/axios"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, OTPInput } from "@components"
import { FiSend, FiCheckCircle } from "react-icons/fi"
import { useMultistepForm } from "@/hooks/use-multi-step-form"
import PhoneInput from "react-phone-input-2"
// import { FiCheckCircle } from "react-icons/fi"
import "react-phone-input-2/lib/style.css"
import { object, string, number, boolean, z } from "Zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { redirect, useRouter } from "next/navigation"
import { smsSchema, resetPasswordSchema } from "@/validation/zod"
import getFormData from "@/lib/getFormData"

enum Status {
  Init = "init",
  Pending = "pending",
  Completed = "completed",
  Sleep = "sleep",
}

type Sms = z.infer<typeof smsSchema>
type Password = z.infer<typeof resetPasswordSchema>

const Messages = {
  0: {
    title: "Forgot Your Password?",
    description:
      "Please enter the phone number associated with your account to receive a password code.",
  },
  1: {
    title: "Verify code",
    description:
      "Please enter the verification code sent in your phone to verify your entity.",
  },
  2: {
    title: "Set new password",
    description: "set new password",
  },
}

const PhoneNumber = ({ next, setTemporariId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Sms>({
    // resolver: zodResolver(smsSchema),
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<Status>(Status.Sleep)
  const [phone, setPhone] = useState("")
  const [method, setMethod] = useState("sms")
  const [lang, setLang] = useState<string | null>(null)

  useEffect(() => {
    setLang(window?.navigator?.language)
  }, [])

  const onSubmit = async (e: any) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      const {
        data: { message, result },
      } = await api.post("/auth/forget-password", { method, phone })
      toast({ title: message })
      setTemporariId(result)
      next()
    } catch (err) {
      toast({ title: err.response.data.message, variant: "destructive" })
      // set helpers
    } finally {
      setIsLoading(false)
    }

    // add req
    //fix zod error handleers
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <PhoneInput
            value={phone}
            onChange={(phoneValue) => setPhone(phoneValue)}
            country={"tn"}
          />
          <Input
            type="radio"
            options={[
              {
                label: "Send sms",
                value: "sms",
              },
              {
                label: "Phone call",
                value: "call",
              },
            ]}
            name="method"
            defaultValue={method}
            label="How do you want to receive the code?"
            onChange={(e) => setMethod(e.target.value)}
          />
        </div>

        <>
          {status === "sleep" && (
            <Button isLoading={isLoading} icon={<FiSend />}>
              {(isLoading && "Sending...") || "Reset code"}
            </Button>
          )}

          {status === "pending" && (
            <Button
              isLoading={isLoading}
              variant="success"
              icon={<FiCheckCircle style={{ color: "white" }} color="green" />}
            >
              {(isLoading && "Sending...") || "Send Another code"}
            </Button>
          )}
        </>
        {status === "pending" && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We sent you a code to your phone. Be sure to check your spam too.
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-600">
                  Open phone 📧
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <Button type="button" variant="outline" onClick={() => undefined}>
                Open phone
              </Button>
            </div>
          </>
        )}
      </div>
    </form>
  )
}

const OTP = ({ id, next, setUserId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<Status>(Status.Sleep)
  const [otpCode, setOtpCode] = useState("")
  const [error, setError] = useState(null)

  const verifyCode = async () => {
    if (!otpCode) {
      return toast({ title: "Please provide code", variant: "destructive" })
    }

    if (otpCode.length !== 6) {
      return toast({ title: "Code must be 6 digits", variant: "destructive" })
    }

    try {
      setIsLoading(true)
      const {
        data: { message, result: user_id },
      } = await api.post("/auth/forget-password/verify", {
        id,
        code: otpCode,
      })
      toast({ title: message })
      setUserId(user_id)
      next()
    } catch (error) {
      toast({ title: error.response.data.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  //554217

  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <OTPInput value={otpCode} onChange={(value) => setOtpCode(value)} />
      </div>

      <>
        {status === "sleep" && (
          <Button isLoading={isLoading} icon={<FiSend />} onClick={verifyCode}>
            {(isLoading && "Sending...") || "Verify code"}
          </Button>
        )}

        {status === "pending" && (
          <Button
            isLoading={isLoading}
            variant="success"
            icon={<FiCheckCircle style={{ color: "white" }} color="green" />}
          >
            {(isLoading && "Sending...") || "Send Another code"}
          </Button>
        )}
      </>
      {status === "pending" && (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We sent you a code to your phone. Be sure to check your spam too.
          </p>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-600">
                Open phone 📧
              </span>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <Button type="button" variant="outline" onClick={() => undefined}>
              Open phone
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

const ResetPassword = ({ user_id }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Password>({
    resolver: zodResolver(resetPasswordSchema),
  })
  const router = useRouter()

  const onSubmit = async (data: Password) => {
    try {
      setIsLoading(true)
      const {
        data: { message },
      } = await api.patch("/auth/forget-password/reset", { user_id, ...data })
      toast({
        title: message,
      })
      router.push("/login")
      router.refresh()
    } catch (err) {
      return toast({
        title: err.response.data.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Input
            label="New Password"
            placeholder="Enter new password"
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
            {...register("new_password")}
          />
          {errors["new_password"] && (
            <p className="px-1 text-xs text-red-600">
              {errors["new_password"]?.message}
            </p>
          )}
        </div>
        <div className="grid gap-1">
          <Input
            label="Confirm New Password"
            placeholder="Re-enter new password"
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
            {...register("confirm_new_password")}
          />
          {errors["confirm_new_password"] && (
            <p className="px-1 text-xs text-red-600">
              {errors["confirm_new_password"]?.message}
            </p>
          )}
        </div>

        <Button isLoading={isLoading}>Reset Password</Button>
      </div>
    </form>
  )
}

export default function ForgetPasswordPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [temporariId, setTemporariId] = useState<string>("")
  const [status, setStatus] = useState<Status>(Status.Sleep)
  const [otpCode, setOtpCode] = useState("")
  const [error, setError] = useState(null)
  const [user_id, setUserId] = useState(null)

  const { steps, step, next, currentStepIndex, back } = useMultistepForm([
    <PhoneNumber setTemporariId={setTemporariId} />,
    <OTP id={temporariId} setUserId={setUserId} />,
    <ResetPassword user_id={user_id} />,
  ])

  const handleResetPassword = async (data: FormData) => {
    try {
      setIsLoading(true)
      await api.post("/auth/forget-password", data)
      toast({
        title: `A text message with a 6-digit verification code was just sent to •• ••• •${
          data.phone % 100
        }`,
        description: `A text message with a 6-digit verification code was just sent to •• ••• •${
          data.phone % 100
        }`,
      })
      setError(null)
      setStatus(Status.Pending)
      next()
    } catch (err) {
      setError(err.response.data.msg)
      return toast({
        title: err.response.data.msg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div style={{ position: "fixed", top: "50px", left: "100px" }}>
        <div onClick={() => setStatus(Status.Sleep)}>Sleep</div>
        <div onClick={() => setStatus(Status.Pending)}>Pending</div>
        <div onClick={() => setStatus(Status.Completed)}>Completed</div>
        <button onClick={() => back()}>Back</button>
        <button onClick={() => next()}>Next</button>
      </div>
      <div>
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {Messages[currentStepIndex].title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {Messages[currentStepIndex].description}
          </p>
        </div>
        {step}
      </div>
    </>
  )

  return (
    <form onSubmit={handleResetPassword}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Input
            type="tel"
            label="Phone"
            placeholder="Enter phone number"
            autoComplete="tel"
            disabled={isLoading}
            // onChange={(e) => setEmail(e.target.value)}
            required={true}
            autoFocus={true}
            // {...register("phone")}
          />
          {/* {errors?.email && (
                       <p className="px-1 text-xs text-red-600">
                         {errors.email.message}
                       </p>
                     )} */}
          <Input
            type="radio"
            options={[
              {
                label: "Send sms",
                value: "sms",
              },
              {
                label: "Phone call",
                value: "call",
              },
            ]}
            defaultValue={"sms"}
            label="How do you want to receive the code?"
            required={true}
            // {...register("method")}
          />
          <OTPInput value={otpCode} onChange={(value) => setOtpCode(value)} />
        </div>

        <>
          {status === "sleep" && (
            <Button isLoading={isLoading} icon={<FiSend />}>
              {(isLoading && "Sending...") || "Reset code"}
            </Button>
          )}

          {status === "pending" && (
            <Button
              isLoading={isLoading}
              variant="success"
              icon={<FiCheckCircle style={{ color: "white" }} color="green" />}
            >
              {(isLoading && "Sending...") || "Send Another code"}
            </Button>
          )}
        </>
        {status === "pending" && (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We sent you a code to your phone. Be sure to check your spam too.
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-600">
                  Open phone 📧
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <Button type="button" variant="outline" onClick={""}>
                Open phone
              </Button>
            </div>
          </>
        )}
      </div>
    </form>
  )
}
