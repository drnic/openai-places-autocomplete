import React, { useState, useCallback } from "react";
import SearchInput from "./components/SearchInput";
import SuggestionsList from "./components/SuggestionsList";
import { fetchSuggestions } from "./services/openai";

export default function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = useCallback(async (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await fetchSuggestions({
        input,
        systemPrompt:
          "You are a helper that returns place suggestions. Respond with only a raw JSON array of strings, no markdown formatting or backticks.",
        searchPriorities:
          "Prioritize: 1) Queensland, Australia 2) Australia 3) Worldwide",
        maxSuggestions: 5,
      });
      console.log("Suggestions received:", results);
      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      getSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]); // Clear suggestions without fetching new ones
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <SearchInput
        value={query}
        onChange={handleInputChange}
        loading={loading}
      />
      <SuggestionsList suggestions={suggestions} onSelect={handleSelect} />
    </div>
  );
}
