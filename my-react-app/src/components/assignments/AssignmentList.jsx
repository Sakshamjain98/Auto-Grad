import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import assignmentService from '../../api/assignments';
import { useAuth } from '../../context/AuthContext';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentService.getAssignments(user.token);
        setAssignments(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [user.token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Assignments</h2>
        {user.role === 'teacher' && (
          <Link
            to="/assignments/create"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Create Assignment
          </Link>
        )}
      </div>
      {assignments.length === 0 ? (
        <div className="text-center py-8">No assignments found</div>
      ) : (
        <div className="space-y-4">
          {assignments?.map((assignment) => (
            <div key={assignment._id} className="border rounded p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    <Link to={`/assignments/${assignment._id}`} className="hover:underline">
                      {assignment.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mt-1">{assignment.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Created by: {assignment.teacher?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {formatDate(assignment.dueDate)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={`${process.env.REACT_APP_API_URL}/api/assignments/${assignment._id}/download/question`}
                    download
                    className="bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300 text-sm"
                  >
                    Download Questions
                  </a>
                  {user.role === 'teacher' && (
                    <a
                      href={`${process.env.REACT_APP_API_URL}/api/assignments/${assignment._id}/download/answer`}
                      download
                      className="bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300 text-sm"
                    >
                      Download Answers
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
