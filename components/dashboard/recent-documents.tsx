"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Calendar, Shield, Eye, Search, Filter, Download, MessageSquare } from "lucide-react"
import { demoDocuments } from "@/lib/demo-data"
import Link from "next/link"

export function RecentDocuments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Filter and sort documents
  const filteredDocuments = demoDocuments
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === "all" || doc.type === filterType
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      } else if (sortBy === "security") {
        return (b.securityScore || 0) - (a.securityScore || 0)
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  const documentTypes = [...new Set(demoDocuments.map((doc) => doc.type))]

  if (demoDocuments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Your analyzed documents will appear here</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No documents uploaded yet</p>
          <p className="text-sm text-gray-400">Upload your first legal document to get started with AI analysis</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Document History</h2>
        <p className="text-gray-600">View and manage your analyzed documents</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="security">Security Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{doc.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                      </div>
                      <span>{doc.pages} pages</span>
                      {doc.processingTime && <span>Processed in {(doc.processingTime / 1000).toFixed(1)}s</span>}
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline">{doc.type}</Badge>
                      <Badge variant={doc.status === "Analyzed" ? "default" : "secondary"}>{doc.status}</Badge>
                      {doc.securityScore && (
                        <div className="flex items-center space-x-1">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">{doc.securityScore}/100</span>
                        </div>
                      )}
                      {doc.fairnessScore && (
                        <Badge variant="outline" className="text-purple-600">
                          Fairness: {doc.fairnessScore}/100
                        </Badge>
                      )}
                    </div>

                    {/* Key Points Preview */}
                    {doc.keyPoints && doc.keyPoints.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Key Points:</p>
                        <p className="text-xs text-gray-600 line-clamp-2">{doc.keyPoints[0]}</p>
                      </div>
                    )}

                    {/* Q&A History Preview */}
                    {doc.qaHistory && doc.qaHistory.length > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-blue-600">
                        <MessageSquare className="h-3 w-3" />
                        <span>{doc.qaHistory.length} questions answered</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {doc.status === "Analyzed" && (
                    <Link href={`/results/${doc.id}`}>
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                    </Link>
                  )}
                  <Button size="sm" variant="ghost" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No documents match your search</p>
            <p className="text-sm text-gray-400">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
