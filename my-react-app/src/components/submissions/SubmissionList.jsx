import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import submissionService from '../../api/submissions';
import { useAuth } from '../../context/AuthContext';

const SubmissionList = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await submissionService.getSubmissionsForAssignment(id, user.token);
        setSubmissions(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [id, user.token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link
          to={`/assignments/${id}`}
          className="text-blue-600 hover:underline"
        >
          &larr; Back to Assignment
        </Link>
        <h2 className="text-2xl font-bold mt-4">Submissions</h2>
      </div>
      {submissions.length === 0 ? (
        <div className="text-center py-8">No submissions found</div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission._id} className="border rounded p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {submission.student?.name || 'Unknown Student'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Submitted on: {formatDate(submission.submittedAt)}
                  </p>
                  {submission.grade && (
                    <p className="text-lg font-semibold mt-2">
                      Grade: {submission.grade}%
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/submissions/${submission._id}`}
                    className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 text-sm"
                  >
                    View Details
                  </Link>
                  <a
                    href={`http://localhost:5000/api/submissions/${submission._id}/download`}
                    download
                    className="bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300 text-sm"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionList;
