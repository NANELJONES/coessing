"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HiLocationMarker } from 'react-icons/hi'

const PAGE_SIZE = 10

const SchoolsPage = () => {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [skip, setSkip] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState({
    year: '',
    country: '',
    status: ''
  })
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    years: [],
    countries: [],
    statuses: []
  })
  
  const sentinelRef = useRef(null)
  const skipRef = useRef(0)
  const seenIdsRef = useRef(new Set())
  const fetchingRef = useRef(false)
  const filtersRef = useRef(filters)

  // Keep filtersRef in sync
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  // Fetch filter options and initial schools in parallel
  useEffect(() => {
    let mounted = true
    
    const fetchData = async () => {
      try {
        // Fetch both filters and initial schools in parallel
        const [filtersResponse, schoolsResponse] = await Promise.all([
          fetch('/api/schools/filters'),
          fetch(`/api/schools?limit=${PAGE_SIZE}&skip=0`)
        ])
        
        const [filtersData, schoolsData] = await Promise.all([
          filtersResponse.json(),
          schoolsResponse.json()
        ])
        
        if (!mounted) return
        
        if (filtersData.success) {
          setFilterOptions(filtersData.data)
        }
        
        if (schoolsData.success) {
          // Deduplicate
          const uniqueSchools = schoolsData.data.filter(school => {
            const id = school.id || school.slug
            if (seenIdsRef.current.has(id)) {
              return false
            }
            seenIdsRef.current.add(id)
            return true
          })
          setSchools(uniqueSchools)
          setHasMore(schoolsData.hasMore)
          skipRef.current = uniqueSchools.length
          setSkip(skipRef.current)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    
    return () => {
      mounted = false
    }
  }, [])

  // Fetch schools with filters
  const fetchSchools = useCallback(async (reset = false) => {
    // Prevent duplicate fetches
    if (fetchingRef.current) return
    if (loadingMore && !reset) return
    
    fetchingRef.current = true
    const currentSkip = reset ? 0 : skipRef.current
    setLoadingMore(true)
    
    try {
      const currentFilters = filtersRef.current
      const params = new URLSearchParams({
        limit: PAGE_SIZE.toString(),
        skip: currentSkip.toString()
      })
      
      if (currentFilters.year) params.append('year', currentFilters.year)
      if (currentFilters.country) params.append('country', currentFilters.country)
      if (currentFilters.status) params.append('status', currentFilters.status)
      
      const response = await fetch(`/api/schools?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        // Deduplicate schools by ID or slug
        const uniqueSchools = data.data.filter(school => {
          const id = school.id || school.slug
          if (reset) {
            seenIdsRef.current.clear()
          }
          if (seenIdsRef.current.has(id)) {
            return false
          }
          seenIdsRef.current.add(id)
          return true
        })
        
        if (reset) {
          setSchools(uniqueSchools)
        } else {
          setSchools(prev => {
            // Additional deduplication when appending
            const existingIds = new Set(prev.map(s => s.id || s.slug))
            const newSchools = uniqueSchools.filter(s => !existingIds.has(s.id || s.slug))
            return [...prev, ...newSchools]
          })
        }
        setHasMore(data.hasMore)
        skipRef.current = currentSkip + uniqueSchools.length
        setSkip(skipRef.current)
      } else {
        setError(data.message)
      }
    } catch (err) {
      console.error('Error fetching schools:', err)
      setError('Failed to fetch schools')
    } finally {
      setLoadingMore(false)
      setLoading(false)
      fetchingRef.current = false
    }
  }, [loadingMore])

  // Fetch when filters change (skip initial fetch since it's handled above)
  const isInitialMount = useRef(true)
  useEffect(() => {
    // Skip initial mount - already handled in the parallel fetch above
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    skipRef.current = 0
    setSkip(0)
    setLoading(true)
    seenIdsRef.current.clear()
    fetchingRef.current = false // Reset fetch lock
    fetchSchools(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.year, filters.country, filters.status])

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || loading) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !fetchingRef.current) {
          fetchSchools(false)
        }
      },
      { rootMargin: '200px' }
    )
    
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, loading])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary_color to-[#103F56] w-full">
      <div className=" mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h1 className="text-white !text-[3em] md:!text-[5em] lg:!text-[7em] leading-none mb-4">
            Our Schools
          </h1>
          <p className="text-white/80 text-lg md:text-xl  max-w-2xl">
            Explore our past and upcoming coastal ocean environment summer schools across Nigeria and Ghana.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/15 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-secondary_color"
              >
                <option value="">All Years</option>
                {filterOptions.years.map(year => (
                  <option key={year} value={year} className="bg-primary_color">
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Country</label>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-secondary_color"
              >
                <option value="">All Countries</option>
                {filterOptions.countries.map(country => (
                  <option key={country} value={country} className="bg-primary_color">
                    {country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-secondary_color"
              >
                <option value="">All Statuses</option>
                {filterOptions.statuses.map(status => (
                  <option key={status} value={status} className="bg-primary_color">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading schools...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-white text-xl mb-2">Error loading schools</p>
            <p className="text-white/70">{error}</p>
          </div>
        )}

        {/* Schools Grid */}
        {!loading && schools.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {schools.map((school) => (
              <Link
                key={school.id || school.slug}
                href={`/schools/${school.slug}`}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/15  overflow-hidden hover:bg-white/10 transition-all duration-300 hover:border-white/30 h-full flex flex-col">
                  {/* Cover Image */}
                  {school.coverImage?.url && (
                    <div className="relative w-full h-48 md:h-56 overflow-hidden">
                      <Image
                        src={school.coverImage.url}
                        alt={school.schoolName || 'School cover'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-3">
                      <h3 className="text-white text-xl lg:text-[1.2em]  mb-3  ">
                        {school.schoolName}
                      </h3>
                      
                      {school.schoolLocation && (
                        <p className="text-white/70 text-sm md:text-base flex items-center gap-2 mb-2">
                          <HiLocationMarker className="w-4 h-4" />
                          {school.schoolLocation}
                        </p>
                      )}
                      
                      {school.schoolStatus && (
                        <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/90 text-xs uppercase">
                          {school.schoolStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && schools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/70 text-lg">No schools found matching your filters.</p>
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="h-24" />
        
        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-white/70 text-sm">Loading more schools...</p>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && schools.length > 0 && (
          <div className="text-center py-8">
            <p className="text-white/50 text-sm">No more schools to load.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SchoolsPage

