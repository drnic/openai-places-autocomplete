import React from "react";

export default function SearchInput({ value, onChange, loading }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search places..."
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
      {loading && (
        <div style={{ position: "absolute", right: "12px", top: "12px" }}>
          Loading...
        </div>
      )}
    </div>
  );
}
