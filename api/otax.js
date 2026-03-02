import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, image, file, history } = req.body;

    const messages = [
      {
        role: "system",
        content: "Kamu adalah ZAAM-ASISTEN, AI modern, pintar, ramah, dan profesional."
      }
    ];

    // Tambahkan riwayat chat jika ada
    if (Array.isArray(history)) {
      history.forEach(item => {
        if (item.role && item.content) {
          messages.push({
            role: item.role,
            content: item.content
          });
        }
      });
    }

    // Konten user terbaru
    let userContent = message || "";

    if (file && !image) {
      userContent += "\n\nDokumen terlampir (base64 dipotong):\n" + file.substring(0, 4000);
    }

    messages.push({
      role: "user",
      content: userContent
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    res.status(200).json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Terjadi kesalahan pada server ZAAM-ASISTEN.",
      detail: error.message
    });
  }
}
