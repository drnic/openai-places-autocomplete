import React from "react";

export default function SuggestionsList({ suggestions, onSelect }) {
  if (!suggestions?.length) return null;

  return (
    <ul
      style={{
        listStyle: "none",
        padding: "0",
        margin: "8px 0",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          style={{
            padding: "12px",
            borderBottom:
              index < suggestions.length - 1 ? "1px solid #eee" : "none",
            cursor: "pointer",
            backgroundColor: "#fff",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
}
