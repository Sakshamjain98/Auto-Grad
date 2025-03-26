const express = require('express');
const router = express.Router();
const { protect, teacher, student } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createSubmission,
  getSubmissionsForAssignment,
  getSubmissionById,
  downloadSubmissionFile,
  gradeSubmission,
} = require('../controllers/submissionController');

router.route('/:id/submit')
  .post(protect, student, upload.single('solutionFile'), createSubmission);

router.route('/:id/submissions')
  .get(protect, teacher, getSubmissionsForAssignment);

router.route('/submissions/:id')
  .get(protect, getSubmissionById);

router.get('/submissions/:id/download', protect, downloadSubmissionFile);

router.put('/submissions/:id/grade', protect, teacher, gradeSubmission);

module.exports = router;