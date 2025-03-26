import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assignmentData = await assignmentService.getAssignmentById(id, user.token);
        setAssignment(assignmentData);
        
        if (user.role === 'student') {
          try {
            const submissionData = await submissionService.getSubmissionById(
              assignmentData._id,
              user.token
            );
            setSubmission(submissionData);
          } catch (submissionErr) {
            // Submission not found is okay
            if (submissionErr.response?.status !== 404) {
              throw submissionErr;
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch assignment');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user.token, user.role]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!assignment) return <div className="text-center py-8">Assignment not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{assignment.title}</h2>
        <p className="text-gray-600 mt-2">{assignment.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          Created by: {assignment.teacher?.name || 'Unknown'}
        </p>
        <p className="text-sm text-gray-500">
          Due: {formatDate(assignment.dueDate)}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Assignment Files</h3>
        <div className="flex space-x-4">
          <a
            href={`${process.env.REACT_APP_API_URL}/api/assignments/${assignment._id}/download/question`}
            download
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Download Questions
          </a>
          {user.role === 'teacher' && (
            <a
              href={`${process.env.REACT_APP_API_URL}/api/assignments/${assignment._id}/download/answer`}
              download
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Download Answers
            </a>
          )}
        </div>
      </div>

      {user.role === 'teacher' && (
        <div className="mb-6">
          <Link
            to={`/assignments/${assignment._id}/submissions`}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            View Submissions
          </Link>
        </div>
      )}

      {user.role === 'student' && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Your Submission</h3>
          {submission ? (
            <div className="border rounded p-4">
              <p className="text-gray-600">
                Submitted on: {formatDate(submission.submittedAt)}
              </p>
              {submission.grade && (
                <p className="text-lg font-semibold mt-2">
                  Grade: {submission.grade}%
                </p>
              )}
              {submission.feedback && (
                <div
className="mt-2">
                  <h4 className="font-semibold">Feedback:</h4>
                  <p className="text-gray-700">{submission.feedback}</p>
                </div>
              )}
              <div className="mt-4">
                <h4 className="font-semibold">AI Analysis:</h4>
                <div className="bg-gray-50 p-3 rounded mt-2 whitespace-pre-wrap">
                  {submission.summary}
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={`${process.env.REACT_APP_API_URL}/api/submissions/${submission._id}/download`}
                  download
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Download Your Solution
                </a>
              </div>
            </div>
          ) : (
            <div>
              <Link
                to={`/assignments/${assignment._id}/submit`}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Submit Your Solution
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentDetail;
