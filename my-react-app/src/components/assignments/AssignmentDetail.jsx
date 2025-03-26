import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import assignmentService from '../../api/assignments';
import submissionService from '../../api/submissions';
import { useAuth } from '../../context/AuthContext';

const AssignmentDetail = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assignment first
        const assignmentData = await assignmentService.getAssignmentById(id, user.token);
        setAssignment(assignmentData);
        
        // If user is a student, try to fetch submission
        if (user.role === 'student') {
          try {
            const submissionData = await submissionService.getStudentSubmission(
              id, 
              user._id, 
              user.token
            );
            setSubmission(submissionData);
          } catch (submissionErr) {
            // Log the error for debugging
            console.error('Submission Fetch Error:', submissionErr);
            
            // If submission is not found, it's not a critical error for students
            if (submissionErr.response?.status === 404) {
              console.log('No existing submission for this assignment');
              setSubmission(null);
            } else {
              // For other errors, set an error message
              setError('Failed to fetch submission data');
            }
          } finally {
            setLoading(false);
          }
        } else {
          // For non-student roles, stop loading
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching assignment:', err);
        setError(err.response?.data?.message || 'Failed to fetch assignment');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user.token, user.role, user._id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmitClick = () => {
    navigate(`/assignments/${id}/submit`);
  };

  // Loading state
  if (loading) return <div className="text-center py-8">Loading...</div>;

  // Error state
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  // Assignment not found
  if (!assignment) return <div className="text-center py-8">Assignment not found</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Assignment Details Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{assignment.title}</h2>
        <p className="text-gray-600 mt-2">{assignment.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Created by:</span> {assignment.teacher?.name || 'Unknown'}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Due:</span> {formatDate(assignment.dueDate)}
          </p>
          {new Date(assignment.dueDate) < new Date() && (
            <span className="text-sm text-red-500 font-medium">(Deadline passed)</span>
          )}
        </div>
      </div>

      {/* Assignment Files Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Assignment Files</h3>
        <div className="flex flex-wrap gap-4">
          <a
            href={`${process.env.REACT_APP_API_URL}/api/submit/assignments/${assignment._id}/download/question`}
            download={`${assignment.title}_Questions.pdf`}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Download Questions
          </a>
          {user.role === 'teacher' && (
            <a
              href={`${process.env.REACT_APP_API_URL}/api/submit/assignments/${assignment._id}/download/answer`}
              download={`${assignment.title}_Answers.pdf`}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Download Answer Key
            </a>
          )}
        </div>
      </div>

      {/* Teacher Submission View */}
      {user.role === 'teacher' && (
        <div className="mb-6">
          <Link
            to={`/assignments/${assignment._id}/submissions`}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            View All Submissions
          </Link>
        </div>
      )}

      {/* Student Submission Section */}
      {user.role === 'student' && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Your Submission</h3>
          
          {/* Submission Status Conditional Rendering */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  {submission ? 'Submission Exists' : 'Submission Required'}
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    {submission 
                      ? 'You have already submitted this assignment.' 
                      : 'You haven\'t submitted this assignment yet. Please upload your solution.'}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleSubmitClick}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                  >
                    {submission ? 'Update Submission' : 'Submit Your Solution Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Existing Submission Details (if exists) */}
          {submission && (
            <div className="mt-6 border rounded p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Submitted on:</span> {formatDate(submission.submittedAt)}
                  </p>
                  {submission.grade && (
                    <p className="text-lg font-semibold mt-2">
                      <span className="font-medium">Grade:</span> {submission.grade}%
                    </p>
                  )}
                  {submission.feedback && (
                    <div className="mt-2">
                      <h4 className="font-semibold">Teacher Feedback:</h4>
                      <p className="text-gray-700 mt-1 p-2 bg-white rounded">
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                  <div className="mt-4">
                    <h4 className="font-semibold">AI Analysis:</h4>
                    <div className="bg-white p-3 rounded mt-2 whitespace-pre-wrap">
                      {submission.summary}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <a
                    href={`${process.env.REACT_APP_API_URL}/api/submit/submissions/${submission._id}/download`}
                    download={`${assignment.title}_Your_Solution.pdf`}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
                  >
                    Download Your Submission
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentDetail;