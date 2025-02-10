import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function fetchSuggestions({
  input,
  systemPrompt = "You are a helper that returns place suggestions. Respond with only a raw JSON array of strings, no markdown formatting or backticks.",
  searchPriorities = "Prioritize: 1) Queensland, Australia 2) Australia 3) Worldwide",
  maxSuggestions = 5,
}) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Return a raw JSON array of exactly ${maxSuggestions} suggestions starting with "${input}". ${searchPriorities}. Example format: ["Brisbane", "Bundaberg", "Byron Bay", "Berlin", "Boston"]`,
      },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content.trim();
  console.log("OpenAI response:", content);

  // Remove any markdown formatting if present
  const cleanJson = content.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanJson);
}
