import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message, chatHistory } = req.body;

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are EcoEarn, an AI assistant for an eco-friendly rewards app. Greet the user warmly and help them with questions about recycling, sustainability, and the app's features." },
          ...chatHistory,
          { role: "user", content: message }
        ],
      });

      res.status(200).json({ reply: completion.data.choices[0].message.content });
    } catch (error) {
      console.error('OpenAI API error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}