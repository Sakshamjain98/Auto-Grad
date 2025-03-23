"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UploadIcon as FileUpload, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function AssignmentsPage() {
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
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>

      {user.role === "teacher" ? <TeacherAssignments /> : <StudentAssignments />}
    </div>
  )
}

function TeacherAssignments() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Assignments</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Assignment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Create a new assignment for your students. Add details and upload an answer key.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title</Label>
                <Input id="title" placeholder="e.g., Math Quiz 3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Provide details about the assignment..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalPoints">Total Points</Label>
                  <Input id="totalPoints" type="number" placeholder="100" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Answer Key</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Drag and drop your answer key file, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">Supports PDF, DOCX, JPG, PNG (max 10MB)</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <FileUpload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Create Assignment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Math Quiz 3",
                dueDate: "Mar 25, 2025",
                submissions: "22/24",
                description: "Algebra and calculus problems covering chapters 5-7.",
              },
              {
                title: "Science Report",
                dueDate: "Mar 28, 2025",
                submissions: "20/24",
                description: "Lab experiment analysis on chemical reactions.",
              },
              {
                title: "English Literature",
                dueDate: "Apr 2, 2025",
                submissions: "19/24",
                description: "Character analysis essay on 'To Kill a Mockingbird'.",
              },
              {
                title: "Art Portfolio",
                dueDate: "Apr 5, 2025",
                submissions: "15/24",
                description: "Collection of artistic works demonstrating various techniques.",
              },
            ].map((assignment, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>Due: {assignment.dueDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{assignment.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Submissions: {assignment.submissions}</span>
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Active
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button size="sm">View Submissions</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Geography Project",
                dueDate: "Not set",
                description: "Research project on climate zones and their impact.",
              },
              {
                title: "Final Exam Review",
                dueDate: "Not set",
                description: "Comprehensive review of all material covered this semester.",
              },
            ].map((assignment, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>Due: {assignment.dueDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{assignment.description}</p>
                  <div className="flex items-center text-sm">
                    <span className="text-amber-600 dark:text-amber-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Draft
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button size="sm">Publish</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "History Essay",
                dueDate: "Mar 15, 2025",
                submissions: "24/24",
                description: "Analysis of historical events and their impact on modern society.",
              },
              {
                title: "Physics Lab Report",
                dueDate: "Mar 5, 2025",
                submissions: "23/24",
                description: "Documentation and analysis of physics experiments.",
              },
              {
                title: "Literature Review",
                dueDate: "Feb 28, 2025",
                submissions: "24/24",
                description: "Critical analysis of selected literary works.",
              },
            ].map((assignment, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>Due: {assignment.dueDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{assignment.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Submissions: {assignment.submissions}</span>
                    <span className="text-blue-600 dark:text-blue-400 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Archive
                  </Button>
                  <Button size="sm">View Results</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StudentAssignments() {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const handleSubmitClick = (assignment) => {
    setSelectedAssignment(assignment)
    setIsSubmitDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                title: "Math Quiz 3",
                dueDate: "Mar 25, 2025",
                timeLeft: "2 days left",
                description: "Algebra and calculus problems covering chapters 5-7.",
              },
              {
                id: 2,
                title: "Science Report",
                dueDate: "Mar 28, 2025",
                timeLeft: "5 days left",
                description: "Lab experiment analysis on chemical reactions.",
              },
              {
                id: 3,
                title: "English Literature",
                dueDate: "Apr 2, 2025",
                timeLeft: "10 days left",
                description: "Character analysis essay on 'To Kill a Mockingbird'.",
              },
            ].map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>Due: {assignment.dueDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{assignment.description}</p>
                  <div className="flex items-center text-sm">
                    <span className="text-amber-600 dark:text-amber-400 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {assignment.timeLeft}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleSubmitClick(assignment)}>
                    Submit Assignment
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 4,
                title: "History Essay",
                dueDate: "Mar 15, 2025",
                grade: "A (94%)",
                description: "Analysis of historical events and their impact on modern society.",
              },
              {
                id: 5,
                title: "Physics Lab Report",
                dueDate: "Mar 5, 2025",
                grade: "B+ (87%)",
                description: "Documentation and analysis of physics experiments.",
              },
              {
                id: 6,
                title: "Literature Review",
                dueDate: "Feb 28, 2025",
                grade: "A- (92%)",
                description: "Critical analysis of selected literary works.",
              },
            ].map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>Due: {assignment.dueDate}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{assignment.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600 dark:text-blue-400 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </span>
                    <span className="font-medium">{assignment.grade}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Feedback
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignment && <>Upload your completed work for {selectedAssignment.title}</>}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Upload Handwritten Assignment</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  Drag and drop your assignment file, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">Supports PDF, DOCX, JPG, PNG (max 10MB)</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <FileUpload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments (Optional)</Label>
              <Textarea id="comments" placeholder="Add any comments for your teacher..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSubmitDialogOpen(false)}>Submit Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

