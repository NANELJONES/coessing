"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HiLocationMarker } from 'react-icons/hi'
import { motion, useTransform, useScroll, useSpring } from 'framer-motion'

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
  
  const skipRef = useRef(0)
  const seenIdsRef = useRef(new Set())
  const fetchingRef = useRef(false)
  const filtersRef = useRef(filters)
  
  // Scroll refs and state
  const targetRef = useRef(null)
  const contentRef = useRef(null)
  const [contentWidth, setContentWidth] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)

  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 })

  // Measure content dimensions
  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentWidth(contentRef.current.scrollWidth)
        setViewportWidth(window.innerWidth)
        setViewportHeight(window.innerHeight)
      }
    }

    // Initial measurement
    handleResize()

    // Re-measure when schools change
    const timeoutId = setTimeout(handleResize, 100)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [schools, loadingMore])

  // Calculate scroll range
  const totalHorizontalDistance = Math.max(0, contentWidth - viewportWidth)
  
  // Map vertical scroll (0-1) to horizontal translation
  const x = useTransform(smoothProgress, [0, 1], ["0px", `-${totalHorizontalDistance}px`])

  // Container height calculation
  const containerHeight = totalHorizontalDistance + viewportHeight

  // Keep filtersRef in sync
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  // Fetch filter options and initial schools in parallel
  useEffect(() => {
    let mounted = true
    
    const fetchData = async () => {
      try {
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
          const uniqueSchools = schoolsData.data.filter(school => {
            const id = school.id || school.slug
            if (seenIdsRef.current.has(id)) return false
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
        const uniqueSchools = data.data.filter(school => {
          const id = school.id || school.slug
          if (reset) seenIdsRef.current.clear()
          if (seenIdsRef.current.has(id)) return false
          seenIdsRef.current.add(id)
          return true
        })
        
        if (reset) {
          setSchools(uniqueSchools)
        } else {
          setSchools(prev => {
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

  // Infinite scroll trigger
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.95 && hasMore && !loadingMore && !fetchingRef.current) {
        fetchSchools(false)
      }
    })
    return () => unsubscribe()
  }, [scrollYProgress, hasMore, loadingMore, fetchSchools])

  // Handle filter changes
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    skipRef.current = 0
    setSkip(0)
    setLoading(true)
    seenIdsRef.current.clear()
    fetchingRef.current = false
    fetchSchools(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.year, filters.country, filters.status])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div 
      ref={targetRef} 
      className="relative bg-gradient-to-b from-primary_color to-[#103F56] w-full" 
      style={{ height: containerHeight ? `${containerHeight}px` : '100vh' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        
        {/* Header & Filters */}
        <div className="w-full px-4 md:px-6 lg:px-8 pt-8 pb-4 flex-none z-20 bg-gradient-to-b from-primary_color/80 to-transparent backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
            <div>
              <h1 className="text-white !text-[2.5em] md:!text-[4em] leading-none">
                Our Schools
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-xl mt-2">
                Explore our past and upcoming coastal ocean environment summer schools across Nigeria and Ghana.
              </p>
            </div>

            {/* Compact Filters */}
            <div className="flex gap-2">
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-secondary_color"
              >
                <option value="">Year</option>
                {filterOptions.years.map(year => (
                  <option key={year} value={year} className="bg-primary_color">{year}</option>
                ))}
              </select>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-secondary_color"
              >
                <option value="">Country</option>
                {filterOptions.countries.map(country => (
                  <option key={country} value={country} className="bg-primary_color">
                    {country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-secondary_color"
              >
                <option value="">Status</option>
                {filterOptions.statuses.map(status => (
                  <option key={status} value={status} className="bg-primary_color">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Content */}
        <div className="flex-1 flex items-center relative">
          {loading && schools.length === 0 ? (
            <div className="w-full flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <motion.div 
              ref={contentRef}
              style={{ x }} 
              className="flex gap-12 md:gap-24 px-8 md:px-24 items-center relative"
            >
              {/* Continuous Timeline Line */}
              <div className="absolute top-[75%] left-0 w-full h-[2px] bg-white/20 z-0" />

              {schools.map((school) => (
                <div 
                  key={school.id || school.slug} 
                  className="w-[85vw] md:w-[60vw] lg:w-[40vw] flex-shrink-0 flex flex-col justify-center h-[75vh] relative group"
                >
                  <Link href={`/schools/${school.slug}`} className="block h-full flex flex-col">
                    {/* Top Content */}
                    <div className="flex-1 flex flex-col justify-end pb-12">
                      {/* Name & Location */}
                      <div className="mb-6">
                        <h2 className="text-white text-3xl md:text-5xl font-light leading-tight mb-4 group-hover:text-secondary_color transition-colors">
                          {school.schoolName}
                        </h2>
                        {school.schoolLocation && (
                          <div className="flex items-center gap-2 text-white/70 text-base md:text-lg uppercase tracking-wider">
                            <HiLocationMarker className="w-5 h-5" />
                            {school.schoolLocation}
                          </div>
                        )}
                      </div>

                      {/* Image */}
                      <div className="relative w-full aspect-[16/9] overflow-hidden border border-white/10 bg-white/5">
                        {school.coverImage?.url ? (
                          <Image
                            src={school.coverImage.url}
                            alt={school.schoolName}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            No Image
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        {school.schoolStatus && (
                          <div className="absolute top-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white text-sm uppercase tracking-wider">
                            {school.schoolStatus}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline Marker & Year */}
                    <div className="relative h-24 flex flex-col items-center justify-start pt-6">
                      {/* Dot on the line (Absolute relative to the container, aligned with the line) */}
                      <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white group-hover:bg-secondary_color group-hover:scale-150 transition-all duration-300 z-10" />
                      
                      {/* Year */}
                      <span className="text-white text-[4em] font-bold leading-none tracking-tighter group-hover:text-secondary_color transition-colors opacity-50 group-hover:opacity-100">
                        {school.schoolYear}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
              
              {/* Loading Indicator at end */}
              {loadingMore && (
                <div className="w-[200px] flex-shrink-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}
              
              {/* Spacer at the end */}
              <div className="w-[100px] flex-shrink-0" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SchoolsPage
