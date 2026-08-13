"use client"
import React, { useEffect, useState } from 'react'

const SchoolPartners = () => {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/school-partners')
        const data = await response.json()
        if (data.success) {
          setPartners(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        console.error('Error fetching school partners:', err)
        setError('Failed to fetch school partners')
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  if (loading) {
    return (
      <div className="w-full py-12">
        <h2 className="!text-[3em] md:!text-[4em] text-white mb-4">School Partners</h2>
        <p className="text-white/70">Loading school partners...</p>
      </div>
    )
  }

  if (error || partners.length === 0) {
    return (
      <div className="w-full py-12">
        <h2 className="!text-[3em] md:!text-[4em] text-white mb-4">School Partners</h2>
        <p className="text-white/70">
          {error || 'No school partners available at this time.'}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full py-12">
      <h2 className="!text-[3em] md:!text-[4em] text-white mb-4">School Partners</h2>
      <p className="text-white/80 max-w-2xl mb-8">
        Host institutions and school partners that make each COESSING year possible.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {partners.map((partner, index) => (
          <div
            key={`${partner.schoolName}-${index}`}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-all min-h-[6rem]"
          >
            {partner.logo?.url && (
              <div className="w-full h-24 flex items-center justify-center mb-3 bg-white p-2">
                <img
                  src={partner.logo.url}
                  alt={partner.schoolName || 'School partner'}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
            <p className="text-white text-sm text-center leading-tight">
              {partner.schoolName}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SchoolPartners
