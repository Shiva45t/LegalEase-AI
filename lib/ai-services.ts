export interface DocumentAIResult {
  extractedText: string
  confidence: number
  pages: number
  metadata: {
    title?: string
    author?: string
    creationDate?: string
    modificationDate?: string
  }
}

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

export interface ForgeryDetectionResult {
  securityScore: number
  riskLevel: "SAFE" | "SUSPICIOUS" | "HIGH_RISK"
  findings: {
    metadataAnalysis: {
      score: number
      issues: string[]
    }
    signatureVerification: {
      score: number
      issues: string[]
    }
    imageAnalysis: {
      score: number
      issues: string[]
    }
  }
  recommendations: string[]
}

// Document AI Text Extraction
export async function extractTextFromDocument(fileUrl: string, fileName: string): Promise<DocumentAIResult> {
  try {
    // In production, this would call Google Cloud Document AI
    // For demo purposes, we'll simulate the extraction process

    console.log(`[AI] Starting Document AI extraction for ${fileName}`)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock extraction based on file type
    const mockResult: DocumentAIResult = {
      extractedText: generateMockExtractedText(fileName),
      confidence: 0.95 + Math.random() * 0.04, // 95-99% confidence
      pages: Math.floor(Math.random() * 10) + 1,
      metadata: {
        title: fileName.replace(/\.[^/.]+$/, ""),
        author: "Document Author",
        creationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        modificationDate: new Date().toISOString(),
      },
    }

    console.log(`[AI] Document AI extraction completed with ${(mockResult.confidence * 100).toFixed(1)}% confidence`)
    return mockResult
  } catch (error) {
    console.error("[AI] Document AI extraction failed:", error)
    throw new Error("Failed to extract text from document")
  }
}

// Vertex AI Gemini Simplification
export async function simplifyLegalText(originalText: string, documentType: string): Promise<SimplificationResult> {
  try {
    console.log(`[AI] Starting Vertex AI Gemini simplification for ${documentType}`)

    // Use secure API route instead of direct client-side AI call
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

    const result = await response.json()

    console.log(
      `[AI] Vertex AI simplification completed - Reading level improved from ${result.readingLevel.original} to ${result.readingLevel.simplified}`,
    )
    return result
  } catch (error) {
    console.error("[AI] Vertex AI simplification failed:", error)
    // Fallback to mock data if API fails
    return {
      simplifiedText: generateSimplifiedText(originalText, documentType),
      readingLevel: {
        original: "College Level (Grade 16)",
        simplified: "8th Grade Level",
      },
      keyPoints: generateKeyPoints(documentType),
      warnings: [...generateWarnings(documentType), "AI service temporarily unavailable - using fallback analysis"],
      fairnessScore: 75,
    }
  }
}

