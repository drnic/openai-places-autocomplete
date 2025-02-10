import React, { useState, useCallback } from "react";
import SearchInput from "./components/SearchInput";
import SuggestionsList from "./components/SuggestionsList";
import { fetchSuggestions } from "./services/openai";

export default function App() {
  const [firstQuery, setFirstQuery] = useState("");
  const [secondQuery, setSecondQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstPlaceSelected, setFirstPlaceSelected] = useState(false);

  const getSuggestions = useCallback(
    async (input, isSecondSearch = false) => {
      if (!input.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const systemPrompt = isSecondSearch
          ? `You are a helper that returns place suggestions. The user has already selected "${firstQuery}" as their first location. Suggest places that make sense as a second location in relation to the first location. Respond with only a raw JSON array of strings, no markdown formatting or backticks.`
          : "You are a helper that returns place suggestions. Respond with only a raw JSON array of strings, no markdown formatting or backticks.";

        const searchPriorities = isSecondSearch
          ? `Prioritize: 1) Places near ${firstQuery} 2) Places in the same state/region as ${firstQuery} 3) Places in the same country as ${firstQuery}`
          : "Prioritize: 1) Queensland, Australia 2) Australia 3) Worldwide";

        console.log("API call parameters:", {
          systemPrompt,
          searchPriorities,
          input,
          isSecondSearch,
        });

        const results = await fetchSuggestions({
          input,
          systemPrompt,
          searchPriorities,
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
    },
    [firstQuery]
  );

  const handleFirstInputChange = (e) => {
    const value = e.target.value;
    setFirstQuery(value);
    setFirstPlaceSelected(false);
    if (value.length >= 2) {
      getSuggestions(value, false);
    } else {
      setSuggestions([]);
    }
  };

  const handleSecondInputChange = (e) => {
    const value = e.target.value;
    setSecondQuery(value);
    if (value.length >= 2) {
      getSuggestions(value, true);
    } else {
      setSuggestions([]);
    }
  };

  const handleFirstSelect = (suggestion) => {
    setFirstQuery(suggestion);
    setFirstPlaceSelected(true);
    setSuggestions([]); // Clear suggestions without fetching new ones
  };

  const handleSecondSelect = (suggestion) => {
    setSecondQuery(suggestion);
    setSuggestions([]); // Clear suggestions without fetching new ones
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <SearchInput
          value={firstQuery}
          onChange={handleFirstInputChange}
          loading={loading && !firstPlaceSelected}
          placeholder="Enter first location..."
        />
        {!firstPlaceSelected && (
          <SuggestionsList
            suggestions={suggestions}
            onSelect={handleFirstSelect}
          />
        )}
      </div>

      {firstPlaceSelected && (
        <div>
          <SearchInput
            value={secondQuery}
            onChange={handleSecondInputChange}
            loading={loading && firstPlaceSelected}
            placeholder="Enter second location..."
          />
          <SuggestionsList
            suggestions={suggestions}
            onSelect={handleSecondSelect}
          />
        </div>
      )}
    </div>
  );
}
