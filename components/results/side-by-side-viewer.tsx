"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Eye, ArrowRight } from "lucide-react"

interface SideBySideViewerProps {
  originalText: string
  simplifiedText: string
}

export function SideBySideViewer({ originalText, simplifiedText }: SideBySideViewerProps) {
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [syncScroll, setSyncScroll] = useState(true)
  const originalRef = useRef<HTMLDivElement>(null)
  const simplifiedRef = useRef<HTMLDivElement>(null)

  // Split text into paragraphs for mapping
  const originalParagraphs = originalText.split("\n\n").filter((p) => p.trim())
  const simplifiedParagraphs = simplifiedText.split("\n\n").filter((p) => p.trim())

  const handleScroll = (source: "original" | "simplified") => {
    if (!syncScroll) return

    const sourceRef = source === "original" ? originalRef : simplifiedRef
    const targetRef = source === "original" ? simplifiedRef : originalRef

    if (sourceRef.current && targetRef.current) {
      const scrollPercentage =
        sourceRef.current.scrollTop / (sourceRef.current.scrollHeight - sourceRef.current.clientHeight)
      targetRef.current.scrollTop = scrollPercentage * (targetRef.current.scrollHeight - targetRef.current.clientHeight)
    }
  }

  const highlightSection = (index: number) => {
    setSelectedSection(index === selectedSection ? null : index)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Side-by-Side Comparison</span>
              </CardTitle>
              <CardDescription>
                Compare original legal text with our AI-simplified version. Click on sections to highlight corresponding
                parts.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <ArrowRight className="h-3 w-3 mr-1" />
                Click to map sections
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSyncScroll(!syncScroll)}
                className={syncScroll ? "bg-blue-50 text-blue-700" : ""}
              >
                Sync Scroll: {syncScroll ? "ON" : "OFF"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Side-by-Side Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Original Document */}
        <Card className="h-[600px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <FileText className="h-5 w-5 text-red-600" />
              <span>Original Document</span>
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm">
              <Badge variant="outline" className="text-red-600 border-red-200">
                College Level
              </Badge>
              <span className="text-gray-600">{originalParagraphs.length} sections</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea
              className="h-[480px] px-6 pb-6"
              ref={originalRef}
              onScrollCapture={() => handleScroll("original")}
            >
              <div className="space-y-4">
                {originalParagraphs.map((paragraph, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedSection === index
                        ? "bg-blue-100 border-2 border-blue-300"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                    onClick={() => highlightSection(index)}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-medium text-red-600">{index + 1}</span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{paragraph}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Simplified Document */}
        <Card className="h-[600px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Simplified Version</span>
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm">
              <Badge variant="outline" className="text-green-600 border-green-200">
                8th Grade Level
              </Badge>
              <span className="text-gray-600">{simplifiedParagraphs.length} sections</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea
              className="h-[480px] px-6 pb-6"
              ref={simplifiedRef}
              onScrollCapture={() => handleScroll("simplified")}
            >
              <div className="space-y-4">
                {simplifiedParagraphs.map((paragraph, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedSection === index
                        ? "bg-blue-100 border-2 border-blue-300"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                    onClick={() => highlightSection(index)}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-medium text-green-600">{index + 1}</span>
                      </div>
                      <div className="text-sm leading-relaxed">
                        {paragraph.includes("**") ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: paragraph
                                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                .replace(/\n/g, "<br />"),
                            }}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap">{paragraph}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Mapping Info */}
      {selectedSection !== null && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">{selectedSection + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Section {selectedSection + 1} Selected</p>
                <p className="text-xs text-blue-700">
                  This section has been simplified while preserving its legal meaning and context.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
