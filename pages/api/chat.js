import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "../../config"; // pastikan path betul

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export default async function handler(req, res) {
  const msg = req.query.msg;

  if (!msg) {
    return res.status(400).json({ error: "Pesan kosong, isi ?msg=halo di URL." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Kamu adalah teman ngobrol gaul dan santai, dibuat oleh Rizky Max."
        },
        {
          role: "user",
          content: msg
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({
      development: "Rizky Max",
      reply
    });
  } catch (error) {
    console.error("OpenAI ERROR:", error);
    res.status(500).json({ error: "Gagal mengambil jawaban dari AI" });
  }
}
