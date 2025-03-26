import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assignmentService from '../../api/assignments';
import { useAuth } from '../../context/AuthContext';

const AssignmentCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [questionFile, setQuestionFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, type) => {
    if (type === 'question') {
      setQuestionFile(e.target.files[0]);
    } else {
      setAnswerFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!questionFile || !answerFile) {
      setError('Please upload both question and answer files');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('dueDate', formData.dueDate);
      data.append('questionFile', questionFile);
      data.append('answerFile', answerFile);

      await assignmentService.createAssignment(data, user.token);
      navigate('/assignments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Create Assignment</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="dueDate">
            Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="questionFile">
            Question File (PDF)
          </label>
          <input
            type="file"
            id="questionFile"
            name="questionFile"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'question')}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="answerFile">
            Answer File (PDF)
          </label>
          <input
            type="file"
            id="answerFile"
            name="answerFile"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, 'answer')}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Assignment'}
        </button>
      </form>
    </div>
  );
};

export default AssignmentCreate;