// Client-side service that calls secure API endpoints

export interface SimplificationResult {
  simplifiedText: string
  readingLevel: {
    original: string
    simplified: string
  }
  keyPoints: string[]
  warnings: string[]
  fairnessScore: number
}

export interface SecurityAnalysis {
  score: number
  risks: string[]
  recommendations: string[]
}

class VertexAIService {
  async simplifyLegalText(originalText: string, documentType: string): Promise<string> {
    try {
      const response = await fetch("/api/ai/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalText,
          documentType,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.simplifiedText
    } catch (error) {
      console.error("Error simplifying text:", error)
      throw new Error("Failed to simplify legal text")
    }
  }

  async answerDocumentQuestion(question: string, documentContext: string, documentType: string): Promise<string> {
    try {
      const response = await fetch("/api/ai/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          documentContext,
          documentType,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.answer
    } catch (error) {
      console.error("Error answering question:", error)
      throw new Error("Failed to generate answer")
    }
  }

  async analyzeDocumentSecurity(documentMetadata: any): Promise<SecurityAnalysis> {
    try {
      const response = await fetch("/api/ai/security", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentMetadata,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error analyzing security:", error)
      return {
        score: 85,
        risks: ["Unable to perform full security analysis"],
        recommendations: ["Manual review recommended"],
      }
    }
  }

  async getSimplificationResult(originalText: string, documentType: string): Promise<SimplificationResult> {
    try {
      const response = await fetch("/api/ai/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalText,
          documentType,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error getting simplification result:", error)
      throw new Error("Failed to get simplification result")
    }
  }
}

export const vertexAI = new VertexAIService()
