"use client"

import { useState, useCallback } from "react"

export interface ProcessingStep {
  id: string
  name: string
  description: string
  progress: number
  status: "pending" | "active" | "completed" | "error"
  duration?: number
}

export interface ProcessingQueue {
  fileId: string
  fileName: string
  fileSize: number
  steps: ProcessingStep[]
  overallProgress: number
  status: "uploading" | "processing" | "completed" | "error"
  startTime: Date
  estimatedCompletion?: Date
}

export function useRealtimeProcessing() {
  const [processingQueue, setProcessingQueue] = useState<ProcessingQueue[]>([])

  const addToQueue = useCallback((file: File) => {
    const fileId = Math.random().toString(36).substr(2, 9)

    const steps: ProcessingStep[] = [
      {
        id: "upload",
        name: "Uploading",
        description: "Securely uploading your document to our servers",
        progress: 0,
        status: "active",
      },
      {
        id: "extraction",
        name: "Text Extraction",
        description: "Using Google Document AI to extract text with 95%+ accuracy",
        progress: 0,
        status: "pending",
      },
      {
        id: "security",
        name: "Security Analysis",
        description: "Checking document authenticity and detecting potential forgeries",
        progress: 0,
        status: "pending",
      },
      {
        id: "simplification",
        name: "AI Simplification",
        description: "Converting legal jargon to plain English using Vertex AI Gemini",
        progress: 0,
        status: "pending",
      },
      {
        id: "analysis",
        name: "Final Analysis",
        description: "Generating insights, key points, and preparing Q&A system",
        progress: 0,
        status: "pending",
      },
    ]

    const newItem: ProcessingQueue = {
      fileId,
      fileName: file.name,
      fileSize: file.size,
      steps,
      overallProgress: 0,
      status: "uploading",
      startTime: new Date(),
      estimatedCompletion: new Date(Date.now() + 30000), // 30 seconds estimate
    }

    setProcessingQueue((prev) => [...prev, newItem])

    // Start processing simulation
    simulateProcessing(fileId)

    return fileId
  }, [])

  const simulateProcessing = useCallback(async (fileId: string) => {
    const stepDurations = [3000, 8000, 5000, 10000, 4000] // milliseconds for each step

    for (let stepIndex = 0; stepIndex < 5; stepIndex++) {
      const stepDuration = stepDurations[stepIndex]
      const progressInterval = stepDuration / 100 // Update progress 100 times per step

      // Mark current step as active
      setProcessingQueue((prev) =>
        prev.map((item) => {
          if (item.fileId !== fileId) return item

          const updatedSteps = item.steps.map((step, index) => {
            if (index === stepIndex) {
              return { ...step, status: "active" as const, progress: 0 }
            } else if (index < stepIndex) {
              return { ...step, status: "completed" as const, progress: 100 }
            }
            return step
          })

          return {
            ...item,
            steps: updatedSteps,
            status: "processing" as const,
          }
        }),
      )

      // Simulate step progress
      for (let progress = 0; progress <= 100; progress += 2) {
        await new Promise((resolve) => setTimeout(resolve, progressInterval))

        setProcessingQueue((prev) =>
          prev.map((item) => {
            if (item.fileId !== fileId) return item

            const updatedSteps = item.steps.map((step, index) => {
              if (index === stepIndex) {
                return { ...step, progress: Math.min(progress, 100) }
              }
              return step
            })

            const overallProgress = (stepIndex * 100 + progress) / 5

            return {
              ...item,
              steps: updatedSteps,
              overallProgress: Math.min(overallProgress, 100),
            }
          }),
        )
      }

      // Mark step as completed
      setProcessingQueue((prev) =>
        prev.map((item) => {
          if (item.fileId !== fileId) return item

          const updatedSteps = item.steps.map((step, index) => {
            if (index === stepIndex) {
              return { ...step, status: "completed" as const, progress: 100, duration: stepDuration }
            }
            return step
          })

          return {
            ...item,
            steps: updatedSteps,
          }
        }),
      )
    }

    // Mark entire process as completed
    setProcessingQueue((prev) =>
      prev.map((item) => {
        if (item.fileId !== fileId) return item

        return {
          ...item,
          status: "completed" as const,
          overallProgress: 100,
        }
      }),
    )
  }, [])

  const removeFromQueue = useCallback((fileId: string) => {
    setProcessingQueue((prev) => prev.filter((item) => item.fileId !== fileId))
  }, [])

  return {
    processingQueue,
    addToQueue,
    removeFromQueue,
  }
}
