const express = require('express');
const router = express.Router();
const { protect, teacher, student } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createOrUpdateSubmission,
  getStudentSubmission,
  getSubmissionsForAssignment,
  getSubmissionById,
  downloadSubmissionFile,
  gradeSubmission
} = require('../controllers/submissionController');

// Student submission endpoints
// Correct submission endpoint
router.post(
  '/assignments/:assignmentId/submit',
  protect,
  student,
  upload.single('solutionFile'),
  createOrUpdateSubmission
);


// Other routes remain the same...
router.get('/assignments/:assignmentId/student/:studentId', protect, getStudentSubmission);
router.get('/assignments/:assignmentId/submissions', protect, getSubmissionsForAssignment);
router.put('/submissions/:id/grade', protect, teacher, gradeSubmission);
router.get('/submissions/:id', protect, getSubmissionById);
router.get('/submissions/:id/download', protect, downloadSubmissionFile);

module.exports = router;