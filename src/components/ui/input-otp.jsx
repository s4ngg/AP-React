import { OTPInput, OTPInputContext } from "input-otp"
import { useContext } from "react"
import { cn } from "../../lib/utils"

export function InputOTP({ className, ...props }) {
  return <OTPInput containerClassName={cn("flex items-center gap-2", className)} {...props} />
}
export function InputOTPGroup({ className, ...props }) {
  return <div className={cn("flex items-center gap-2", className)} {...props} />
}
export function InputOTPSlot({ index, className, ...props }) {
  const ctx = useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = ctx.slots[index]
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center border-2 rounded-lg text-lg font-semibold transition-all",
        isActive ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-300",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-0.5 animate-caret-blink bg-gray-800 duration-1000" />
        </div>
      )}
    </div>
  )
}
