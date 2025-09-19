"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, CheckCircle, XCircle, FileText, Eye, AlertCircle } from "lucide-react"
import { type ForgeryAnalysis, getRiskLevelColor, getRiskLevelBadgeVariant } from "@/lib/forgery-detection"

interface SecurityReportProps {
  analysis: ForgeryAnalysis
  fileName: string
}

export function SecurityReport({ analysis, fileName }: SecurityReportProps) {
  const getRiskIcon = () => {
    switch (analysis.riskLevel) {
      case "SAFE":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "SUSPICIOUS":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case "HIGH_RISK":
        return <XCircle className="h-6 w-6 text-red-600" />
    }
  }

  const getRiskDescription = () => {
    switch (analysis.riskLevel) {
      case "SAFE":
        return "Document appears authentic with no significant security concerns detected."
      case "SUSPICIOUS":
        return "Document shows some inconsistencies that warrant further investigation."
      case "HIGH_RISK":
        return "Document shows multiple signs of potential tampering or forgery."
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Security Score */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getRiskIcon()}
              <div>
                <CardTitle className="text-xl">Security Analysis Report</CardTitle>
                <CardDescription>{fileName}</CardDescription>
              </div>
            </div>
            <Badge variant={getRiskLevelBadgeVariant(analysis.riskLevel)} className="text-lg px-4 py-2">
              {analysis.overallScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Security Score</span>
              <span className={getRiskLevelColor(analysis.riskLevel)}>{analysis.riskLevel.replace("_", " ")}</span>
            </div>
            <Progress value={analysis.overallScore} className="h-3" />
          </div>

          <Alert
            className={
              analysis.riskLevel === "HIGH_RISK"
                ? "border-red-200 bg-red-50"
                : analysis.riskLevel === "SUSPICIOUS"
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-green-200 bg-green-50"
            }
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">{getRiskDescription()}</AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Confidence Level</span>
              <span className="font-medium">{(analysis.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Analysis Time</span>
              <span className="font-medium">{(analysis.analysisTime / 1000).toFixed(1)}s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">File Type</span>
              <span className="font-medium">{analysis.technicalDetails.fileType}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="signatures">Signatures</TabsTrigger>
          <TabsTrigger value="forensics">Forensics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Metadata Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{analysis.findings.metadataAnalysis.score}/100</div>
                <Progress value={analysis.findings.metadataAnalysis.score} className="h-2 mb-2" />
                <p className="text-xs text-gray-600">{analysis.findings.metadataAnalysis.issues.length} issues found</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Signature Verification</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{analysis.findings.signatureVerification.score}/100</div>
                <Progress value={analysis.findings.signatureVerification.score} className="h-2 mb-2" />
                <p className="text-xs text-gray-600">
                  {analysis.findings.signatureVerification.signaturesFound} signatures analyzed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Image Forensics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{analysis.findings.imageForensics.score}/100</div>
                <Progress value={analysis.findings.imageForensics.score} className="h-2 mb-2" />
                <p className="text-xs text-gray-600">
                  {analysis.findings.imageForensics.issues.length} anomalies detected
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>Based on our analysis, here are our recommendations for this document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Metadata Analysis Details</CardTitle>
              <CardDescription>Analysis of document creation, modification, and authorship information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Document Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creation Date:</span>
                      <span>
                        {new Date(analysis.findings.metadataAnalysis.details.creationDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modified Date:</span>
                      <span>
                        {new Date(analysis.findings.metadataAnalysis.details.modificationDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Author:</span>
                      <span>{analysis.findings.metadataAnalysis.details.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Software:</span>
                      <span>{analysis.findings.metadataAnalysis.details.software}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Issues Detected</h4>
                  <div className="space-y-2">
                    {analysis.findings.metadataAnalysis.issues.length > 0 ? (
                      analysis.findings.metadataAnalysis.issues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{issue}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">No metadata issues detected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signatures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signature Verification Details</CardTitle>
              <CardDescription>Analysis of signatures, names, and signing consistency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Signature Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Signatures Found:</span>
                      <span>{analysis.findings.signatureVerification.signaturesFound}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name Matches:</span>
                      <span
                        className={
                          analysis.findings.signatureVerification.details.nameMatches
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {analysis.findings.signatureVerification.details.nameMatches ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date Consistency:</span>
                      <span
                        className={
                          analysis.findings.signatureVerification.details.dateConsistency
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {analysis.findings.signatureVerification.details.dateConsistency
                          ? "Consistent"
                          : "Inconsistent"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h5 className="font-medium text-xs mb-1">Signature Locations:</h5>
                    <div className="space-y-1">
                      {analysis.findings.signatureVerification.details.signatureLocations.map((location, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          • {location}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Analysis Results</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Handwriting Analysis:</span>
                      <p className="mt-1">{analysis.findings.signatureVerification.details.handwritingAnalysis}</p>
                    </div>
                    {analysis.findings.signatureVerification.issues.length > 0 && (
                      <div>
                        <h5 className="font-medium text-xs mb-1">Issues Detected:</h5>
                        <div className="space-y-1">
                          {analysis.findings.signatureVerification.issues.map((issue, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forensics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Forensics Analysis</CardTitle>
              <CardDescription>Advanced pixel-level analysis for image manipulation detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Technical Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compression Artifacts:</span>
                      <span
                        className={
                          analysis.findings.imageForensics.details.compressionArtifacts
                            ? "text-yellow-600"
                            : "text-green-600"
                        }
                      >
                        {analysis.findings.imageForensics.details.compressionArtifacts ? "Detected" : "None"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Error Level Analysis:</span>
                      <p className="mt-1">{analysis.findings.imageForensics.details.errorLevelAnalysis}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Findings</h4>
                  <div className="space-y-2">
                    {analysis.findings.imageForensics.details.pixelInconsistencies.length > 0 && (
                      <div>
                        <h5 className="font-medium text-xs mb-1">Pixel Inconsistencies:</h5>
                        <div className="space-y-1">
                          {analysis.findings.imageForensics.details.pixelInconsistencies.map((inconsistency, index) => (
                            <div key={index} className="text-xs text-gray-600">
                              • {inconsistency}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysis.findings.imageForensics.details.suspiciousRegions.length > 0 && (
                      <div>
                        <h5 className="font-medium text-xs mb-1">Suspicious Regions:</h5>
                        <div className="space-y-1">
                          {analysis.findings.imageForensics.details.suspiciousRegions.map((region, index) => (
                            <div key={index} className="text-xs text-gray-600">
                              • {region}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysis.findings.imageForensics.issues.length === 0 && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">No forensic anomalies detected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-sm mb-2">Technical Details</h4>
                <div className="grid md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-600">File Size:</span>
                    <div className="font-medium">
                      {(analysis.technicalDetails.fileSize / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Processing Time:</span>
                    <div className="font-medium">{(analysis.technicalDetails.processingTime / 1000).toFixed(1)}s</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Algorithms Used:</span>
                    <div className="font-medium">{analysis.technicalDetails.algorithmsUsed.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence:</span>
                    <div className="font-medium">{(analysis.confidence * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
