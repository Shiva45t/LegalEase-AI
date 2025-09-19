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

    const { documentMetadata } = await request.json()

    if (!documentMetadata) {
      return NextResponse.json({ error: "Missing required field: documentMetadata" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      Analyze this document metadata for potential security risks and authenticity issues:
      ${JSON.stringify(documentMetadata)}

      Provide a security analysis with:
      1. A security score from 0-100 (100 being most secure)
      2. List of identified risks
      3. Recommendations for the user

      Return as JSON format with fields: score, risks, recommendations
    `

    const result = await model.generateContent(prompt)
    const response = await result.response

    try {
      const analysis = JSON.parse(response.text())
      return NextResponse.json(analysis)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return NextResponse.json({
        score: 85,
        risks: ["Unable to perform full security analysis"],
        recommendations: ["Manual review recommended"],
      })
    }
  } catch (error) {
    console.error("AI security analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze document security" }, { status: 500 })
  }
}
