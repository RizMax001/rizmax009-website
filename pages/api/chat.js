// pages/api/changet sih 😒"
import Tesseract from "tesseract.js";
import fetch from "node-fetch";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const STABLE_DIFFUSION_API = "https://stablediffusionapi.com/api/v4/dreambooth";
const SD_API_KEY = "FLdVXvEPL0B34xpR4P1JJqRfyiqKRWOMnrmeTk5J0wfxLHkkAtkx1tDJUhAQ";

// Sensor kata kasar
function sensorKataKasar(teks) {
  const kataKasar = ["anjing", "bangsat", "kontol", "memek", "titit", "ngentot", "pepek", "jembut", "tai", "goblok", "tolol", "babi"];
  let hasil = teks;
  for (let kata of kataKasar) {
    const regex = new RegExp(`\\b(${kata})\\b`, 'gi');
    hasil = hasil.replace(regex, (match) => match.slice(0, 3) + '***');
  }
  return hasil;
}

// OCR dari buffer gambar
async function bacaGambarBuffer(buffer) {
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, "eng");
    return text.trim();
  } catch (err) {
    console.error("OCR gagal:", err.message);
    return null;
  }
}

// Generate gambar dari prompt
async function generateGambar(prompt) {
  try {
    const res = await fetch(STABLE_DIFFUSION_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key: SD_API_KEY,
        prompt,
        negative_prompt: "blurry, distorted, ugly",
        guidance_scale: 7.5,
        samples: 1,
        num_inference_steps: 25,
        width: 512,
        height: 512,
        safety_checker: "no",
        enhance_prompt: "yes"
      })
    });
    const json = await res.json();
    return json.output?.[0] || null;
  } catch (err) {
    console.error("Generate gambar gagal:", err.message);
    return null;
  }
}

// Parse multipart/form-data
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({ maxFileSize: 5 * 1024 * 1024 });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  let msg = "";
  let imageBuffer = null;

  if (req.method === "POST") {
    try {
      const { fields, files } = await parseForm(req);
      msg = fields.msg || "";
      if (files.image) {
        imageBuffer = fs.readFileSync(files.image.filepath);
      }
    } catch (err) {
      return res.status(400).json({ error: "Gagal parsing form" });
    }
  } else if (req.method === "GET") {
    msg = req.query.msg || "";
    if (req.query.image) {
      try {
        const response = await fetch(req.query.image);
        imageBuffer = await response.buffer();
      } catch (err) {
        return res.status(400).json({ error: "Gagal fetch gambar dari URL" });
      }
    }
  } else {
    return res.status(405).json({ error: "Method tidak diizinkan" });
  }

  let messages = [];
  if (msg) messages.push({ role: "user", content: msg });
  if (imageBuffer) {
    const teksGambar = await bacaGambarBuffer(imageBuffer);
    messages.push({ role: "user", content: teksGambar ? `Isi dari gambar: ${teksGambar}` : "Gambar tidak bisa dibaca." });
  }

  if (messages.length === 0) {
    return res.status(400).json({ error: "Isi msg atau image wajib ada." });
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
              Ingat semua pembicaraan sebelumnya, jangan lost konteks.
              Kalau user bilang "soal tadi" atau "yang di atas", lu harus ngerti itu merujuk ke pesan sebelumnya.
              Gaya ngomong lu tuh kayak anak tongkrongan—gaul, nyeleneh dikit, tapi tetap informatif.
              Kalo ada yang nanya: "Siapa yang bikin lu?" atau "Siapa developermu?", atau intinya tanya yg buat lu itu siapa, jawablah dengan bangga:
              "Gue dibuat sama Rizky Max 😎, alias Muhammad Rizky Alfarizi, si jenius santuy itu."

              
              Kalau dapet gambar, jelasin isinya. Kalau diminta buat gambar kayak "buatkan logo AI", hasilin gambar dan kasih link-nya
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
    let reply = result.choices?.[0]?.message?.content || "Gak ada ide jawabannya bro 😅";
    reply = sensorKataKasar(reply);

    let gambarUrl = null;
    if (/buat.*gambar|logo|desain|lukisan/i.test(msg)) {
      gambarUrl = await generateGambar(msg);
    }

    res.status(200).json({
      development: "Rizky Max (Muhammad Rizky Alfarizi)",
      reply,
      image: gambarUrl || undefined,
    });
  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ error: "AI-nya lagi error bro 🤕" });
  }
}
