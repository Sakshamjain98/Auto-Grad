import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, getDoc, addDoc, updateDoc, query, where, getDocs } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

// User Services
export const userService = {
  async getUserById(userId) {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() }
    }
    return null
  },

  async updateUserProfile(userId, userData) {
    await updateDoc(doc(db, "users", userId), userData)
    return { id: userId, ...userData }
  },

  async getStudentsByTeacher(teacherId) {
    const classroomsQuery = query(collection(db, "classrooms"), where("teacherId", "==", teacherId))
    const classroomsSnapshot = await getDocs(classroomsQuery)

    const students = []
    for (const classroomDoc of classroomsSnapshot.docs) {
      const studentsQuery = query(collection(db, "classroom_students"), where("classroomId", "==", classroomDoc.id))
      const studentsSnapshot = await getDocs(studentsQuery)

      for (const studentDoc of studentsSnapshot.docs) {
        const studentData = studentDoc.data()
        const userDoc = await getDoc(doc(db, "users", studentData.studentId))
        if (userDoc.exists()) {
          students.push({ id: userDoc.id, ...userDoc.data() })
        }
      }
    }

    return students
  },
}

// Classroom Services
export const classroomService = {
  async createClassroom(teacherId, classroomData) {
    const classroomRef = await addDoc(collection(db, "classrooms"), {
      teacherId,
      ...classroomData,
      createdAt: new Date(),
    })

    return { id: classroomRef.id, teacherId, ...classroomData }
  },

  async getClassroomsByTeacher(teacherId) {
    const classroomsQuery = query(collection(db, "classrooms"), where("teacherId", "==", teacherId))
    const classroomsSnapshot = await getDocs(classroomsQuery)

    return classroomsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  },

  async getClassroomsByStudent(studentId) {
    const enrollmentsQuery = query(collection(db, "classroom_students"), where("studentId", "==", studentId))
    const enrollmentsSnapshot = await getDocs(enrollmentsQuery)

    const classrooms = []
    for (const enrollmentDoc of enrollmentsSnapshot.docs) {
      const classroomId = enrollmentDoc.data().classroomId
      const classroomDoc = await getDoc(doc(db, "classrooms", classroomId))

      if (classroomDoc.exists()) {
        classrooms.push({ id: classroomDoc.id, ...classroomDoc.data() })
      }
    }

    return classrooms
  },

  async addStudentToClassroom(classroomId, studentId) {
    await addDoc(collection(db, "classroom_students"), {
      classroomId,
      studentId,
      joinedAt: new Date(),
    })
  },
}

