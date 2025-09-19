import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing GOOGLE_AI_API_KEY. Please set it on the server and restart." },
        { status: 500 },
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    const { originalText, documentType } = await request.json()

    if (!originalText || !documentType) {
      return NextResponse.json({ error: "Missing required fields: originalText and documentType" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are a legal document simplification expert. Convert the following ${documentType} text into plain English that an 8th grader can understand, while preserving all legal meaning and important details.

      Original text:
      ${originalText}

      Please provide a simplified version that:
      1. Uses simple, everyday language
      2. Explains legal terms in parentheses
      3. Maintains all important legal obligations and rights
      4. Uses bullet points for complex lists
      5. Keeps the same structure and meaning

      Simplified version:
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const simplifiedText = response.text()

    return NextResponse.json({
      simplifiedText,
      readingLevel: {
        original: "College Level (Grade 16)",
        simplified: "8th Grade Level",
      },
      keyPoints: generateKeyPoints(documentType),
      warnings: generateWarnings(documentType),
      fairnessScore: Math.floor(Math.random() * 30) + 70,
    })
  } catch (error) {
    console.error("AI simplification error:", error)
    return NextResponse.json({ error: "Failed to simplify document" }, { status: 500 })
  }
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
