const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_APPLICATION_CREDENTIALS);

async function generateSummary(questionText, answerText, studentSolutionText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert teacher evaluating a student's assignment submission.
      
      Here is the assignment question:
      ${questionText}
      
      Here is the model answer:
      ${answerText}
      
      Here is the student's handwritten solution (extracted text):
      ${studentSolutionText}
      
      Please analyze the student's submission and provide:
      1. A summary of the student's solution
      2. Key points they got correct
      3. Areas for improvement
      4. Suggested feedback for the student
      5. A percentage score estimate based on completeness and accuracy
      
      Format your response as follows:
      Summary: [summary here]
      Correct Points: [bullet points]
      Improvements: [bullet points]
      Feedback: [detailed feedback]
      Score Estimate: [percentage]%
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    throw error;
  }
}

module.exports = { generateSummary };