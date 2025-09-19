"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DocumentResults } from "@/components/results/document-results"
import { useAuth } from "@/hooks/use-auth"
import type { DocumentProcessingResult } from "@/lib/document-service"
import { demoDocuments } from "@/lib/demo-data"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [result, setResult] = useState<DocumentProcessingResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/")
      return
    }

    const fetchResult = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Find the demo document by ID
        const demoDoc = demoDocuments.find((doc) => doc.id === params.id)

        if (!demoDoc) {
          throw new Error("Document not found")
        }

        // Convert demo document to DocumentProcessingResult format
        const mockResult: DocumentProcessingResult = {
          id: demoDoc.id,
          fileName: demoDoc.name,
          documentType: demoDoc.type,
          securityScore: demoDoc.securityScore || 0,
          originalText: generateOriginalText(demoDoc.type),
          simplifiedText: generateSimplifiedText(demoDoc.type, demoDoc.keyPoints || []),
          processingTime: demoDoc.processingTime || 25000,
          uploadUrl: "https://example.com/document.pdf",
          createdAt: new Date(demoDoc.uploadDate),
          extractionConfidence: 0.95 + Math.random() * 0.04,
          readingLevelImprovement: {
            original: "College Level (Grade 14-16)",
            simplified: demoDoc.readingLevel || "8th Grade Level",
          },
          keyPoints: demoDoc.keyPoints || [],
          warnings: demoDoc.warnings || [],
          fairnessScore: demoDoc.fairnessScore || 85,
          forgeryAnalysis: {
            overallScore: demoDoc.securityScore || 94,
            riskLevel:
              (demoDoc.securityScore || 94) >= 90 ? "SAFE" : (demoDoc.securityScore || 94) >= 70 ? "MODERATE" : "HIGH",
            confidence: 0.92,
            analysisTime: 3200,
            findings: {
              metadataAnalysis: {
                score: (demoDoc.securityScore || 94) + Math.floor(Math.random() * 4),
                issues: [],
                details: {
                  creationDate: demoDoc.uploadDate + "T10:00:00Z",
                  modificationDate: demoDoc.uploadDate + "T10:05:00Z",
                  author: "Document Author",
                  software: "Microsoft Word 2021",
                  inconsistencies: [],
                },
              },
              signatureVerification: {
                score: (demoDoc.securityScore || 94) - Math.floor(Math.random() * 3),
                signaturesFound: 2,
                issues: [],
                details: {
                  signatureLocations: ["Page 1, Bottom Left", "Page 1, Bottom Right"],
                  nameMatches: true,
                  dateConsistency: true,
                  handwritingAnalysis: "Consistent handwriting patterns detected",
                },
              },
              imageForensics: {
                score: demoDoc.securityScore || 94,
                issues: [],
                details: {
                  compressionArtifacts: false,
                  errorLevelAnalysis: "No significant anomalies detected",
                  pixelInconsistencies: [],
                  suspiciousRegions: [],
                },
              },
            },
            recommendations: [
              "Document appears authentic with high confidence",
              "No immediate security concerns detected",
              "All signatures and metadata appear consistent",
            ],
            technicalDetails: {
              fileSize: 2048576,
              fileType: "PDF",
              processingTime: 3200,
              algorithmsUsed: ["Metadata Analysis", "OCR Signature Detection", "Error Level Analysis"],
            },
          },
          pages: demoDoc.pages,
          metadata: {
            title: demoDoc.name.replace(".pdf", ""),
            author: "Document Author",
            creationDate: demoDoc.uploadDate + "T10:00:00Z",
            modificationDate: demoDoc.uploadDate + "T10:05:00Z",
          },
        }

        setResult(mockResult)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [params.id, user, authLoading, router])

  const generateOriginalText = (docType: string): string => {
    switch (docType) {
      case "Rental Agreement":
        return `RESIDENTIAL LEASE AGREEMENT\n\nThis Lease Agreement ("Agreement") is entered into on January 1, 2024 between John Smith ("Landlord") and Jane Doe ("Tenant").\n\nPREMISES: The Landlord agrees to rent to the Tenant the property located at 123 Main Street, Apartment 2B, City, State 12345 ("Premises").\n\nTERM: The lease term begins on January 1, 2024 and ends on December 31, 2024, for a total period of twelve (12) months.\n\nRENT: The monthly rent is $2,400.00, due on the first day of each month. Late fees of $100.00 apply after five (5) days grace period.\n\nSECURITY DEPOSIT: Tenant shall pay a security deposit of $2,400.00 prior to occupancy.\n\nUTILITIES: Tenant is responsible for electricity, gas, internet, and cable. Landlord is responsible for water, sewer, and trash collection.\n\nMAINTENANCE: Tenant agrees to maintain the premises in good condition and report any damages immediately to the Landlord.\n\nPETS: Pets are permitted with prior written consent from Landlord. Pet deposit of $500.00 per pet required.\n\nTERMINATION: Either party may terminate this lease with thirty (30) days written notice. Early termination by Tenant may result in forfeiture of security deposit.\n\nBy signing below, both parties agree to the terms and conditions set forth in this Agreement.`

      case "Employment Contract":
        return `EMPLOYMENT AGREEMENT\n\nThis Employment Agreement ("Agreement") is entered into between TechCorp Inc. ("Company") and John Doe ("Employee").\n\nPOSITION: Employee shall serve as Senior Software Developer in the Engineering Department.\n\nCOMPENSATION: Employee shall receive an annual salary of $95,000.00, payable in accordance with Company's standard payroll practices.\n\nBENEFITS: Employee shall be entitled to participate in Company's benefit programs including health insurance, dental coverage, vision coverage, and 401(k) retirement plan with company matching.\n\nVACATION: Employee shall accrue two (2) weeks of paid vacation during the first year of employment, increasing to three (3) weeks after one year of service.\n\nWORK ARRANGEMENT: Employee may work remotely up to three (3) days per week with supervisor approval.\n\nNON-COMPETE: Employee agrees not to engage in competing business activities during employment and for twelve (12) months following termination.\n\nINTELLECTUAL PROPERTY: All work product created during employment shall be the exclusive property of the Company.\n\nTERMINATION: Employment is at-will and may be terminated by either party with or without cause. Initial ninety (90) day probationary period applies.`

      case "Loan Agreement":
        return `PERSONAL LOAN AGREEMENT\n\nThis Loan Agreement ("Agreement") is entered into between Chase Bank ("Lender") and Jane Smith ("Borrower").\n\nLOAN AMOUNT: Lender agrees to loan Borrower the principal sum of Twenty-Five Thousand Dollars ($25,000.00).\n\nINTEREST RATE: The loan shall bear interest at a fixed annual percentage rate (APR) of 8.5%.\n\nREPAYMENT TERMS: Borrower shall repay the loan in thirty-six (36) equal monthly installments of $789.00, commencing on the first day of the month following loan disbursement.\n\nPREPAYMENT: Borrower may prepay the loan in whole or in part at any time without penalty.\n\nLATE FEES: If any payment is more than ten (10) days overdue, Borrower shall pay a late fee of $39.00.\n\nDEFAULT: Upon default, the entire unpaid balance shall become immediately due and payable.\n\nSECURITY: This loan is unsecured but guaranteed by Borrower's personal assets.\n\nAUTOMATIC PAYMENT DISCOUNT: Borrower may receive a 0.25% interest rate reduction by enrolling in automatic payments.`

      default:
        return `SERVICE AGREEMENT\n\nThis Service Agreement ("Agreement") is entered into between WebDesign Pro ("Service Provider") and ABC Company ("Client").\n\nSCOPE OF WORK: Service Provider shall design and develop a complete website redesign including responsive design, content management system integration, and search engine optimization.\n\nPROJECT COST: The total project cost is Eight Thousand Five Hundred Dollars ($8,500.00) payable in three installments.\n\nTIMELINE: Project shall be completed within six (6) weeks from contract execution, subject to timely client feedback and content provision.\n\nREVISIONS: Two (2) rounds of revisions are included in the base price. Additional revisions shall be charged at $150.00 per hour.\n\nCLIENT RESPONSIBILITIES: Client shall provide all necessary content, images, and feedback within agreed timeframes.\n\nDELIVERABLES: Final deliverables include website files, documentation, and training materials.\n\nPAYMENT TERMS: Final payment is due before website launch and transfer of files.`
    }
  }

  const generateSimplifiedText = (docType: string, keyPoints: string[]): string => {
    const pointsText = keyPoints.map((point) => `• ${point}`).join("\n")

    switch (docType) {
      case "Rental Agreement":
        return `**Your Rental Agreement - Simplified**\n\n**What you're renting:** Downtown apartment\n**How long:** 12 months starting February 1st, 2024\n**Monthly rent:** $2,400 due on the 1st of each month\n\n**Key Points:**\n${pointsText}\n\n**Important:** This is a legal contract. Breaking it can have serious consequences.`

      case "Employment Contract":
        return `**Your Employment Contract - Simplified**\n\n**Your job:** Senior Software Developer at TechCorp\n**Salary:** $95,000 per year\n**Benefits:** Health, dental, vision, 401k matching\n\n**Key Points:**\n${pointsText}\n\n**Important:** This creates legal obligations for both you and your employer.`

      case "Loan Agreement":
        return `**Your Loan Agreement - Simplified**\n\n**Loan amount:** $25,000 at 8.5% interest\n**Monthly payment:** $789 for 36 months\n**Total you'll pay:** About $28,400\n\n**Key Points:**\n${pointsText}\n\n**Important:** This is a legal debt obligation that affects your credit.`

      default:
        return `**Your Service Agreement - Simplified**\n\n**What you're getting:** Complete website redesign\n**Total cost:** $8,500 in 3 payments\n**Timeline:** 6 weeks to completion\n\n**Key Points:**\n${pointsText}\n\n**Important:** This creates legal obligations for both parties.`
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading document results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading results: {error}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Document not found</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button onClick={() => router.push("/")} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <DocumentResults result={result} />
      </div>
    </div>
  )
}
