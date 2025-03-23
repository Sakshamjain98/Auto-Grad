import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, GraduationCap, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">AI-Powered Classroom Assistant</h1>
            <p className="text-xl md:text-2xl mb-8">
              Streamline assignment management and grading with our intelligent platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/auth/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Classroom Management"
              description="Create and manage classrooms, students, and assignments with ease."
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10" />}
              title="AI-Powered Grading"
              description="Automated grading with Vertex AI for handwritten assignments."
            />
            <FeatureCard
              icon={<GraduationCap className="h-10 w-10" />}
              title="Performance Analytics"
              description="Detailed insights into student performance and progress."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} AI-Powered Classroom Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-card-foreground">{description}</p>
    </div>
  )
}