// Conversational Q&A with Gemini
export async function askDocumentQuestion(
  question: string,
  documentContext: string,
  conversationHistory: any[] = [],
): Promise<string> {
  try {
    console.log(`[AI] Processing Q&A with Vertex AI: "${question}"`)

    // Use secure API route instead of direct client-side AI call
    const response = await fetch("/api/ai/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        documentContext,
        documentType: "Legal Document",
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()

    console.log(`[AI] Vertex AI Q&A response generated`)
    return data.answer
  } catch (error) {
    console.error("[AI] Vertex AI Q&A processing failed:", error)
    // Fallback to mock response if API fails
    return (
      generateContextualResponse(question, documentContext) +
      "\n\n*Note: AI service temporarily unavailable - using fallback response.*"
    )
  }
}

// Forgery Detection
export async function detectForgery(fileUrl: string): Promise<ForgeryDetectionResult> {
  try {
    console.log(`[AI] Starting forgery detection for ${fileUrl}`)

    // Simulate forgery detection process
    await new Promise((resolve) => setTimeout(resolve, 4000))

    const mockResult: ForgeryDetectionResult = {
      securityScore: Math.floor(Math.random() * 100) + 1,
      riskLevel: ["SAFE", "SUSPICIOUS", "HIGH_RISK"][Math.floor(Math.random() * 3)] as
        | "SAFE"
        | "SUSPICIOUS"
        | "HIGH_RISK",
      findings: {
        metadataAnalysis: {
          score: Math.floor(Math.random() * 100) + 1,
          issues: [],
        },
        signatureVerification: {
          score: Math.floor(Math.random() * 100) + 1,
          issues: [],
        },
        imageAnalysis: {
          score: Math.floor(Math.random() * 100) + 1,
          issues: [],
        },
      },
      recommendations: ["Review document carefully", "Consult legal expert"],
    }

    console.log(`[AI] Forgery detection completed with risk level: ${mockResult.riskLevel}`)
    return mockResult
  } catch (error) {
    console.error("[AI] Forgery detection failed:", error)
    throw new Error("Failed to detect forgery")
  }
}

// Helper functions for mock data generation
function generateMockExtractedText(fileName: string): string {
  const name = fileName.toLowerCase()

  if (name.includes("rental") || name.includes("lease")) {
    return `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Agreement") is entered into on [DATE] between [LANDLORD NAME] ("Landlord") and [TENANT NAME] ("Tenant").

PREMISES: The Landlord agrees to rent to the Tenant the property located at [PROPERTY ADDRESS] ("Premises").

TERM: The lease term begins on [START DATE] and ends on [END DATE], for a total period of [LEASE TERM].

RENT: The monthly rent is $[AMOUNT], due on the first day of each month. Late fees of $[LATE FEE] apply after [GRACE PERIOD] days.

SECURITY DEPOSIT: Tenant shall pay a security deposit of $[DEPOSIT AMOUNT] prior to occupancy.

UTILITIES: Tenant is responsible for [UTILITY LIST]. Landlord is responsible for [LANDLORD UTILITIES].

MAINTENANCE: Tenant agrees to maintain the premises in good condition and report any damages immediately.

TERMINATION: Either party may terminate this lease with [NOTICE PERIOD] days written notice.

By signing below, both parties agree to the terms and conditions set forth in this Agreement.

[SIGNATURES AND DATE]`
  }

  if (name.includes("employment")) {
    return `EMPLOYMENT AGREEMENT

This Employment Agreement is entered into between [COMPANY NAME] ("Company") and [EMPLOYEE NAME] ("Employee").

POSITION: Employee is hired as [JOB TITLE] in the [DEPARTMENT] department.

COMPENSATION: Employee will receive an annual salary of $[SALARY] paid in [FREQUENCY] installments.

BENEFITS: Employee is eligible for health insurance, dental coverage, 401(k) matching, and [PTO DAYS] days of paid time off annually.

CONFIDENTIALITY: Employee agrees to maintain confidentiality of all proprietary company information.

TERMINATION: Employment may be terminated by either party with [NOTICE PERIOD] notice. Company reserves the right to terminate immediately for cause.

NON-COMPETE: Employee agrees not to work for direct competitors for [NON_COMPETE_PERIOD] after termination.

[SIGNATURES AND DATE]`
  }

  return `LEGAL DOCUMENT

[This is a sample legal document with standard contractual language, terms and conditions, obligations of parties, and legal provisions that would typically require professional interpretation.]`
}

function generateSimplifiedText(originalText: string, documentType: string): string {
  if (documentType === "Rental Agreement") {
    return `**Your Rental Agreement - Simplified**

**What you're renting:** A property that the landlord owns and is letting you live in.

**How long:** Your lease has specific start and end dates. You can't just leave whenever you want.

**Monthly payment:** You must pay rent on the 1st of each month. If you're late, you'll pay extra fees.

**Security deposit:** You pay money upfront that the landlord holds. You get it back if you don't damage anything.

**Bills and utilities:** The agreement says who pays for electricity, water, internet, etc. Make sure you know what you're responsible for.

**Taking care of the place:** You need to keep the rental clean and in good condition. Tell the landlord right away if something breaks.

**Moving out:** Both you and the landlord need to give advance notice before ending the lease.

**Important:** This is a legal contract. Breaking it can have serious consequences including losing your deposit or being sued.`
  }

  if (documentType === "Employment Contract") {
    return `**Your Employment Contract - Simplified**

**Your job:** You're being hired for a specific position and department.

**Your pay:** You'll receive a set salary paid regularly (weekly, bi-weekly, or monthly).

**Benefits:** You may get health insurance, retirement savings matching, and paid time off.

**Company secrets:** You can't share confidential company information with others, even after you leave.

**Ending your job:** Either you or the company can end your employment, usually with advance notice.

**Working for competitors:** You might not be allowed to work for competing companies for a certain time after leaving.

**Important:** This contract controls your work relationship. Make sure you understand your obligations and rights.`
  }

  return `**Your Legal Document - Simplified**

This document creates legal obligations between the parties involved. Key points include:

• **Parties:** Who is involved and their roles
• **Terms:** What each party must do
• **Timeline:** When things must happen
• **Consequences:** What happens if someone doesn't follow the rules

**Important:** Legal documents are binding contracts. Breaking them can result in financial penalties or legal action.`
}

function generateKeyPoints(documentType: string): string[] {
  const commonPoints = [
    "This is a legally binding agreement",
    "Both parties have specific obligations",
    "Breaking the contract can have serious consequences",
  ]

  if (documentType === "Rental Agreement") {
    return [
      ...commonPoints,
      "Rent must be paid on time every month",
      "Security deposit is refundable if no damages occur",
      "Proper notice is required before moving out",
      "Tenant is responsible for maintaining the property",
    ]
  }

  if (documentType === "Employment Contract") {
    return [
      ...commonPoints,
      "Salary and benefits are clearly defined",
      "Confidentiality requirements continue after employment ends",
      "Non-compete clauses may limit future job opportunities",
      "Termination procedures are specified",
    ]
  }

  return commonPoints
}

function generateWarnings(documentType: string): string[] {
  const commonWarnings = [
    "Seek legal advice if you don't understand any terms",
    "Keep a copy of this document for your records",
  ]

  if (documentType === "Rental Agreement") {
    return [
      ...commonWarnings,
      "Late rent payments can result in eviction",
      "Security deposits have specific return requirements",
      "Some lease terms may not be enforceable in your state",
    ]
  }

  if (documentType === "Employment Contract") {
    return [
      ...commonWarnings,
      "Non-compete clauses vary in enforceability by state",
      "Confidentiality agreements can be very broad",
      "At-will employment may override some contract terms",
    ]
  }

  return commonWarnings
}

function generateContextualResponse(question: string, documentContext: string): string {
  const q = question.toLowerCase()

  if (q.includes("rent") || q.includes("payment")) {
    return "Based on your document, rent payments are due on the first of each month. Late payments typically incur additional fees. The exact amount and late fee structure should be clearly specified in your lease agreement. If you're having trouble making payments, contact your landlord immediately to discuss options."
  }

  if (q.includes("deposit") || q.includes("security")) {
    return "Your security deposit is held by the landlord to cover potential damages or unpaid rent. In most states, landlords must return your deposit within 30 days of move-out, minus any legitimate deductions. They should provide an itemized list of any deductions. Normal wear and tear cannot be deducted from your deposit."
  }

  if (q.includes("terminate") || q.includes("end") || q.includes("break")) {
    return "To end your lease early, check your agreement for specific termination clauses. Most leases require 30-60 days written notice. Breaking a lease without proper notice can result in penalties, loss of your security deposit, or being held responsible for rent until a new tenant is found. Some states have exceptions for military deployment, domestic violence, or uninhabitable conditions."
  }

  if (q.includes("salary") || q.includes("pay") || q.includes("wage")) {
    return "Your employment contract should clearly state your compensation structure, including base salary, payment frequency, and any bonuses or commissions. Make sure you understand whether your pay is exempt or non-exempt from overtime laws. If you're non-exempt, you're entitled to overtime pay for hours worked over 40 per week."
  }

  if (q.includes("quit") || q.includes("resign") || q.includes("leave")) {
    return "Most employment is 'at-will,' meaning you can quit at any time. However, your contract may require advance notice (typically 2 weeks). Check for any non-compete or confidentiality clauses that continue after you leave. You may be entitled to unused vacation pay depending on your state's laws and company policy."
  }

  return "I'd be happy to help you understand this document better. Could you be more specific about which section or term you'd like me to explain? I can break down complex legal language into plain English and help you understand your rights and obligations."
}
