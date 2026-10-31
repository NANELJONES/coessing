"use client"
import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react'

const SchoolContext = createContext()
const CACHE_KEY = 'schools_cache'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export const useSchoolContext = () => {
  const context = useContext(SchoolContext)
  if (!context) {
    throw new Error('useSchoolContext must be used within a SchoolProvider')
  }
  return context
}

const readCache = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp, hasMore } = JSON.parse(raw)
    if (!Array.isArray(data) || !timestamp) return null
    if (Date.now() - timestamp >= CACHE_TTL_MS) return null
    return { data, hasMore: Boolean(hasMore) }
  } catch {
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

const writeCache = (data, hasMore) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      hasMore,
      timestamp: Date.now(),
    })
  )
}

export const SchoolProvider = ({ children }) => {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const hasFetchedRef = useRef(false)
  const fetchingRef = useRef(false)

  const fetchSchools = useCallback(async ({ force = false } = {}) => {
    if (!force && (hasFetchedRef.current || fetchingRef.current)) return

    fetchingRef.current = true
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/schools?minimal=true&limit=50')
      const data = await response.json()

      if (data.success) {
        const list = data.data || []
        const more = Boolean(data.hasMore)
        setSchools(list)
        setHasMore(more)
        hasFetchedRef.current = true
        writeCache(list, more)
      } else {
        setError(data.message || 'Failed to fetch schools')
      }
    } catch (err) {
      console.error('Error fetching schools:', err)
      setError('Failed to fetch schools')
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    const cached = readCache()
    if (cached) {
      setSchools(cached.data)
      setHasMore(cached.hasMore)
      setLoading(false)
      hasFetchedRef.current = true
      return
    }

    fetchSchools()
  }, [fetchSchools])

  const loadMoreSchools = useCallback(async () => {
    if (loadingMore || !hasMore) return

    try {
      setLoadingMore(true)
      const response = await fetch('/api/schools?minimal=true&limit=100')
      const data = await response.json()

      if (data.success) {
        const list = data.data || []
        setSchools(list)
        setHasMore(false)
        writeCache(list, false)
      }
    } catch (err) {
      console.error('Error loading more schools:', err)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore])

  const memoizedSchools = useMemo(() => schools, [schools])

  const value = {
    schools: memoizedSchools,
    loading,
    error,
    hasMore,
    loadingMore,
    loadMoreSchools,
    refreshSchools: () => fetchSchools({ force: true }),
  }

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  )
}
