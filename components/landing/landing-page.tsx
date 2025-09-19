"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthForm } from "@/components/auth/auth-form"
import { Shield, FileText, MessageSquare, Eye, Zap, CheckCircle } from "lucide-react"

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button variant="ghost" onClick={() => setShowAuth(false)} className="mb-4">
            ← Back to Home
          </Button>
          <AuthForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">LegalEase AI</span>
        </div>
        <Button onClick={() => setShowAuth(true)}>Get Started</Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">🚀 AI-Powered Legal Innovation</Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
          Understand Your Legal Documents in Minutes
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
          The first AI-powered platform that both explains contracts in plain English AND protects you from document
          forgeries. Making law accessible to all.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => setShowAuth(true)} className="text-lg px-8 py-3">
            Upload Your Document
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Revolutionary Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Smart Document Upload</CardTitle>
              <CardDescription>
                Drag-and-drop interface supporting PDF, DOCX, JPG, PNG up to 10MB. Auto-recognizes document types.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Zap className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>AI-Powered Simplification</CardTitle>
              <CardDescription>
                Converts legal jargon to 8th-grade reading level while maintaining 90%+ legal meaning accuracy.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Forgery Detection</CardTitle>
              <CardDescription>
                Advanced metadata analysis and signature verification to detect document tampering and fraud.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Eye className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Side-by-Side Viewer</CardTitle>
              <CardDescription>
                Synchronized scrolling between original and simplified versions with click-to-map functionality.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Interactive Q&A</CardTitle>
              <CardDescription>
                Ask unlimited questions about your document and get context-aware responses in 3-5 seconds.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-teal-600 mb-4" />
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                Bank-level encryption, 24-hour auto-delete, and GDPR compliance for your sensitive documents.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Document</h3>
              <p className="text-gray-600">
                Drag and drop your legal document. We support all major formats and automatically detect document types.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
              <p className="text-gray-600">
                Our AI extracts text, checks for forgeries, and converts legal jargon to plain English in 15-30 seconds.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Understand & Act</h3>
              <p className="text-gray-600">
                Review side-by-side comparison, ask questions, and make informed decisions about your legal documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Understand Your Documents?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands who've simplified their legal documents with AI</p>
          <Button size="lg" variant="secondary" onClick={() => setShowAuth(true)} className="text-lg px-8 py-3">
            Start Free Analysis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">LegalEase AI</span>
          </div>
          <p className="text-gray-400">Making Law Accessible to All</p>
        </div>
      </footer>
    </div>
  )
}
