"use client"
import React, { useState, useEffect } from 'react'

const Partners = () => {
  const [funders, setFunders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFunders = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/funders')
        const data = await response.json()

        if (data.success) {
          setFunders(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Failed to fetch funders')
        console.error('Error fetching funders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFunders()
  }, [])

  if (loading) {
    return (
      <div className="border-2 border-white/10 rounded-lg p-6 backdrop-blur-sm text-white">
        <h2 className="!text-[4em] mb-4">Our Funders</h2>
        <p className="text-white/70">Loading funders...</p>
      </div>
    )
  }

  if (error || funders.length === 0) {
    return (
      <div className="border-2 border-white/10 rounded-lg p-6 backdrop-blur-sm text-white">
        <h2 className="!text-[4em] mb-4">Our Funders</h2>
        <p className="text-white/70">
          {error || 'No funders available at this time.'}
        </p>
      </div>
    )
  }

  return (
    <div className="border-2 border-white/10 rounded-lg p-6 backdrop-blur-sm">
      <div className="mx-auto text-white text-left">
        <h2 className="!text-[4em] mb-4">Our Funders</h2>
        <p className="text-white/80 mb-12 max-w-2xl">
          We are grateful for the support of our funding partners who make COESSING possible.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {funders.map((funder, index) => (
            <div
              key={`${funder.funderName}-${index}`}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center justify-center hover:bg-white/10 transition-all duration-300 group min-h-[6rem]"
            >
              {funder.funderLogo?.url && (
                <div className="w-full h-24 flex items-center justify-center mb-3 bg-white p-2 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={funder.funderLogo.url}
                    alt={funder.funderName || 'Funder'}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <p className="text-white text-sm font-medium text-center leading-tight">
                {funder.funderName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Partners
