import * as dotenv from 'dotenv';
dotenv.config();

export const generatePictureBase64 = async (prompt: string) => {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "256x256",
        response_format: "b64_json",
      }),
    });
    const prediction = await response.json();
    console.log(prediction);
    const b64 = prediction.data[0].b64_json;
    return b64;
}