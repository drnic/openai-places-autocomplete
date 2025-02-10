# OpenAI Places Autocomplete

A React component that provides place suggestions using OpenAI's GPT model, prioritizing locations in Queensland, Australia, then Australia, and finally worldwide locations.

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
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    if (value.length >= 2) {
      getSuggestions(value)
    } else {
      setSuggestions([])
    }
  }

  const handleSelect = (suggestion) => {
    setQuery(suggestion)
    setSuggestions([])
  }

  const getSuggestions = async (input) => {
    if (!input.trim()) return
    
    setLoading(true)
    try {
      const results = await fetchSuggestions(input)
      setSuggestions(results)
    } catch (error) {
      console.error('Error:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <SearchInput 
        value={query}
        onChange={handleInputChange}
        loading={loading}
      />
      <SuggestionsList 
        suggestions={suggestions}
        onSelect={handleSelect}
      />
    </div>
  )
}
```

4. Update the OpenAI API key in `services/openai.js`:
```javascript
const openai = new OpenAI({
  apiKey: 'your-api-key-here',
  dangerouslyAllowBrowser: true
})
```

## Features

- Real-time place suggestions as you type
- Prioritizes Queensland and Australian locations
- Minimum 2 characters required to trigger suggestions
- Loading state indicator
- Click to select suggestion

## Configuration

You can modify the following in `services/openai.js`:
- OpenAI model (currently using "gpt-4o-mini")
- Temperature setting (controls randomness)
- System prompt to adjust suggestion context
- Number of suggestions returned
