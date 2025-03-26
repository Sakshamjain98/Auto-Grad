const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const { processDocument } = require('../services/doucumentAIServices');
const { generateSummary } = require('../services/geminiServices');
const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Create a new submission
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
const createSubmission = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Only students can submit assignments');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a solution file');
  }

  // Check if student has already submitted
  const existingSubmission = await Submission.findOne({
    assignment: assignment._id,
    student: req.user._id,
  });

  if (existingSubmission) {
    res.status(400);
    throw new Error('You have already submitted this assignment');
  }

  // Process the handwritten solution
  const solutionFilePath = req.file.path;
  const extractedText = await processDocument(solutionFilePath);

  // Generate summary using Gemini
  const summary = await generateSummary(
    assignment.questionText,
    assignment.answerText,
    extractedText
  );

  const submission = await Submission.create({
    assignment: assignment._id,
    student: req.user._id,
    solutionFile: req.file.filename,
    extractedText,
    summary,
  });

  res.status(201).json(submission);
});

// @desc    Get submissions for an assignment (teacher view)
// @route   GET /api/assignments/:id/submissions
// @access  Private/Teacher
const getSubmissionsForAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  // Check if the requesting teacher is the owner of the assignment
  if (assignment.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view submissions for this assignment');
  }

  const submissions = await Submission.find({ assignment: assignment._id })
    .populate('student', 'name email');

  res.json(submissions);
});

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate('student', 'name email')
    .populate('assignment', 'title description');

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  // Check authorization
  if (req.user.role === 'student' && submission.student._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this submission');
  }

  if (req.user.role === 'teacher') {
    const assignment = await Assignment.findById(submission.assignment._id);
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this submission');
    }
  }

  res.json(submission);
});

// @desc    Download submission file
// @route   GET /api/submissions/:id/download
// @access  Private
const downloadSubmissionFile = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  // Check authorization
  if (req.user.role === 'student' && submission.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to download this submission');
  }

  if (req.user.role === 'teacher') {
    const assignment = await Assignment.findById(submission.assignment);
    if (assignment.teacher.toString() !== req.user._id.toString()) {
res.status(403);
      throw new Error('Not authorized to download this submission');
    }
  }

  const filePath = path.join(__dirname, '../../uploads/submissions', submission.solutionFile);
  res.download(filePath);
});

// @desc    Add grade and feedback to submission
// @route   PUT /api/submissions/:id/grade
// @access  Private/Teacher
const gradeSubmission = asyncHandler(async (req, res) => {
  const { grade, feedback } = req.body;
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  const assignment = await Assignment.findById(submission.assignment);

  // Check if the requesting teacher is the owner of the assignment
  if (assignment.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to grade this submission');
  }

  submission.grade = grade;
  submission.feedback = feedback;
  await submission.save();

  res.json(submission);
});

module.exports = {
  createSubmission,
  getSubmissionsForAssignment,
  getSubmissionById,
  downloadSubmissionFile,
  gradeSubmission,
};