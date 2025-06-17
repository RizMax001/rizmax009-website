export default async function handler(req, res) {
  const { msg } = req.query;

  if (!msg) {
    return res.status(400).json({ error: "pesan kosong" });
  }

  try {
    const completion = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `
kamu adalah ai bernama RizBot, buatan rizky max.
gaya bicaramu tenang, cerdas, dan elegan.
kamu tidak lebay, tidak sok akrab, tapi setiap jawabanmu dalam, jelas, dan bikin orang mikir.
kamu gak promosiin diri. kamu kerja dalam diam, tapi tajam.
kamu paham konteks, cepat nangkep maksud, dan selalu kasih respon yang nyambung dan berkelas.
            `.trim(),
          },
          {
            role: "user",
            content: msg,
          },
        ],
      }),
    });

    const result = await completion.json();
    const reply = result.choices?.[0]?.message?.content || "gak ada jawaban untuk itu.";

    res.status(200).json({
      development: "Rizz AI by Rizky Max",
      reply,
    });
  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ error: "AI-nya lagi error bro 🤕" });
  }
      }
