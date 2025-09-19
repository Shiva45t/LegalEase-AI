"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, XCircle } from "lucide-react"
import { getRiskLevelBadgeVariant } from "@/lib/forgery-detection"

interface SecurityBadgeProps {
  score: number
  riskLevel: "SAFE" | "SUSPICIOUS" | "HIGH_RISK"
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export function SecurityBadge({ score, riskLevel, size = "md", showIcon = true }: SecurityBadgeProps) {
  const getIcon = () => {
    switch (riskLevel) {
      case "SAFE":
        return <Shield className="h-3 w-3" />
      case "SUSPICIOUS":
        return <AlertTriangle className="h-3 w-3" />
      case "HIGH_RISK":
        return <XCircle className="h-3 w-3" />
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1"
      case "md":
        return "text-sm px-3 py-1"
      case "lg":
        return "text-base px-4 py-2"
    }
  }

  return (
    <Badge variant={getRiskLevelBadgeVariant(riskLevel)} className={`${getSizeClasses()} flex items-center space-x-1`}>
      {showIcon && getIcon()}
      <span>{score}/100</span>
    </Badge>
  )
}
