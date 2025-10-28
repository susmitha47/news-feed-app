import React from 'react'

export default function Pagination({ page, setPage, pageSize, totalResults }) {
  const totalPages = Math.ceil((totalResults || 0) / pageSize)
  if (totalPages <= 1) return null
  return (
    <div className="flex gap-2 justify-center mt-6">
      <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
      <span className="px-3 py-1 border rounded">Page {page} / {totalPages}</span>
      <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
    </div>
  )
}
