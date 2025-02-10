# OpenAI Places Autocomplete

A React component that provides place suggestions using OpenAI's GPT model, prioritizing locations in Queensland, Australia, then Australia, and finally worldwide locations. It also supports a second contextual search based on the first selected location.

## Demo Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Using the Component in Your Project

1. Install required dependencies:
```bash
npm install openai react
```

2. Copy the following files to your project:
- `src/components/SearchInput.jsx`
- `src/components/SuggestionsList.jsx`
- `src/services/openai.js`

3. Import and use the component:
```jsx
import React, { useState } from 'react'
import SearchInput from './components/SearchInput'
import SuggestionsList from './components/SuggestionsList'
import { fetchSuggestions } from './services/openai'

function YourComponent() {
  const [firstQuery, setFirstQuery] = useState('')
  const [secondQuery, setSecondQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [firstPlaceSelected, setFirstPlaceSelected] = useState(false)

  const getSuggestions = async (input, isSecondSearch = false) => {
    if (!input.trim()) return

    setLoading(true)
    try {
      const results = await fetchSuggestions({
        input,
        systemPrompt: isSecondSearch
          ? `You are a helper that returns place suggestions. The user has already selected "${firstQuery}" as their first location. Suggest places that make sense as a second location in relation to the first location.`
          : "You are a helper that returns place suggestions.",
        searchPriorities: isSecondSearch
          ? `Prioritize: 1) Places near ${firstQuery} 2) Places in the same state/region as ${firstQuery} 3) Places in the same country as ${firstQuery}`
          : "Prioritize: 1) Queensland, Australia 2) Australia 3) Worldwide",
        maxSuggestions: 5
      })
      setSuggestions(results)
    } catch (error) {
      console.error('Error:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleFirstInputChange = (e) => {
    const value = e.target.value
    setFirstQuery(value)
    setFirstPlaceSelected(false)
    if (value.length >= 2) {
      getSuggestions(value, false)
    } else {
      setSuggestions([])
    }
  }

  const handleSecondInputChange = (e) => {
    const value = e.target.value
    setSecondQuery(value)
    if (value.length >= 2) {
      getSuggestions(value, true)
    } else {
      setSuggestions([])
    }
  }

  const handleFirstSelect = (suggestion) => {
    setFirstQuery(suggestion)
    setFirstPlaceSelected(true)
    setSuggestions([])
  }

  const handleSecondSelect = (suggestion) => {
    setSecondQuery(suggestion)
    setSuggestions([])
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
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
  )
}
```

4. Update the OpenAI API key in your environment variables:
```
VITE_OPENAI_API_KEY=your-api-key-here
```

## Features

- Real-time place suggestions as you type
- Two-stage location search:
  - First search prioritizes Queensland and Australian locations
  - Second search prioritizes locations relative to the first selected place
- Contextual suggestions based on first selected location
- Minimum 2 characters required to trigger suggestions
- Loading state indicator
- Click to select suggestion

## Configuration

The `fetchSuggestions` function in `services/openai.js` accepts the following options:

```javascript
{
  input: string,            // The search text
  systemPrompt?: string,    // Custom system prompt for the AI
  searchPriorities?: string, // Priority order for location suggestions
  maxSuggestions?: number,  // Number of suggestions to return (default: 5)
  temperature?: number      // Controls randomness of suggestions (default: 0.1)
}
```

You can also modify:
- OpenAI model (currently using "gpt-4o")
- Temperature setting (controls randomness)
