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

    const { question, documentContext, documentType } = await request.json()

    if (!question || !documentContext || !documentType) {
      return NextResponse.json(
        { error: "Missing required fields: question, documentContext, and documentType" },
        { status: 400 },
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are a legal document AI assistant. Answer the user's question about their ${documentType} based on the document context provided.

      Document Context:
      ${documentContext}

      User Question: ${question}

      Please provide a helpful, accurate answer that:
      1. References specific parts of the document when relevant
      2. Explains legal implications in simple terms
      3. Suggests next steps or considerations
      4. Warns about potential risks or important deadlines
      5. Recommends consulting a lawyer for complex issues

      Answer:
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const answer = response.text()

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("AI Q&A error:", error)
    return NextResponse.json({ error: "Failed to process question" }, { status: 500 })
  }
}
