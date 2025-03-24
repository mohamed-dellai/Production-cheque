import type React from "react"
import { Loader2 } from "lucide-react"

export function Spinner({ className, ...props }: React.HTMLAttributes<SVGElement>) {
  return <Loader2 className={`h-4 w-4 animate-spin ${className}`} {...props} />
}

