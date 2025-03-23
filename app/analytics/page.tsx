"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    } else if (!loading && user && user.role !== "teacher") {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "teacher") return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Select defaultValue="current">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Semester</SelectItem>
              <SelectItem value="previous">Previous Semester</SelectItem>
              <SelectItem value="year">Full Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Student Performance</TabsTrigger>
          <TabsTrigger value="assignments">Assignment Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Class Average" value="85%" change="+2.5%" description="From previous period" />
            <StatsCard title="Completion Rate" value="92%" change="+5.3%" description="From previous period" />
            <StatsCard title="Top Performer" value="Sophia Chen" change="94%" description="Average grade" />
            <StatsCard title="Needs Improvement" value="3" change="12.5%" description="Of total students" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Average class performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: "Jan", value: 78 },
                    { name: "Feb", value: 82 },
                    { name: "Mar", value: 85 },
                    { name: "Apr", value: 83 },
                    { name: "May", value: 87 },
                    { name: "Jun", value: 89 },
                  ]}
                  index="name"
                  categories={["value"]}
                  colors={["primary"]}
                  valueFormatter={(value) => `${value}%`}
                  showLegend={false}
                  showXAxis={true}
                  showYAxis={true}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Distribution of grades across all students</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "A", value: 8 },
                    { name: "B", value: 10 },
                    { name: "C", value: 4 },
                    { name: "D", value: 2 },
                    { name: "F", value: 0 },
                  ]}
                  index="name"
                  categories={["value"]}
                  colors={["primary", "secondary", "accent", "destructive", "muted"]}
                  valueFormatter={(value) => `${value} students`}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assignment Performance</CardTitle>
              <CardDescription>Average scores across different assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { name: "Math Quiz 1", value: 82 },
                  { name: "Science Report", value: 85 },
                  { name: "History Essay", value: 92 },
                  { name: "English Lit", value: 81 },
                  { name: "Physics Lab", value: 78 },
                  { name: "Art Portfolio", value: 90 },
                ]}
                index="name"
                categories={["value"]}
                colors={["primary"]}
                valueFormatter={(value) => `${value}%`}
                showLegend={false}
                showXAxis={true}
                showYAxis={true}
                yAxisWidth={40}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Comparison</CardTitle>
              <CardDescription>Individual student performance across all assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { name: "Emma T.", Math: 85, Science: 92, History: 78, English: 88 },
                  { name: "James W.", Math: 75, Science: 82, History: 90, English: 85 },
                  { name: "Sophia C.", Math: 95, Science: 94, History: 92, English: 96 },
                  { name: "Noah M.", Math: 70, Science: 75, History: 85, English: 80 },
                  { name: "Olivia J.", Math: 88, Science: 90, History: 94, English: 92 },
                ]}
                index="name"
                categories={["Math", "Science", "History", "English"]}
                colors={["primary", "secondary", "accent", "muted"]}
                valueFormatter={(value) => `${value}%`}
                showLegend={true}
                showXAxis={true}
                showYAxis={true}
                yAxisWidth={40}
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Improvement Trends</CardTitle>
                <CardDescription>Student improvement over the semester</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { month: "Jan", "Emma T.": 75, "James W.": 70, "Sophia C.": 90 },
                    { month: "Feb", "Emma T.": 78, "James W.": 72, "Sophia C.": 91 },
                    { month: "Mar", "Emma T.": 82, "James W.": 78, "Sophia C.": 92 },
                    { month: "Apr", "Emma T.": 85, "James W.": 80, "Sophia C.": 94 },
                    { month: "May", "Emma T.": 88, "James W.": 85, "Sophia C.": 95 },
                  ]}
                  index="month"
                  categories={["Emma T.", "James W.", "Sophia C."]}
                  colors={["primary", "secondary", "accent"]}
                  valueFormatter={(value) => `${value}%`}
                  showLegend={true}
                  showXAxis={true}
                  showYAxis={true}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Timeliness</CardTitle>
                <CardDescription>When students submit their assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "Early", value: 10 },
                    { name: "On Time", value: 8 },
                    { name: "Late", value: 5 },
                    { name: "Missing", value: 1 },
                  ]}
                  index="name"
                  categories={["value"]}
                  colors={["primary", "secondary", "accent", "destructive"]}
                  valueFormatter={(value) => `${value} submissions`}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Students Requiring Attention</CardTitle>
              <CardDescription>Students who may need additional support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Noah Martinez",
                    average: "78%",
                    trend: "Declining",
                    issue: "Missing 2 recent assignments",
                    recommendation: "Schedule one-on-one meeting to discuss challenges",
                  },
                  {
                    name: "William Brown",
                    average: "82%",
                    trend: "Stable",
                    issue: "Consistently late submissions",
                    recommendation: "Discuss time management strategies",
                  },
                  {
                    name: "Ava Garcia",
                    average: "75%",
                    trend: "Improving",
                    issue: "Struggling with specific topics",
                    recommendation: "Provide additional resources on challenging topics",
                  },
                ].map((student, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Average: {student.average} | Trend: {student.trend}
                        </p>
                      </div>
                      <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">Needs Attention</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Issue:</span> {student.issue}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Recommendation:</span> {student.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Difficulty Analysis</CardTitle>
              <CardDescription>Average scores and completion rates by assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Assignment</th>
                      <th className="text-left p-2">Avg. Score</th>
                      <th className="text-left p-2">Completion</th>
                      <th className="text-left p-2">Difficulty</th>
                      <th className="text-left p-2">Common Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Math Quiz 3",
                        score: "78%",
                        completion: "92%",
                        difficulty: "Medium",
                        issues: "Calculus integration problems",
                      },
                      {
                        name: "Science Report",
                        score: "85%",
                        completion: "83%",
                        difficulty: "Medium",
                        issues: "Data analysis section",
                      },
                      {
                        name: "History Essay",
                        score: "92%",
                        completion: "100%",
                        difficulty: "Low",
                        issues: "None significant",
                      },
                      {
                        name: "English Literature",
                        score: "81%",
                        completion: "79%",
                        difficulty: "High",
                        issues: "Character analysis depth",
                      },
                      {
                        name: "Physics Lab Report",
                        score: "78%",
                        completion: "96%",
                        difficulty: "High",
                        issues: "Calculation errors",
                      },
                    ].map((assignment, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2 font-medium">{assignment.name}</td>
                        <td className="p-2">{assignment.score}</td>
                        <td className="p-2">{assignment.completion}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              assignment.difficulty === "Low"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : assignment.difficulty === "Medium"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {assignment.difficulty}
                          </span>
                        </td>
                        <td className="p-2 text-sm">{assignment.issues}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Question Analysis</CardTitle>
                <CardDescription>Performance breakdown by question type</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { type: "Multiple Choice", correct: 85 },
                    { type: "Short Answer", correct: 72 },
                    { type: "Essay", correct: 68 },
                    { type: "Problem Solving", correct: 65 },
                    { type: "Data Analysis", correct: 70 },
                  ]}
                  index="type"
                  categories={["correct"]}
                  colors={["primary"]}
                  valueFormatter={(value) => `${value}%`}
                  showLegend={false}
                  showXAxis={true}
                  showYAxis={true}
                  yAxisWidth={40}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topic Mastery</CardTitle>
                <CardDescription>Class performance by subject topic</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "Algebra", value: 85 },
                    { name: "Geometry", value: 78 },
                    { name: "Calculus", value: 65 },
                    { name: "Statistics", value: 72 },
                    { name: "Trigonometry", value: 80 },
                  ]}
                  index="name"
                  categories={["value"]}
                  colors={["primary", "secondary", "accent", "destructive", "muted"]}
                  valueFormatter={(value) => `${value}%`}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Recommendations</CardTitle>
              <CardDescription>Suggestions for improving assignment effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    assignment: "Math Quiz 3",
                    observation: "Students struggled with integration by parts",
                    recommendation: "Provide additional practice problems focusing on integration techniques",
                  },
                  {
                    assignment: "English Literature",
                    observation: "Character analysis sections scored lower than plot analysis",
                    recommendation: "Develop a character analysis framework to guide students through the process",
                  },
                  {
                    assignment: "Physics Lab Report",
                    observation: "Calculation errors were common in the data analysis section",
                    recommendation: "Create a step-by-step calculation guide with examples of common pitfalls",
                  },
                ].map((item, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{item.assignment}</h3>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Observation:</span> {item.observation}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Recommendation:</span> {item.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsCard({ title, value, change, description }) {
  const isPositiveChange = change && change.startsWith("+")

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs flex items-center mt-1">
            <span
              className={isPositiveChange ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
            >
              {change}
            </span>
            <span className="text-muted-foreground ml-1">{description}</span>
          </p>
        )}
        {!change && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

