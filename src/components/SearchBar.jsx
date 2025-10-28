import React, { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('')
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 p-2 border rounded bg-white dark:bg-gray-800"
        placeholder="Search news by keyword..."
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        onKeyDown={(e)=>{ if(e.key==='Enter'){ onSearch(value) } }}
      />
      <button className="p-2 bg-blue-600 text-white rounded" onClick={()=>onSearch(value)}>Search</button>
    </div>
  )
}
