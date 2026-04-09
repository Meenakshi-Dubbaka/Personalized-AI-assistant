import "dotenv/config";

const getGroqResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // ✅ Change 1: env variable
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // ✅ Change 2: Groq model
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions", // ✅ Change 3: Groq URL
      options
    );
    const data = await response.json();
    console.log("FULL GROQ RESPONSE:", data);
    if (!data.choices) {
      return "Groq error: " + (data.error?.message || "Unknown error");
    }
    return data.choices[0].message.content;
  } catch (e) {
    console.log(e);
  }
};

export default getGroqResponse;