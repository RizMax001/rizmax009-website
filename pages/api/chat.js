import { OpenAI } from "openai";
// pastikan path betul

const openai = new OpenAI({
  apiKey: "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"
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
