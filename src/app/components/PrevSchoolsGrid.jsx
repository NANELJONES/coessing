"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiLocationMarker } from 'react-icons/hi'
import { getSchools, transformSchoolData } from '@/lib/schools'

const PrevSchoolsGrid = () => {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolsData = await getSchools(12)
        setSchools(schoolsData.map(transformSchoolData))
      } catch (error) {
        console.error('Error fetching schools:', error)
        setSchools([])
      } finally {
        setLoading(false)
      }
    }

    fetchSchools()
  }, [])

  if (loading) {
    return (
      <div className="w-full py-16">
        <h1 className="text-4xl md:!text-[5em] text-white mb-8">Previous Schools</h1>
        <p className="text-white/70">Loading schools...</p>
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <div className="w-full py-16">
        <h1 className="text-4xl md:!text-[5em] text-white mb-8">Previous Schools</h1>
        <p className="text-white/70">No schools found.</p>
      </div>
    )
  }

  return (
    <div className="w-full py-16">
      <h1 className="text-4xl md:!text-[5em] text-white mb-10">Previous Schools</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {schools.map((school) => (
          <Link
            key={school.slug}
            href={`/schools/${school.slug}`}
            className="group relative border border-white/20 hover:border-white/40 overflow-hidden transition-colors"
          >
            <div className="aspect-[16/10] overflow-hidden bg-white/5">
              <img
                src={school.coverImage || ''}
                alt={school.schoolName || 'School'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-5 space-y-2 bg-white/10 backdrop-blur-md">
              <p className="text-white/80 text-sm">{school.year || ''}</p>
              <h5 className="text-white text-2xl leading-tight group-hover:text-secondary_color transition-colors">
                {school.schoolName || ''}
              </h5>
              {school.location && (
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <HiLocationMarker className="w-4 h-4 shrink-0" />
                  <span>{school.location}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PrevSchoolsGrid
