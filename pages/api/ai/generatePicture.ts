import * as dotenv from 'dotenv';
dotenv.config();

export const generatePicture = async (prompt: string) => {
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
      }),
    });
    const prediction = await response.json();
    console.log(prediction);
    const picture = prediction.data[0].url;
    return picture;
}