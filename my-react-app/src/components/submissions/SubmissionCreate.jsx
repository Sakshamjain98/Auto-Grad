import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import submissionService from '../../api/submissions';
import { useAuth } from '../../context/AuthContext';

const SubmissionCreate = () => {
  const { id: assignmentId } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload a solution file');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const formData = new FormData();
      formData.append('solutionFile', file);
  
      await submissionService.createOrUpdateSubmission(
        assignmentId, // Make sure this is correctly passed
        formData,
        user.token
      );
      
      navigate(`/assignments/${assignmentId}`, {
        state: { message: 'Submission successful!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Submit Assignment Solution</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="solutionFile">
            Your Handwritten Solution (PDF only)
          </label>
          <input
            type="file"
            id="solutionFile"
            name="solutionFile"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Please upload a PDF file of your handwritten solution
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Solution'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/assignments/${assignmentId}`)}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionCreate;