"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, AlertCircle, CheckCircle, X, Shield, Eye, Download } from "lucide-react"
import { useRealtimeProcessing } from "@/hooks/use-realtime-processing"

interface UploadedFile {
  file: File
  id: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  error?: string
  result?: any
}

export function DocumentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const { processingQueue, addToQueue, removeFromQueue } = useRealtimeProcessing()
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Process each file with real-time updates
      for (const file of acceptedFiles) {
        try {
          const fileId = addToQueue(file)

          toast({
            title: "Document added to queue",
            description: `${file.name} is being processed with real-time updates.`,
          })
        } catch (error: any) {
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive",
          })
        }
      }
    },
    [addToQueue, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  })

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    return <FileText className="h-5 w-5 text-blue-600" />
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusText = (file: UploadedFile) => {
    switch (file.status) {
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Processing with AI..."
      case "completed":
        return "Analysis complete"
      case "error":
        return file.error || "Processing failed"
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Legal Document</span>
          </CardTitle>
          <CardDescription>
            Drag and drop your document or click to browse. We support PDF, DOCX, JPG, and PNG files up to 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              {isDragActive ? (
                <div>
                  <p className="text-lg font-medium text-blue-600">Drop your documents here</p>
                  <p className="text-sm text-blue-500">Release to upload and analyze</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-900">Drag & drop your legal documents here</p>
                  <p className="text-sm text-gray-500">
                    or <span className="text-blue-600 font-medium">click to browse</span>
                  </p>
                </div>
              )}
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <span>PDF</span>
                <span>DOCX</span>
                <span>JPG</span>
                <span>PNG</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Promise */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Your documents are secure</p>
              <p className="text-xs text-green-700">
                End-to-end encrypted, processed securely, and automatically deleted after 24 hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Processing Queue */}
      {processingQueue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>Track the progress of your document analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {processingQueue.map((item) => (
              <div key={item.fileId} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.fileName}</p>
                      <p className="text-xs text-gray-500">{(item.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromQueue(item.fileId)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Overall Progress</span>
                    <span>{Math.round(item.overallProgress)}%</span>
                  </div>
                  <Progress value={item.overallProgress} className="h-3" />
                  {item.estimatedCompletion && item.status !== "completed" && (
                    <p className="text-xs text-gray-500">
                      Estimated completion: {item.estimatedCompletion.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* Detailed Steps */}
                <div className="space-y-3">
                  {item.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : step.status === "active"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.status === "completed" ? "✓" : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{step.name}</span>
                          {step.status === "active" && <span className="text-xs text-blue-600">{step.progress}%</span>}
                          {step.status === "completed" && step.duration && (
                            <span className="text-xs text-gray-500">{(step.duration / 1000).toFixed(1)}s</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{step.description}</p>
                        {step.status === "active" && <Progress value={step.progress} className="h-1 mt-1" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Completion Actions */}
                {item.status === "completed" && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Analysis Complete!</span>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                          Security: 94/100
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                          8th Grade Level
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Document Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supported Document Types</CardTitle>
          <CardDescription>We automatically detect and optimize processing for these legal documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Contracts & Agreements</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• Rental & Lease Agreements</div>
                <div>• Employment Contracts</div>
                <div>• Service Agreements</div>
                <div>• Partnership Agreements</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Financial & Legal</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• Loan Agreements</div>
                <div>• Insurance Policies</div>
                <div>• Terms of Service</div>
                <div>• Privacy Policies</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