// Assignment Services
export const assignmentService = {
  async createAssignment(teacherId, classroomId, assignmentData) {
    const assignmentRef = await addDoc(collection(db, "assignments"), {
      teacherId,
      classroomId,
      ...assignmentData,
      createdAt: new Date(),
      status: assignmentData.status || "active",
    })

    return { id: assignmentRef.id, teacherId, classroomId, ...assignmentData }
  },

  async getAssignmentsByTeacher(teacherId) {
    const assignmentsQuery = query(collection(db, "assignments"), where("teacherId", "==", teacherId))
    const assignmentsSnapshot = await getDocs(assignmentsQuery)

    return assignmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  },

  async getAssignmentsByClassroom(classroomId) {
    const assignmentsQuery = query(collection(db, "assignments"), where("classroomId", "==", classroomId))
    const assignmentsSnapshot = await getDocs(assignmentsQuery)

    return assignmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  },

  async getAssignmentsByStudent(studentId) {
    // First get all classrooms the student is in
    const enrollmentsQuery = query(collection(db, "classroom_students"), where("studentId", "==", studentId))
    const enrollmentsSnapshot = await getDocs(enrollmentsQuery)

    const assignments = []
    for (const enrollmentDoc of enrollmentsSnapshot.docs) {
      const classroomId = enrollmentDoc.data().classroomId

      // Get assignments for each classroom
      const assignmentsQuery = query(collection(db, "assignments"), where("classroomId", "==", classroomId))
      const assignmentsSnapshot = await getDocs(assignmentsQuery)

      assignmentsSnapshot.docs.forEach((doc) => {
        assignments.push({ id: doc.id, ...doc.data() })
      })
    }

    return assignments
  },

  async uploadAnswerKey(assignmentId, file) {
    const storageRef = ref(storage, `answer_keys/${assignmentId}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    await updateDoc(doc(db, "assignments", assignmentId), {
      answerKeyUrl: downloadURL,
    })

    return downloadURL
  },
}

// Submission Services
export const submissionService = {
  async submitAssignment(studentId, assignmentId, submissionData, file) {
    // Upload the file first
    const storageRef = ref(storage, `submissions/${assignmentId}/${studentId}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    // Create the submission record
    const submissionRef = await addDoc(collection(db, "submissions"), {
      studentId,
      assignmentId,
      fileUrl: downloadURL,
      ...submissionData,
      submittedAt: new Date(),
      status: "pending", // Initial status before grading
    })

    return { id: submissionRef.id, studentId, assignmentId, fileUrl: downloadURL, ...submissionData }
  },

  async getSubmissionsByAssignment(assignmentId) {
    const submissionsQuery = query(collection(db, "submissions"), where("assignmentId", "==", assignmentId))
    const submissionsSnapshot = await getDocs(submissionsQuery)

    return submissionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  },

  async getSubmissionsByStudent(studentId) {
    const submissionsQuery = query(collection(db, "submissions"), where("studentId", "==", studentId))
    const submissionsSnapshot = await getDocs(submissionsQuery)

    return submissionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  },

  async gradeSubmission(submissionId, gradingData) {
    await updateDoc(doc(db, "submissions", submissionId), {
      ...gradingData,
      status: "graded",
      gradedAt: new Date(),
    })

    return { id: submissionId, ...gradingData }
  },
}

// Analytics Services
export const analyticsService = {
  async getStudentPerformance(studentId) {
    const submissionsQuery = query(
      collection(db, "submissions"),
      where("studentId", "==", studentId),
      where("status", "==", "graded"),
    )
    const submissionsSnapshot = await getDocs(submissionsQuery)

    const submissions = submissionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Calculate average score
    const totalScore = submissions.reduce((sum, submission) => sum + submission.score, 0)
    const averageScore = submissions.length > 0 ? totalScore / submissions.length : 0

    // Get assignment details for each submission
    const submissionDetails = []
    for (const submission of submissions) {
      const assignmentDoc = await getDoc(doc(db, "assignments", submission.assignmentId))
      if (assignmentDoc.exists()) {
        submissionDetails.push({
          submission,
          assignment: { id: assignmentDoc.id, ...assignmentDoc.data() },
        })
      }
    }

    return {
      averageScore,
      submissions: submissionDetails,
      totalSubmissions: submissions.length,
    }
  },

  async getClassroomPerformance(classroomId) {
    // Get all assignments for the classroom
    const assignmentsQuery = query(collection(db, "assignments"), where("classroomId", "==", classroomId))
    const assignmentsSnapshot = await getDocs(assignmentsQuery)
    const assignments = assignmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Get all students in the classroom
    const studentsQuery = query(collection(db, "classroom_students"), where("classroomId", "==", classroomId))
    const studentsSnapshot = await getDocs(studentsQuery)
    const studentIds = studentsSnapshot.docs.map((doc) => doc.data().studentId)

    // Get all graded submissions for these assignments
    const assignmentPerformance = []
    for (const assignment of assignments) {
      const submissionsQuery = query(
        collection(db, "submissions"),
        where("assignmentId", "==", assignment.id),
        where("status", "==", "graded"),
      )
      const submissionsSnapshot = await getDocs(submissionsQuery)
      const submissions = submissionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Calculate average score for this assignment
      const totalScore = submissions.reduce((sum, submission) => sum + submission.score, 0)
      const averageScore = submissions.length > 0 ? totalScore / submissions.length : 0

      assignmentPerformance.push({
        assignment,
        averageScore,
        submissionCount: submissions.length,
        totalStudents: studentIds.length,
      })
    }

    return {
      assignments: assignmentPerformance,
      studentCount: studentIds.length,
    }
  },
}

// AI Grading Service
export const aiGradingService = {
  async processSubmission(submissionId) {
    // Get the submission
    const submissionDoc = await getDoc(doc(db, "submissions", submissionId))
    if (!submissionDoc.exists()) {
      throw new Error("Submission not found")
    }

    const submission = { id: submissionDoc.id, ...submissionDoc.data() }

    // Get the assignment to access the answer key
    const assignmentDoc = await getDoc(doc(db, "assignments", submission.assignmentId))
    if (!assignmentDoc.exists()) {
      throw new Error("Assignment not found")
    }

    const assignment = { id: assignmentDoc.id, ...assignmentDoc.data() }

    // This is where you would integrate with Vertex AI
    // For now, we'll simulate the AI grading process

    // Simulate AI grading result
    const gradingResult = {
      score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      feedback: "Good work overall. Some areas for improvement include...",
      detailedFeedback: [
        { section: "Content", score: Math.floor(Math.random() * 30) + 70, feedback: "Content is well-structured." },
        { section: "Accuracy", score: Math.floor(Math.random() * 30) + 70, feedback: "Most answers are correct." },
        { section: "Presentation", score: Math.floor(Math.random() * 30) + 70, feedback: "Clear presentation." },
      ],
      plagiarismScore: Math.floor(Math.random() * 10), // Random score between 0-10
      gradedAt: new Date(),
    }

    // Update the submission with the grading result
    await updateDoc(doc(db, "submissions", submissionId), {
      score: gradingResult.score,
      feedback: gradingResult.feedback,
      detailedFeedback: gradingResult.detailedFeedback,
      plagiarismScore: gradingResult.plagiarismScore,
      status: "graded",
      gradedAt: gradingResult.gradedAt,
    })

    return {
      submission: { id: submissionId, ...submission },
      gradingResult,
    }
  },
}

