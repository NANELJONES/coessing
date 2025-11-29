"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import ImageModal from './ImageModal'

const GallerySection = ({ schoolSlug }) => {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [page, setPage] = useState(0)
  const [modalImage, setModalImage] = useState({ url: '', alt: '' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const observerRef = useRef()

  const fetchGalleries = useCallback(async (pageNum = 0) => {
    if (loading) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/galleries/${schoolSlug}?page=${pageNum}&limit=1`)
      const data = await response.json()
      
      if (data.success) {
        if (pageNum === 0) {
          setGalleries(data.data)
        } else {
          setGalleries(prev => [...prev, ...data.data])
        }
        setHasNextPage(data.pageInfo.hasNextPage)
        setPage(pageNum + 1)
      }
    } catch (error) {
      console.error('Error fetching galleries:', error)
    } finally {
      setLoading(false)
    }
  }, [schoolSlug, loading])

  // Load more galleries when the last element comes into view
  const lastGalleryElementRef = useCallback((node) => {
    if (loading) return
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchGalleries(page)
      }
    })
    
    if (node) observerRef.current.observe(node)
  }, [loading, hasNextPage, page, fetchGalleries])

  useEffect(() => {
    fetchGalleries(0)
  }, [schoolSlug])

  const openModal = (url, alt) => {
    setModalImage({ url, alt })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalImage({ url: '', alt: '' })
  }

  if (galleries.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className=" text-lg">No gallery content available for this school.</p>
      </div>
    )
  }


  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold  mb-8">Gallery</h2>
      
      <div className="space-y-12">
        {galleries.map((gallery, index) => (
          <div 
            key={gallery.id}
            ref={index === galleries.length - 1 ? lastGalleryElementRef : null}
            className="p-6 rounded-lg"
          >
            <h3 className="text-2xl font-semibold  mb-4">{gallery.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.galleryAsset && Array.isArray(gallery.galleryAsset) && gallery.galleryAsset.length > 0 ? (
                gallery.galleryAsset.map((asset, assetIndex) => (
                  <div 
                    key={assetIndex} 
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => openModal(asset.url, `${gallery.title} - Image ${assetIndex + 1}`)}
                  >
                    <Image
                      src={asset.url}
                      alt={`${gallery.title} - Image ${assetIndex + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white bg-opacity-20 rounded-full p-2">
                          <svg className="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div> */}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="">No images available for this gallery</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className=" mt-2">Loading more galleries...</p>
        </div>
      )}

      {!hasNextPage && galleries.length > 0 && (
        <div className="text-center py-8">
          <p className=" text-lg">No more galleries to load.</p>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageUrl={modalImage.url}
        imageAlt={modalImage.alt}
      />
    </div>
  )
}

export default GallerySection
