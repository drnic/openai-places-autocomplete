import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function fetchSuggestions({
  input,
  systemPrompt = "You are a helper that returns place suggestions.",
  searchPriorities = "Prioritize: 1) Queensland, Australia 2) Australia 3) Worldwide",
  maxSuggestions = 5,
  temperature = 0.1,
}) {
  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: `Return ${maxSuggestions} place suggestions starting with "${input}". ${searchPriorities}.`,
    },
  ];

  console.log("OpenAI request:", {
    model: "gpt-4o",
    messages,
    temperature,
    response_format: { type: "json_object" },
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature,
    response_format: { type: "json_object" },
    function_call: { name: "get_suggestions" },
    functions: [
      {
        name: "get_suggestions",
        parameters: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: { type: "string" },
              description: `Array of exactly ${maxSuggestions} place suggestions`,
            },
          },
          required: ["suggestions"],
        },
      },
    ],
  });

  const content = response.choices[0].message.function_call.arguments;
  console.log("OpenAI raw response:", content);

  const { suggestions } = JSON.parse(content);
  console.log("OpenAI parsed results:", suggestions);

  return suggestions;
}
