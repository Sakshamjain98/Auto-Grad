const { GoogleGenerativeAI } = require("@google/generative-ai");



async function generateSummary(questionText, answerText, studentSolutionText) {
   // Validate environment variables
   if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
  try {
     // Initialize the Generative AI client
     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Analyze the student's assignment submission:
      
      Assignment Question:
      ${questionText}
      
      Model Answer:
      ${answerText}
      
      Student's Solution:
      ${studentSolutionText}
      
      Provide a detailed analysis with:
      1. Summary of the student's approach
      2. Key strengths
      3. Areas for improvement
      4. Suggested score (0-100)


      Also Provide someresources like youtube videos, articles, etc. to help the student improve.
      Also provide a set of questions to help the student understand the topic better.
      give thumbnails for the resources and questions.
      provide mermaid code for learning path.
      Provide the response in JSON format with the following keys:
      {
        "summaryText": "Summary of the student's approach",
        "strengths": "Key strengths",
        "improvements": "Areas for improvement",
        "score": "Suggested score (0-100)",
        "resources": [
          {
            "title": "Resource Title",
            "url": "https://example.com/resource",
            "thumbnail": "https://example.com/thumbnail.jpg"
          }
        ],
      

    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(result);
    console.log(response.json());
    return response.text();
  } catch (error) {
    console.error('Detailed Gemini Error:', error);
      // Specific error handling
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API key. Please check your credentials in the environment variables.');
      }
  
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

module.exports = { generateSummary };