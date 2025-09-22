"use client"
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/schools')
        const data = await response.json()
        
        if (data.success) {
          setSchools(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Failed to fetch schools')
        console.error('Error fetching schools:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSchools()
  }, [])

  const memoizedSchools = useMemo(() => schools, [schools])

  const value = {
    schools: memoizedSchools,
    loading,
    error
  }

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  )
}
