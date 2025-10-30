"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const Partners = () => {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/partners')
        const data = await response.json()
        
        if (data.success) {
          setPartners(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Failed to fetch partners')
        console.error('Error fetching partners:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  if (loading) {
    return (
      <div className="py-16 px-8 bg-gradient-to-b from-primary_color/90 to-primary_color/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Partners</h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary_color"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16 px-8 bg-primary_color">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Partners</h2>
          <div className="text-center text-white/60">
            <p>Unable to load partners at this time.</p>
          </div>
        </div>
      </div>
    )
  }

  if (partners.length === 0) {
    return (
      <div className="py-16 px-8 bg-primary_color">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Partners</h2>
          <div className="text-center text-white/60">
            <p>No partners available at this time.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="  border-2 border-white/10 rounded-lg p-6   backdrop-blur-sm">
      <div className=" mx-auto text-white text-left">
        <h2 className="!text-[4em] lg:!text-[4em]  mb-4">Our Partners</h2>
        <p className="text-white/80  mb-12 max-w-2xl mx-auto">
          We are grateful for the support of our funding partners and institutional collaborators 
          who make COESSING possible.
        </p>
        <br/>
        
        <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center justify-center hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="relative w-[10em] h-auto  max-w-[250px] mb-4 group-hover:scale-110 transition-transform duration-300">
                <img
                  src={partner.partnerLogo?.url || '/placeholder-logo.png'}
                  alt={partner.partnerName}
                 
                  className="object-contain"
                />
              </div>


              <p className="text-white text-sm font-medium text-center leading-tight">
                {partner.partnerName}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        {/* <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Thank You</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              COESSING is made possible through the generous support of our funding partners 
              and the collaboration of institutions across Ghana, Nigeria, and the United States. 
              We also acknowledge several instructors who used their own individual funding to travel to the school.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Funding Partners Include:</h4>
                <ul className="text-white/80 space-y-1 text-sm">
                  <li>• US National Science Foundation (NSF)</li>
                  <li>• University of Michigan</li>
                  <li>• Regional Maritime University (RMU)</li>
                  <li>• International Centre for Theoretical Physics</li>
                  <li>• Gordon and Betty Moore Foundation</li>
                  <li>• US Office of Naval Research</li>
                  <li>• Schmidt Sciences</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Institutional Partners:</h4>
                <ul className="text-white/80 space-y-1 text-sm">
                  <li>• University of Ghana (UG)</li>
                  <li>• Kwame Nkrumah University of Science and Technology (KNUST)</li>
                  <li>• University of Cape Coast (UCC)</li>
                  <li>• Oregon State University</li>
                  <li>• University of Southern Mississippi</li>
                  <li>• The Consortium for Ocean Leadership</li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Partners
