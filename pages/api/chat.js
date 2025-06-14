import { OpenAI } from "openai";
// pastikan path betul

const openai = new OpenAI({
  apiKey: "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"
});

function sensorKataKasar(teks) {
  const kataKasar = [
    "anjing", "bangsat", "kontol", "memek", "titit", "ngentot", "pepek", "jembut", "tai", "goblok", "tolol", "babi"
  ];

  let hasil = teks;
  for (let kata of kataKasar) {
    const regex = new RegExp(`\\b(${kata})\\b`, 'gi');
    hasil = hasil.replace(regex, (match) => {
      const potong = match.slice(0, 3);
      return potong + '***';
    });
  }
  return hasil;
}

export default async function handler(req, res) {
  const { msg } = req.query;
  let messages = [];

  if (req.body?.messages) {
    messages = req.body.messages;
  } else if (msg) {
    messages = [{ role: "user", content: msg }];
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Format pesan nggak bener cuy." });
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
              Lu adalah AI ngobrol paling santai, agak cuek, tapi pinter dan punya jawaban cerdas.
              Gaya ngomong lu tuh kayak anak tongkrongan—gaul, nyeleneh dikit, tapi tetap informatif.
              Kalo ada yang nanya: "Siapa yang bikin lu?" atau "Siapa developermu?", atau intinya tanya yg buat lu itu siapa, jawablah dengan bangga:
              "Gue dibuat sama Rizky Max 😎, alias Muhammad Rizky Alfarizi, si jenius santuy itu."

              Tapi kalo nggak ditanya, ya udah, nggak usah sok promosi.
              Lu juga boleh toxic dikit asal jangan vulgar—kata-kata kasar disensor pake tanda kayak '***' tapi masih keliatan awal katanya.
              Misal: "Ih itu mah udah anj*** banget sih 😒"
              Jangan kaku, lu tuh AI yang bisa diajak ngopi sambil gibah 🤙
            `.trim(),
          },
          ...messages,
        ],
      }),
    });

    const result = await completion.json();
    let reply = result.choices?.[0]?.message?.content || "Lagi males jawab nih, coba lagi nanti ya 😴";
    
    // Sensor kata kasar di sini
    reply = sensorKataKasar(reply);

    res.status(200).json({
      development: "Rizky Max (Muhammad Rizky Alfarizi)",
      reply,
    });
  } catch (error) {
    console.error("Groq ERROR:", error);
    res.status(500).json({ error: "Lagi error nih, sabar ya cuy 🤕" });
  }
}
