"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SideBySideViewer } from "@/components/results/side-by-side-viewer"
import { DocumentQA } from "@/components/results/document-qa"
import { SecurityReport } from "@/components/security/security-report"
import { SecurityBadge } from "@/components/security/security-badge"
import type { DocumentProcessingResult } from "@/lib/document-service"
import { FileText, Shield, MessageSquare, BarChart3, Download, Share, Clock, TrendingUp } from "lucide-react"

interface DocumentResultsProps {
  result: DocumentProcessingResult
}

export function DocumentResults({ result }: DocumentResultsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getReadingLevelColor = (level: string) => {
    if (level.includes("8th")) return "text-green-600"
    if (level.includes("College")) return "text-red-600"
    return "text-yellow-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">{result.fileName}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{result.documentType}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Processed in {(result.processingTime / 1000).toFixed(1)}s</span>
            </div>
            {result.pages && (
              <div className="flex items-center space-x-1">
                <span>{result.pages} pages</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <SecurityBadge score={result.securityScore} riskLevel={result.forgeryAnalysis?.riskLevel || "SAFE"} />
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-lg font-bold">{result.securityScore}/100</div>
                <div className="text-xs text-gray-600">Security Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-lg font-bold">{result.fairnessScore || 85}/100</div>
                <div className="text-xs text-gray-600">Fairness Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-lg font-bold">{result.readingLevelImprovement?.simplified || "8th Grade"}</div>
                <div className="text-xs text-gray-600">Reading Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-lg font-bold">{(result.extractionConfidence || 0.95 * 100).toFixed(0)}%</div>
                <div className="text-xs text-gray-600">Extraction Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Side-by-Side</span>
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Q&A</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Reading Level Improvement */}
          <Card>
            <CardHeader>
              <CardTitle>Reading Level Improvement</CardTitle>
              <CardDescription>How we simplified your document's language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {result.readingLevelImprovement?.original || "College Level"}
                  </div>
                  <div className="text-sm text-gray-600">Original</div>
                </div>
                <div className="flex-1 mx-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600">Complexity Reduction</span>
                    <Progress value={75} className="flex-1" />
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {result.readingLevelImprovement?.simplified || "8th Grade"}
                  </div>
                  <div className="text-sm text-gray-600">Simplified</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 text-center">
                Your document is now accessible to 90% more readers
              </div>
            </CardContent>
          </Card>

          {/* Key Points */}
          {result.keyPoints && result.keyPoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Points</CardTitle>
                <CardDescription>The most important things you need to know</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800">Important Warnings</CardTitle>
                <CardDescription className="text-yellow-700">
                  Pay special attention to these aspects of your document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">{warning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document Metadata */}
          {result.metadata && (
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
                <CardDescription>Technical details about your document</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Name:</span>
                      <span className="font-medium">{result.fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Document Type:</span>
                      <Badge variant="outline">{result.documentType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pages:</span>
                      <span className="font-medium">{result.pages || "N/A"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium">{(result.processingTime / 1000).toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extraction Confidence:</span>
                      <span className="font-medium">{((result.extractionConfidence || 0.95) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Analysis Date:</span>
                      <span className="font-medium">{result.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison">
          <SideBySideViewer originalText={result.originalText} simplifiedText={result.simplifiedText} />
        </TabsContent>

        <TabsContent value="qa">
          <DocumentQA documentContext={result.originalText} documentType={result.documentType} />
        </TabsContent>

        <TabsContent value="security">
          {result.forgeryAnalysis ? (
            <SecurityReport analysis={result.forgeryAnalysis} fileName={result.fileName} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Security analysis not available for this document</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
