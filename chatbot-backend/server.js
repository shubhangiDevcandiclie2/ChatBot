const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Sample data for chatbot responses
const chatbotResponses = {
  hiring: "We are currently hiring! Please visit our Careers page to learn more about open positions.",
  companyInfo: "We are a leading tech company focused on providing innovative solutions to our customers. Our mission is to deliver high-quality products and services.",
  support: "For support, please visit our Support page or contact us at support@company.com.",
  default: "I'm sorry, I didn't understand that. Can you please rephrase your question?"
};

// Endpoint to handle chat queries
app.post('/chat', (req, res) => {
  const userQuery = req.body.query.toLowerCase();

  // Check the user query and send an appropriate response
  let responseMessage;

  if (userQuery.includes('hiring') || userQuery.includes('careers')) {
    responseMessage = chatbotResponses.hiring;
  } else if (userQuery.includes('company') || userQuery.includes('about')) {
    responseMessage = chatbotResponses.companyInfo;
  } else if (userQuery.includes('support') || userQuery.includes('help')) {
    responseMessage = chatbotResponses.support;
  } else {
    responseMessage = chatbotResponses.default;
  }

  res.json({ response: responseMessage });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
