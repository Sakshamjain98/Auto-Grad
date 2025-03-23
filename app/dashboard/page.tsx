"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, FileText, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
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

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>

      {user.role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}
    </div>
  )
}

function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Students"
              value="24"
              description="In your classroom"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Active Assignments"
              value="5"
              description="Currently in progress"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Pending Reviews"
              value="12"
              description="Submissions to grade"
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Class Average"
              value="85%"
              description="Overall performance"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Latest assignments submitted by students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Emma Thompson", assignment: "Math Quiz 3", time: "2 hours ago" },
                    { name: "James Wilson", assignment: "Science Report", time: "5 hours ago" },
                    { name: "Sophia Chen", assignment: "History Essay", time: "Yesterday" },
                    { name: "Noah Martinez", assignment: "English Literature", time: "Yesterday" },
                  ].map((submission, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{submission.name}</p>
                        <p className="text-sm text-muted-foreground">{submission.assignment}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{submission.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Class performance on recent assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { assignment: "Math Quiz 3", average: "78%", submissions: "22/24" },
                    { assignment: "Science Report", average: "85%", submissions: "20/24" },
                    { assignment: "History Essay", average: "92%", submissions: "24/24" },
                    { assignment: "English Literature", average: "81%", submissions: "19/24" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.assignment}</p>
                        <span className="font-medium">{item.average}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: item.average }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">{item.submissions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Assignments</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Math Quiz 3", status: "Active", dueDate: "Mar 25, 2025", submissions: "22/24" },
              { title: "Science Report", status: "Active", dueDate: "Mar 28, 2025", submissions: "20/24" },
              { title: "History Essay", status: "Completed", dueDate: "Mar 15, 2025", submissions: "24/24" },
              { title: "English Literature", status: "Active", dueDate: "Apr 2, 2025", submissions: "19/24" },
              { title: "Geography Project", status: "Draft", dueDate: "Apr 10, 2025", submissions: "0/24" },
              { title: "Art Portfolio", status: "Active", dueDate: "Apr 5, 2025", submissions: "15/24" },
            ].map((assignment, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{assignment.title}</CardTitle>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        assignment.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : assignment.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                  <CardDescription>Due: {assignment.dueDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span>Submissions: {assignment.submissions}</span>
                    <Link href="#" className="text-primary hover:underline">
                      View details
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Class Students</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Submissions</th>
                    <th className="text-left p-4">Average Grade</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Emma Thompson", email: "emma.t@example.com", submissions: "5/5", average: "92%" },
                    { name: "James Wilson", email: "james.w@example.com", submissions: "4/5", average: "85%" },
                    { name: "Sophia Chen", email: "sophia.c@example.com", submissions: "5/5", average: "94%" },
                    { name: "Noah Martinez", email: "noah.m@example.com", submissions: "3/5", average: "78%" },
                    { name: "Olivia Johnson", email: "olivia.j@example.com", submissions: "5/5", average: "90%" },
                    { name: "William Brown", email: "william.b@example.com", submissions: "4/5", average: "82%" },
                  ].map((student, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-4">{student.name}</td>
                      <td className="p-4">{student.email}</td>
                      <td className="p-4">{student.submissions}</td>
                      <td className="p-4">{student.average}</td>
                      <td className="p-4">
                        <Link href="#" className="text-primary hover:underline">
                          View profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Assignments"
              value="5"
              description="Total assigned"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Completed"
              value="3"
              description="Assignments submitted"
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Average Grade"
              value="88%"
              description="Overall performance"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Assignments due soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Math Quiz 3", dueDate: "Mar 25, 2025", timeLeft: "2 days left" },
                    { title: "Science Report", dueDate: "Mar 28, 2025", timeLeft: "5 days left" },
                    { title: "English Literature", dueDate: "Apr 2, 2025", timeLeft: "10 days left" },
                  ].map((assignment, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                      </div>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {assignment.timeLeft}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>Your performance on recent assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { assignment: "History Essay", grade: "A (94%)", feedback: "Excellent analysis and research" },
                    {
                      assignment: "Physics Lab Report",
                      grade: "B+ (87%)",
                      feedback: "Good work, minor calculation errors",
                    },
                    {
                      assignment: "Literature Review",
                      grade: "A- (92%)",
                      feedback: "Well-structured with insightful comments",
                    },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.assignment}</p>
                        <span className="font-medium">{item.grade}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.feedback}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Your Assignments</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Math Quiz 3",
                status: "Pending",
                dueDate: "Mar 25, 2025",
                description: "Algebra and calculus problems",
              },
              {
                title: "Science Report",
                status: "Pending",
                dueDate: "Mar 28, 2025",
                description: "Lab experiment analysis",
              },
              {
                title: "History Essay",
                status: "Completed",
                dueDate: "Mar 15, 2025",
                description: "Analysis of historical events",
              },
              {
                title: "English Literature",
                status: "Pending",
                dueDate: "Apr 2, 2025",
                description: "Character analysis essay",
              },
              {
                title: "Art Portfolio",
                status: "Completed",
                dueDate: "Mar 10, 2025",
                description: "Collection of artistic works",
              },
              {
                title: "Physics Lab Report",
                status: "Completed",
                dueDate: "Mar 5, 2025",
                description: "Experiment documentation",
              },
            ].map((assignment, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{assignment.title}</CardTitle>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        assignment.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                  <CardDescription>Due: {assignment.dueDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{assignment.description}</p>
                  <Button className="w-full" variant={assignment.status === "Completed" ? "outline" : "default"}>
                    {assignment.status === "Completed" ? "View Submission" : "Submit Assignment"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsCard({ title, value, description, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

