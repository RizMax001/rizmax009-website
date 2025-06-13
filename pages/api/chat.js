import OpenAI from 'openai';
import config from '../../config';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export default async function handler(req, res) {
  const { msg } = req.query;

  if (!msg) {
    return res.status(400).json({ error: "Pesan (msg) wajib diisi" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Kamu adalah teman ngobrol yang gaul dan santai.' },
        { role: 'user', content: msg },
      ],
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({
  development: "Rizky Max",
  reply: responseDariOpenAI
});

  } catch (error) {
    console.error('OpenAI ERROR:', error.message);
    res.status(500).json({ error: 'Gagal ambil jawaban dari AI' });
  }
}
