import React from 'react'

export default function NewsCard({ article }) {
  const { title, urlToImage, description, url, source, publishedAt } = article
  return (
    <a href={url} target="_blank" rel="noreferrer" className="block border rounded overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition">
      {urlToImage ? <img src={urlToImage} alt={title} className="w-full h-44 object-cover" /> : <div className="w-full h-44 bg-gray-200 flex items-center justify-center">No Image</div>}
      <div className="p-3">
        <h2 className="font-semibold text-lg line-clamp-2">{title}</h2>
        <p className="text-sm mt-2 line-clamp-3">{description}</p>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
          <span>{source?.name || 'Unknown'}</span>
          <span>{new Date(publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </a>
  )
}
