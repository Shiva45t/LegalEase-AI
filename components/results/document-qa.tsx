"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { demoDocuments } from "@/lib/demo-data"
import { askDocumentQuestion } from "@/lib/ai-services"
import { MessageSquare, Send, Bot, User, Lightbulb, Clock, Sparkles } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface DocumentQAProps {
  documentContext: string
  documentType: string
}

export function DocumentQA({ documentContext, documentType }: DocumentQAProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const getSuggestedQuestions = (docType: string) => {
    const baseQuestions = [
      "What are my main obligations in this document?",
      "What happens if I don't fulfill my responsibilities?",
      "Can I terminate this agreement early?",
      "Are there any hidden fees or penalties?",
      "What rights do I have under this agreement?",
    ]

    const typeSpecificQuestions: Record<string, string[]> = {
      "Rental Agreement": [
        "What happens if I pay rent late?",
        "Can I have pets in this rental?",
        "Who is responsible for repairs and maintenance?",
        "How much notice do I need to give before moving out?",
        "Can the landlord increase my rent during the lease?",
        "What happens to my security deposit?",
      ],
      "Employment Contract": [
        "What benefits am I entitled to?",
        "Can I work for competitors after leaving?",
        "How much vacation time do I get?",
        "What happens during the probationary period?",
        "Can I work remotely?",
        "Who owns the work I create?",
      ],
      "Loan Agreement": [
        "What's my total monthly payment?",
        "Can I pay off the loan early without penalty?",
        "What happens if I miss a payment?",
        "How is the interest calculated?",
        "What happens if I default on the loan?",
        "Are there any fees I should know about?",
      ],
      "Service Agreement": [
        "What exactly will be delivered?",
        "What happens if the project is delayed?",
        "How many revisions are included?",
        "When do I need to make payments?",
        "What if I'm not satisfied with the work?",
        "Who owns the final work product?",
      ],
    }

    return typeSpecificQuestions[docType] || baseQuestions
  }

  const suggestedQuestions = getSuggestedQuestions(documentType)

  const generateAIResponse = async (question: string): Promise<string> => {
    try {
      // Use real Vertex AI service for Q&A
      const response = await askDocumentQuestion(question, documentContext, messages)
      return response
    } catch (error) {
      console.error("AI service error:", error)

      // Fallback to demo responses if AI service fails
      const lowerQuestion = question.toLowerCase()

      // Find relevant demo document for context
      const demoDoc = demoDocuments.find((doc) => doc.type === documentType)

      // Check if this question was already asked in demo data
      if (demoDoc?.qaHistory) {
        const existingQA = demoDoc.qaHistory.find(
          (qa) =>
            qa.question.toLowerCase().includes(lowerQuestion.split(" ")[0]) ||
            lowerQuestion.includes(qa.question.toLowerCase().split(" ")[0]),
        )
        if (existingQA) {
          return existingQA.answer + "\n\n*Note: AI service temporarily unavailable - using demo response.*"
        }
      }

      // Generate contextual responses based on question type and document type
      if (lowerQuestion.includes("late") && lowerQuestion.includes("rent")) {
        return "According to your lease agreement, you have a 5-day grace period after the 1st of each month. If you pay after that, there's a $100 late fee. If rent is more than 10 days late, the landlord can start eviction proceedings. I recommend setting up automatic payments to avoid any issues.\n\n*Note: AI service temporarily unavailable - using fallback response.*"
      }

      if (lowerQuestion.includes("pet") && documentType === "Rental Agreement") {
        return "Yes, pets are allowed in your rental, but you need written permission from your landlord first. There's a $500 pet deposit for each pet, and you'll pay an additional $50 per month in pet rent. Make sure to get the pet approval in writing before bringing any pets to the property.\n\n*Note: AI service temporarily unavailable - using fallback response.*"
      }

      if (lowerQuestion.includes("benefit") && documentType === "Employment Contract") {
        return "Your benefits package includes: health insurance (company pays 80%), dental and vision coverage, $3,000 annual 401k match, life insurance, and access to the company wellness program. Benefits start on your first day of employment. You'll receive detailed benefit information during your onboarding process.\n\n*Note: AI service temporarily unavailable - using fallback response.*"
      }

      if (lowerQuestion.includes("early") && lowerQuestion.includes("pay")) {
        return "Good news! You can pay off your loan early without any prepayment penalties. This can save you money on interest. If you pay an extra $100 per month, you could pay off the loan about 6 months early and save approximately $800 in interest charges.\n\n*Note: AI service temporarily unavailable - using fallback response.*"
      }

      if (lowerQuestion.includes("revision") && documentType === "Service Agreement") {
        return "Your contract includes 2 rounds of revisions in the base price of $8,500. Any additional changes beyond that will be charged at $150 per hour. The designer will provide a time estimate before starting any extra work, so you'll know the cost upfront.\n\n*Note: AI service temporarily unavailable - using fallback response.*"
      }

      if (lowerQuestion.includes("terminate") || lowerQuestion.includes("cancel")) {
        if (documentType === "Rental Agreement") {
          return "You can terminate your lease by giving 30 days written notice to your landlord. However, if you break the lease early (before the 12-month term ends), you may forfeit your security deposit and could be responsible for additional penalties. Check with your landlord about early termination options.\n\n*Note: AI service temporarily unavailable - using fallback response.*"
        } else if (documentType === "Employment Contract") {
          return "This is an at-will employment contract, meaning either you or the company can terminate employment at any time, with or without cause. However, there's a 90-day probationary period where termination is more likely. If you quit, you should give at least 2 weeks notice as professional courtesy.\n\n*Note: AI service temporarily unavailable - using fallback response.*"
        }
      }

      if (lowerQuestion.includes("obligation") || lowerQuestion.includes("responsible")) {
        return `Based on your ${documentType.toLowerCase()}, your main obligations include: following all terms and conditions, making payments on time, maintaining good communication with the other party, and fulfilling your specific duties as outlined in the contract. The most important thing is to read and understand each section carefully.\n\n*Note: AI service temporarily unavailable - using fallback response.*`
      }

      if (lowerQuestion.includes("fee") || lowerQuestion.includes("penalty")) {
        return `I've identified several fees and penalties in your document: late payment fees, potential early termination penalties, and additional charges for services beyond the basic agreement. The key is to stay current with your obligations to avoid these extra costs. Would you like me to explain any specific fee in more detail?\n\n*Note: AI service temporarily unavailable - using fallback response.*`
      }

      // Default fallback response
      return `I'm having trouble connecting to the AI service right now, but I can still help! Based on your ${documentType.toLowerCase()}, this question relates to the terms and conditions that govern your agreement. The specific answer depends on the exact wording in your contract. I recommend reviewing the relevant section carefully, and if you're unsure, consider consulting with a legal professional for personalized advice.\n\n*Note: AI service temporarily unavailable - using fallback response.*`
    }
  }

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: "user",
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await generateAIResponse(question)

      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      toast({
        title: "Question answered!",
        description: "I've analyzed your document to provide this response.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to get response",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSubmit(question)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Ask Questions About Your Document</span>
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
          <CardDescription>
            Get instant answers about your {documentType.toLowerCase()} in plain English. Our AI understands the context
            and can explain complex legal terms with real examples from your document.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Chat Interface */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversation</CardTitle>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  ~2-4s response time
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 p-0">
              <ScrollArea className="flex-1 px-6 min-h-0">
                <div className="h-full">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[400px] text-center">
                      <div>
                        <Bot className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">Ready to answer your questions!</p>
                        <p className="text-sm text-gray-400">
                          Ask me anything about your {documentType.toLowerCase()} and I'll explain it in simple terms
                        </p>
                        <div className="mt-4">
                          <Badge variant="secondary" className="text-xs">
                            Try asking about payments, obligations, or termination
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-3 ${
                            message.type === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.type === "assistant" && (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                          <div
                            className={`max-w-[75%] p-3 rounded-lg break-words ${
                              message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                          </div>
                          {message.type === "user" && (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Analyzing your document...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-6 border-t flex-shrink-0 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit(input)
                  }}
                  className="flex space-x-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask about your ${documentType.toLowerCase()}...`}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggested Questions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Suggested Questions</span>
              </CardTitle>
              <CardDescription>Common questions about {documentType.toLowerCase()}s</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-3 text-sm bg-transparent hover:bg-blue-50"
                  onClick={() => handleSuggestedQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips for Better Answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <p>Be specific about sections or terms you don't understand</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <p>Ask about consequences and your rights</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <p>Request examples or scenarios for clarity</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <p>Follow up with related questions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-800">Live AI Integration</p>
              </div>
              <p className="text-xs text-green-700 mt-1">
                This Q&A system connects to Google Vertex AI for real-time legal document analysis and responses.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
