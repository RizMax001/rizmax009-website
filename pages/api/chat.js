import { Configuration, OpenAIApi } from 'openai';
import config from '../../config';

const configuration = new Configuration({
  apiKey: config.openaiApiKey,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { msg } = req.query;

  if (!msg) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah teman ngobrol yang gaul dan santai.',
        },
        {
          role: 'user',
          content: msg,
        },
      ],
    });

    const reply = completion.data.choices[0].message.content;
    res.status(200).json({
      development: config.creator,
      reply,
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
