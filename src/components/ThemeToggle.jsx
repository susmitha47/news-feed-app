import React, { useEffect, useState } from 'react'

export default function ThemeToggle(){
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  useEffect(()=> {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  return (
    <button onClick={()=>setDark(!dark)} className="p-2 border rounded">
      {dark ? '🌙' : '☀️'}
    </button>
  )
}
