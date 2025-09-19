"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Shield, TrendingUp, Calendar, DollarSign, BarChart3, PieChart } from "lucide-react"
import { demoAnalytics } from "@/lib/demo-data"

export function UsageStats() {
  const stats = demoAnalytics

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Usage Analytics</h2>
        <p className="text-gray-600">Track your document analysis usage and insights</p>
      </div>

      {/* Current Plan */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan - Demo Mode</span>
            <Badge variant="outline" className="bg-orange-100 text-orange-700">
              {stats.plan}
            </Badge>
          </CardTitle>
          <CardDescription className="text-orange-700">
            You've exceeded your free limit! This demo shows premium features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Documents this month</span>
              <span className="text-orange-700 font-medium">
                {stats.documentsThisMonth} / {stats.monthlyLimit} (Over limit!)
              </span>
            </div>
            <Progress value={(stats.documentsThisMonth / stats.monthlyLimit) * 100} className="h-2" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-orange-700">Upgrade to continue unlimited analysis</span>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">All time processed</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                +4 this month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timeSaved}h</div>
            <p className="text-xs text-muted-foreground">Estimated reading time</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                ~3h per document
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Threats</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.securityThreatsDetected}</div>
            <p className="text-xs text-muted-foreground">Forgeries detected</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                All documents safe
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProcessingTime}s</div>
            <p className="text-xs text-muted-foreground">Per document</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                15-31s range
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documentsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Documents processed</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                33% increase
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalDocuments * 150}</div>
            <p className="text-xs text-muted-foreground">Est. legal consultation fees</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                $150 per document
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Types Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Document Types</span>
            </CardTitle>
            <CardDescription>Breakdown of your analyzed documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.documentTypes.map((type, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{type.type}</span>
                  <span className="font-medium">
                    {type.count} ({type.percentage}%)
                  </span>
                </div>
                <Progress value={type.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Security Score Distribution</span>
            </CardTitle>
            <CardDescription>How secure your documents are</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.securityScores.map((score, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{score.range}</span>
                  <span className="font-medium">
                    {score.count} documents ({score.percentage}%)
                  </span>
                </div>
                <Progress
                  value={score.percentage}
                  className={`h-2 ${score.range === "90-100" ? "bg-green-100" : score.range === "80-89" ? "bg-yellow-100" : "bg-red-100"}`}
                />
              </div>
            ))}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 font-medium">Excellent Security Record!</p>
              <p className="text-xs text-green-700">75% of your documents scored 90+ on security analysis</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade CTA */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Upgrade to Premium</CardTitle>
          <CardDescription className="text-blue-700">
            Get unlimited document analysis and advanced features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 mb-2">Premium features:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Unlimited document uploads</li>
                <li>• Priority processing (10s average)</li>
                <li>• Advanced analytics & insights</li>
                <li>• Export options (PDF, Word, Excel)</li>
                <li>• API access for integrations</li>
                <li>• Team collaboration features</li>
              </ul>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">$19.99</div>
              <div className="text-sm text-blue-700">per month</div>
              <Button className="mt-2 bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
