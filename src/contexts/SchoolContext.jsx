"use client"
import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'

const SchoolContext = createContext()

export const useSchoolContext = () => {
  const context = useContext(SchoolContext)
  if (!context) {
    throw new Error('useSchoolContext must be used within a SchoolProvider')
  }
  return context
}

export const SchoolProvider = ({ children }) => {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(false) // Start as false, only fetch when needed
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const pathname = usePathname()
  const hasFetchedRef = useRef(false)
  const fetchingRef = useRef(false)

  // Only fetch if not on /schools page (that page handles its own fetching)
  // And only fetch once when actually needed
  useEffect(() => {
    // Skip fetch if on /schools page
    if (pathname?.startsWith('/schools')) {
      return
    }

    // Check cache first
    const cachedData = localStorage.getItem('schools_cache')
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData)
        // Cache valid for 1 hour
        if (Date.now() - timestamp < 3600000) {
          setSchools(data)
          setHasMore(data.length === 10) // Assuming initial limit was 10
          hasFetchedRef.current = true
          return
        }
      } catch (e) {
        console.error('Error parsing cache', e)
        localStorage.removeItem('schools_cache')
      }
    }

    if (hasFetchedRef.current || fetchingRef.current) return

    // Lazy fetch - only when context is actually used
    const fetchSchools = async () => {
      fetchingRef.current = true
      try {
        setLoading(true)
        const response = await fetch('/api/schools?minimal=true&limit=10')
        const data = await response.json()
        
        if (data.success) {
          setSchools(data.data)
          setHasMore(data.hasMore || data.data.length === 10)
          hasFetchedRef.current = true
          
          // Save to cache
          localStorage.setItem('schools_cache', JSON.stringify({
            data: data.data,
            timestamp: Date.now()
          }))
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Failed to fetch schools')
        console.error('Error fetching schools:', err)
      } finally {
        setLoading(false)
        fetchingRef.current = false
      }
    }

    // Small delay to check if context is actually needed
    const timer = setTimeout(() => {
      fetchSchools()
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  // Function to load more schools
  const loadMoreSchools = async () => {
    if (loadingMore || !hasMore) return
    
    try {
      setLoadingMore(true)
      console.log('Loading more schools...')
      // Fetch remaining schools
      const response = await fetch('/api/schools?minimal=true&limit=50')
      const data = await response.json()
      console.log('Load more API Response:', data)
      
      if (data.success) {
        setSchools(data.data)
        setHasMore(false) // All schools loaded
      }
    } catch (err) {
      console.error('Error loading more schools:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  const memoizedSchools = useMemo(() => schools, [schools])

  const value = {
    schools: memoizedSchools,
    loading,
    error,
    hasMore,
    loadingMore,
    loadMoreSchools
  }

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  )
}
