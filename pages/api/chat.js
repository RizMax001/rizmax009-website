import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const messageFromUrl = req.query.msg;

  if (!messageFromUrl) {
    return res.status(400).json({ error: 'Pesan (msg) kosong di URL.' });
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah AI teman ngobrol buatan Rizky Max. Gaya kamu santai, gaul, lucu, dan penuh emoji. Jawab seperti anak muda zaman sekarang, jangan formal.',
        },
        {
          role: 'user',
          content: messageFromUrl,
        },
      ],
    });

    const reply = response.data.choices[0].message.content;
    
    res.status(200).json({
      development: 'Rizky Max',
      reply: reply
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memproses permintaan.' });
  }
}