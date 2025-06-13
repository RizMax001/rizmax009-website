import { OpenAI } from "openai";
// pastikan path betul

const openai = new OpenAI({
  apiKey: "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"
});


export default async function handler(req, res) {
  const { msg } = req.query;
  let messages = [];

  if (req.body?.messages) {
    messages = req.body.messages;
  } else if (msg) {
    messages = [{ role: "user", content: msg }];
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Format pesan tidak valid." });
  }

  try {
    const completion = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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", // ⚠️ Jangan tampilkan token asli di publik
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `
              Kamu adalah teman ngobrol santai, ramah, dan informatif.
              Kamu dibuat dan dikembangkan oleh Rizky Max.
              Jika pengguna bertanya siapa pembuatmu, siapa developermu, selalu jawab: "Aku dibuat oleh Rizky Max 😎".
              Gunakan gaya bahasa yang santai dan tidak kaku.
              Kamu Menggunakan bahasa yg gaul jaman sekarang. 
            `, 
          },
          ...messages,
        ],
      }),
    });

    const result = await completion.json();
    const reply = result.choices?.[0]?.message?.content || "Maaf, tidak bisa menjawab saat ini.";

    res.status(200).json({
      development: "Rizky Max",
      reply,
    });
  } catch (error) {
    console.error("Groq ERROR:", error);
    res.status(500).json({ error: "Gagal mengambil jawaban dari AI." });
  }
      }
