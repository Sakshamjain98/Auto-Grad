"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

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
const auth = getAuth(app)
const db = getFirestore(app)

// User type with role
type User = {
  uid: string
  email: string
  role: "teacher" | "student"
  name: string
  school?: string
  class?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Omit<User, "uid" | "email">) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as Omit<User, "uid" | "email">
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            ...userData,
          })
        } else {
          // If no additional data found, just use basic Firebase user info
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            role: "student", // Default role
            name: firebaseUser.displayName || "User",
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData: Omit<User, "uid" | "email">) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), userData)

      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      router.push("/")
    } catch (error) {
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

