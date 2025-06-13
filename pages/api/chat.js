import { OpenAI } from "openai";
// pastikan path betul

const openai = new OpenAI({
  apiKey: "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"
});

export default async function handler(req, res) {
  const messages = req.body?.messages;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Format pesan tidak valid." });
  }

  try {
    const completion = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: "Kamu adalah teman ngobrol santai buatan Rizky Max." },
          ...messages
        ]
      })
    });

    const data = await completion.json();

    if (!data || !data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Respons tidak valid dari Groq." });
    }

    const reply = data.choices[0].message.content;

    res.status(200).json({
      development: "Rizky Max",
      reply
    });
  } catch (error) {
    console.error("Groq API ERROR:", error);
    res.status(500).json({ error: "Gagal mengambil jawaban dari AI (Groq)" });
  }
        }
