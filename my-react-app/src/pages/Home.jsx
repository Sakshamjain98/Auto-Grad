import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-6">Assignment Management System</h1>
          <p className="text-xl mb-8">
            A platform for teachers to create assignments and students to submit their work with AI-powered evaluation.
          </p>
          <div className="space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 text-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 text-lg"
                >
                  Login
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 text-lg"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </main>
      
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Teacher Tools</h3>
              <p>Create assignments with questions and model answers. Track student submissions and provide feedback.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Student Portal</h3>
              <p>Access assignments, submit handwritten solutions, and receive AI-generated feedback.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">AI Evaluation</h3>
              <p>Automated analysis of handwritten submissions with Gemini AI integration.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
