import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { storage, db, auth } from "@/lib/firebase"
import { extractTextFromDocument, simplifyLegalText } from "@/lib/ai-services"
import { analyzeDocumentAuthenticity } from "@/lib/forgery-detection"

export interface DocumentProcessingResult {
  id: string
  fileName: string
  documentType: string
  securityScore: number
  originalText: string
  simplifiedText: string
  processingTime: number
  uploadUrl: string
  createdAt: Date
  // Enhanced fields
  extractionConfidence?: number
  readingLevelImprovement?: {
    original: string
    simplified: string
  }
  keyPoints?: string[]
  warnings?: string[]
  fairnessScore?: number
  forgeryAnalysis?: any
  pages?: number
  metadata?: any
}

export async function uploadDocument(file: File): Promise<{ downloadURL: string; path: string }> {
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to upload documents")
  }

  const timestamp = Date.now()
  const fileName = `${timestamp}_${file.name}`
  const path = `documents/${auth.currentUser.uid}/${fileName}`
  const storageRef = ref(storage, path)

  try {
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return { downloadURL, path }
  } catch (error) {
    console.error("Upload error:", error)
    throw new Error("Failed to upload document. Please try again.")
  }
}

export async function processDocument(downloadURL: string, fileName: string): Promise<DocumentProcessingResult> {
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to process documents")
  }

  const startTime = Date.now()

  try {
    console.log(`[PROCESSING] Starting comprehensive analysis for ${fileName}`)

    // Step 1: Extract text using Document AI
    const extractionResult = await extractTextFromDocument(downloadURL, fileName)

    // Step 2: Analyze for forgery/tampering
    const forgeryAnalysis = await analyzeDocumentAuthenticity(downloadURL, fileName, 0)

    // Step 3: Simplify legal text using Gemini
    const documentType = detectDocumentType(fileName)
    const simplificationResult = await simplifyLegalText(extractionResult.extractedText, documentType)

    // Compile comprehensive results
    const result: DocumentProcessingResult = {
      id: Math.random().toString(36).substr(2, 9),
      fileName,
      documentType,
      securityScore: forgeryAnalysis.overallScore,
      originalText: extractionResult.extractedText,
      simplifiedText: simplificationResult.simplifiedText,
      processingTime: Date.now() - startTime,
      uploadUrl: downloadURL,
      createdAt: new Date(),
      // Enhanced results
      extractionConfidence: extractionResult.confidence,
      readingLevelImprovement: simplificationResult.readingLevel,
      keyPoints: simplificationResult.keyPoints,
      warnings: simplificationResult.warnings,
      fairnessScore: simplificationResult.fairnessScore,
      forgeryAnalysis: forgeryAnalysis,
      pages: extractionResult.pages,
      metadata: extractionResult.metadata,
    }

    // Save comprehensive results to Firestore
    await addDoc(collection(db, "processed_documents"), {
      ...result,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    })

    console.log(`[PROCESSING] Analysis completed in ${result.processingTime}ms - Security: ${result.securityScore}/100`)
    return result
  } catch (error) {
    console.error("[PROCESSING] Document processing failed:", error)
    throw new Error("Failed to process document. Please try again.")
  }
}

function detectDocumentType(fileName: string): string {
  const name = fileName.toLowerCase()
  if (name.includes("rental") || name.includes("lease")) return "Rental Agreement"
  if (name.includes("employment") || name.includes("job")) return "Employment Contract"
  if (name.includes("loan") || name.includes("credit")) return "Loan Agreement"
  if (name.includes("service") || name.includes("contract")) return "Service Agreement"
  if (name.includes("insurance")) return "Insurance Policy"
  return "Legal Document"
}

function generateMockOriginalText(): string {
  return `WHEREAS, the Lessor is the owner of certain real property located at [Property Address], and WHEREAS, the Lessee desires to lease said property for residential purposes, NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. PREMISES: Lessor hereby leases to Lessee the above-described premises for the term and upon the conditions set forth herein.

2. TERM: The term of this lease shall commence on [Start Date] and shall continue for a period of [Lease Term], unless sooner terminated in accordance with the provisions hereof.

3. RENT: Lessee agrees to pay Lessor as rent for said premises the sum of $[Monthly Rent] per month, payable in advance on the first day of each month during the term hereof.`
}

function generateMockSimplifiedText(): string {
  return `This is a rental agreement between you (the tenant) and the property owner (the landlord).

**What you're renting:** The property at [Property Address]

**How long:** Starting on [Start Date] for [Lease Term]

**Monthly rent:** $[Monthly Rent] due on the 1st of each month

**Key points:**
• You must pay rent on time each month
• The landlord owns the property and is renting it to you
• This agreement explains the rules for both parties`
}
