import React from "react"

interface CustomAlertProps {
  title: string
  description: string
  variant?: "default" | "destructive"
}

export function CustomAlert({ title, description, variant = "default" }: CustomAlertProps) {
  const bgColor =
    variant === "destructive" ? "bg-red-100 border-red-400 text-red-700" : "bg-blue-100 border-blue-400 text-blue-700"

  return (
    <div className={`border-l-4 p-4 ${bgColor}`} role="alert">
      <p className="font-bold">{title}</p>
      <p>{description}</p>
    </div>
  )
}

