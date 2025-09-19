export interface DemoDocument {
  id: string
  name: string
  type: string
  uploadDate: string
  status: "Analyzed" | "Processing" | "Failed"
  securityScore: number | null
  pages: number
  processingTime?: number
  fairnessScore?: number
  readingLevel?: string
  keyPoints?: string[]
  warnings?: string[]
  qaHistory?: Array<{
    question: string
    answer: string
    timestamp: Date
  }>
}

export const demoDocuments: DemoDocument[] = [
  {
    id: "demo-1",
    name: "Downtown Apartment Lease Agreement.pdf",
    type: "Rental Agreement",
    uploadDate: "2024-01-15",
    status: "Analyzed",
    securityScore: 94,
    pages: 8,
    processingTime: 23000,
    fairnessScore: 78,
    readingLevel: "8th Grade",
    keyPoints: [
      "Monthly rent of $2,400 due on the 1st of each month",
      "12-month lease term starting February 1st, 2024",
      "Security deposit of $2,400 required before move-in",
      "Tenant responsible for utilities except water and trash",
      "30-day notice required for lease termination",
    ],
    warnings: [
      "Late fee of $100 applies after 5-day grace period",
      "No subletting allowed without written landlord approval",
      "Pet deposit of $500 required for each pet",
    ],
    qaHistory: [
      {
        question: "What happens if I pay rent late?",
        answer:
          "According to your lease, you have a 5-day grace period after the 1st of each month. If you pay after that, there's a $100 late fee. If rent is more than 10 days late, the landlord can start eviction proceedings.",
        timestamp: new Date("2024-01-15T10:30:00"),
      },
      {
        question: "Can I have pets in this apartment?",
        answer:
          "Yes, pets are allowed but you need written permission from your landlord first. There's also a $500 pet deposit for each pet, and you'll pay an additional $50 per month in pet rent.",
        timestamp: new Date("2024-01-15T10:32:00"),
      },
    ],
  },
  {
    id: "demo-2",
    name: "TechCorp Employment Contract.pdf",
    type: "Employment Contract",
    uploadDate: "2024-01-10",
    status: "Analyzed",
    securityScore: 98,
    pages: 12,
    processingTime: 31000,
    fairnessScore: 92,
    readingLevel: "8th Grade",
    keyPoints: [
      "Annual salary of $95,000 with quarterly performance reviews",
      "Full-time position as Senior Software Developer",
      "Standard benefits package including health, dental, and 401k",
      "2 weeks vacation in first year, 3 weeks after one year",
      "Remote work allowed up to 3 days per week",
    ],
    warnings: [
      "Non-compete clause restricts working for competitors for 1 year",
      "Intellectual property created during employment belongs to company",
      "90-day probationary period with at-will termination",
    ],
    qaHistory: [
      {
        question: "What's included in my benefits package?",
        answer:
          "Your benefits include: health insurance (company pays 80%), dental and vision coverage, $3,000 annual 401k match, life insurance, and access to the company wellness program. Benefits start on your first day.",
        timestamp: new Date("2024-01-10T14:15:00"),
      },
    ],
  },
  {
    id: "demo-3",
    name: "Personal Loan Agreement - Chase Bank.pdf",
    type: "Loan Agreement",
    uploadDate: "2024-01-05",
    status: "Analyzed",
    securityScore: 96,
    pages: 6,
    processingTime: 18000,
    fairnessScore: 85,
    readingLevel: "8th Grade",
    keyPoints: [
      "Loan amount: $25,000 at 8.5% APR",
      "36-month repayment term with monthly payments of $789",
      "No prepayment penalties - you can pay off early",
      "Fixed interest rate for the entire loan term",
      "Automatic payment discount of 0.25% available",
    ],
    warnings: [
      "Late payment fee of $39 if payment is more than 10 days overdue",
      "Default triggers immediate full balance due",
      "Personal guarantee means your assets could be at risk",
    ],
    qaHistory: [],
  },
  {
    id: "demo-4",
    name: "Freelance Web Design Contract.pdf",
    type: "Service Agreement",
    uploadDate: "2024-01-20",
    status: "Analyzed",
    securityScore: 89,
    pages: 4,
    processingTime: 15000,
    fairnessScore: 88,
    readingLevel: "8th Grade",
    keyPoints: [
      "Project scope: Complete website redesign and development",
      "Total project cost: $8,500 paid in 3 installments",
      "Timeline: 6 weeks from contract signing to completion",
      "Client provides all content and images",
      "2 rounds of revisions included in base price",
    ],
    warnings: [
      "Additional revisions charged at $150/hour",
      "Project delays due to client feedback extend timeline",
      "Final payment due before website goes live",
    ],
    qaHistory: [
      {
        question: "What happens if I need more than 2 revisions?",
        answer:
          "The contract includes 2 rounds of revisions in the base price. Any additional changes beyond that will be charged at $150 per hour. The designer will provide a time estimate before starting extra work.",
        timestamp: new Date("2024-01-20T16:45:00"),
      },
    ],
  },
]

export const demoAnalytics = {
  totalDocuments: 4,
  documentsThisMonth: 4,
  monthlyLimit: 3,
  timeSaved: 12.5,
  averageProcessingTime: 22,
  securityThreatsDetected: 0,
  plan: "Free",
  monthlyUsage: [
    { month: "Dec", documents: 0 },
    { month: "Jan", documents: 4 },
  ],
  documentTypes: [
    { type: "Rental Agreement", count: 1, percentage: 25 },
    { type: "Employment Contract", count: 1, percentage: 25 },
    { type: "Loan Agreement", count: 1, percentage: 25 },
    { type: "Service Agreement", count: 1, percentage: 25 },
  ],
  securityScores: [
    { range: "90-100", count: 3, percentage: 75 },
    { range: "80-89", count: 1, percentage: 25 },
    { range: "70-79", count: 0, percentage: 0 },
    { range: "Below 70", count: 0, percentage: 0 },
  ],
}
