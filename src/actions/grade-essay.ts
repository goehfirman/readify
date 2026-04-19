"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function gradeEssayAction(
  storyText: string,
  question: string,
  studentAnswer: string,
  referenceAnswer: string
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback: Jika API KEY belum dipasang, gunakan simulasi
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Menggunakan simulasi mock AI grading.");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const isCorrect = studentAnswer.length > 8; // Logika sederhana
      return {
        score: isCorrect ? 100 : 50,
        feedback: isCorrect 
          ? "Wah, jawabanmu sangat detail dan tepat sekali! Kamu hebat! 🌟" 
          : "Jawabanmu sudah cukup baik, tapi akan lebih sempurna kalau lebih lengkap sesuai bacaan. Jangan menyerah ya! 💪",
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Menggunakan gemini-flash-latest sesuai ketersediaan versi API Key
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `Anda adalah seorang guru SD yang sangat ramah, hangat, dan selalu menyemangati murid-murid. 
Evaluasi jawaban murid berikut untuk menguji tes pemahaman membaca (reading comprehension).
    
Teks Cerita:
"${storyText}"

Pertanyaan: 
"${question}"

Jawaban Referensi (Kunci Jawaban Inti yang Diharapkan): 
"${referenceAnswer}"

Jawaban Murid: 
"${studentAnswer}"

Instruksi Penilaian:
1. Evaluasi apakah arti dari jawaban murid menunjukkan pemahaman terhadap ide pokok dari kunci jawaban (tidak harus sama persis kata-katanya). Toleransi kesalahan tata bahasa atau ejaan karena ini anak-anak.
2. Jika jawaban memiliki ide sama, berikan skor 80-100.
3. Jika anak hanya menjawab sebagian saja dengan kata kunci yang relevan, berikan skor parsial (misal 50 - 70).
4. Jika jawabannya tidak relevan sama sekali, berikan skor 10 - 30 (tetap beri poin atas keberanian menjawab).
5. Berikan "feedback" dalam bahasa Indonesia khusus anak-anak yang memotivasi dan seru. Jangan galak. Jika salah arahkan ke teks dengan halus. Jika benar, berikan pujian layaknya guru memberi stiker bintang.
6. Anda WAJIB mengembalikan balasan HANYA dalam bentuk JSON persis seperti skema di bawah ini, tanpa awalan markdown \`\`\`json.

Skema JSON:
{
  "score": <angka_dari_0_sampai_100>,
  "feedback": "<kalimat_komentar_anda>"
}
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text();
    // Sanitasi markdown seandainya model mengabaikan prompt 'tanpa markdown'
    output = output.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    try {
      const parsed = JSON.parse(output);
      return {
        score: typeof parsed.score === 'number' ? parsed.score : parseInt(parsed.score) || 0,
        feedback: parsed.feedback || "Terima kasih sudah menjawab!",
      };
    } catch (parseErr) {
       console.error("Gagal parse keluaran model berformat JSON: ", output);
       return {
          score: 80,
          feedback: "Wah robot guru sedikit kebingungan membacanya! Tapi kamu sudah berani mencoba, hebat!"
       }
    }
    
  } catch (error: any) {
    console.error("Error grading essay with Gemini:", error);
    return {
      score: 50,
      feedback: `Aduh, koneksi internet ke otak guru AI terputus. (Error: ${error?.message || "Unknown"}). Tapi kamu hebat mau mencoba!`,
    };
  }
}
