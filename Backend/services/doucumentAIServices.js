const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const fs = require('fs');
const path = require('path');

const client = new DocumentProcessorServiceClient();

async function processDocument(filePath) {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    let mimeType;
    
    if (fileExtension === '.pdf') {
      mimeType = 'application/pdf';
    } else {
      throw new Error('Unsupported file type');
    }

    const name = `projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_LOCATION}/processors/${process.env.DOCUMENT_AI_PROCESSOR_ID}`;

    const imageFile = fs.readFileSync(filePath);
    const encodedImage = Buffer.from(imageFile).toString('base64');

    const request = {
      name,
      rawDocument: {
        content: encodedImage,
        mimeType,
      },
    };

    const [result] = await client.processDocument(request);
    const { document } = result;

    let extractedText = '';
    
    if (document.text) {
      extractedText = document.text;
    } else if (document.entities) {
      extractedText = document.entities
        .map(entity => entity.mentionText)
        .join('\n');
    }

    return extractedText;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}

module.exports = { processDocument };