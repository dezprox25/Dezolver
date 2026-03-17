import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@utils/cn'

interface SearchResult {
    id: string
    title: string
    type: 'lab' | 'problem' | 'topic'
    description: string
}

const mockResults: SearchResult[] = [
    { id: '1', title: 'Binary Search Mastery', type: 'lab', description: 'Advanced search algorithms lab' },
    { id: '2', title: 'Two Sum', type: 'problem', description: 'Classic array manipulation problem' },
    { id: '3', title: 'Dynamic Programming', type: 'topic', description: 'Optimization techniques and memoization' },
    { id: '4', title: 'LRU Cache', type: 'lab', description: 'Implementation of cache eviction strategy' },
    { id: '5', title: 'Tree Traversals', type: 'topic', description: 'BFS, DFS, and Morris traversal' },
]

const SearchDropdown = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [isDebouncing, setIsDebouncing] = useState(false)

    const navigate = useNavigate()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setIsOpen(false)
            return
        }

        setIsDebouncing(true)
        const timer = setTimeout(() => {
            const filtered = mockResults.filter(r =>
                r.title.toLowerCase().includes(query.toLowerCase()) ||
                r.description.toLowerCase().includes(query.toLowerCase())
            )
            setResults(filtered)
            setIsOpen(true)
            setActiveIndex(-1)
            setIsDebouncing(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false)
            return
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(prev => (prev > 0 ? prev - 1 : prev))
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0) {
                handleSelect(results[activeIndex])
            } else if (query.trim()) {
                navigate(`/search?q=${query}`)
                setIsOpen(false)
            }
        }
    }

    const handleSelect = (result: SearchResult) => {
        setQuery(result.title)
        setIsOpen(false)
        if (result.type === 'problem') navigate(`/problems/${result.id}`)
        else if (result.type === 'lab') navigate(`/assessment/labs/${result.id}`)
        else navigate(`/topics/${result.id}`)
    }

    return (
        <div className="hidden md:block relative w-96" ref={dropdownRef}>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {isDebouncing ? (
                        <div className="w-4 h-4 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                    ) : (
                        <svg className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="SEARCH REGISTRY..."
                    className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-black focus:shadow-[0px_10px_30px_rgba(0,0,0,0.04)] transition-all placeholder:text-gray-300"
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] shadow-[0px_20px_60px_rgba(0,0,0,0.08)] border border-gray-50 py-4 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    {results.length > 0 ? (
                        <div className="max-h-[400px] overflow-y-auto">
                            <div className="px-6 py-2 mb-2">
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Query Results / Registry</span>
                            </div>
                            {results.map((result, index) => (
                                <div
                                    key={result.id}
                                    onClick={() => handleSelect(result)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={cn(
                                        "px-6 py-4 cursor-pointer transition-all flex items-center justify-between group",
                                        activeIndex === index ? "bg-black text-white" : "hover:bg-gray-50"
                                    )}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-colors",
                                            activeIndex === index ? "bg-white/10 text-white" : "bg-gray-50 text-gray-400"
                                        )}>
                                            {result.type}
                                        </span>
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-black uppercase tracking-tight truncate">{result.title}</h4>
                                            <p className={cn(
                                                "text-[9px] font-bold truncate transition-colors",
                                                activeIndex === index ? "text-gray-400" : "text-gray-400"
                                            )}>{result.description}</p>
                                        </div>
                                    </div>
                                    <svg
                                        className={cn(
                                            "w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform",
                                            activeIndex === index ? "translate-x-0" : "-translate-x-2"
                                        )}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl grayscale">🔍</span>
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-1">Null Results</h3>
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-relaxed">No matches found for "{query}" in current registry protocol.</p>
                        </div>
                    )}

                    <div className="px-6 py-4 mt-2 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-100 rounded text-[8px] font-black text-gray-400">↑↓</kbd>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Navigate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-100 rounded text-[8px] font-black text-gray-400">↵</kbd>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Select</span>
                            </div>
                        </div>
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">System Search 0.1</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchDropdown
