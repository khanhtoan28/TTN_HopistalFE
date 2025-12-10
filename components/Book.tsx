'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Certificate {
  id: number
  name: string
  level: string
  year: number
  department: string
  image: string
  description: string
}

interface BookProps {
  certificates: Certificate[]
  onPageClick?: (cert: Certificate) => void
}

export default function Book({ certificates, onPageClick }: BookProps) {
  const [currentSpread, setCurrentSpread] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right' | null>(null)
  const [flipProgress, setFlipProgress] = useState(0)

  const totalSpreads = Math.ceil(certificates.length / 2)
  const leftPageIndex = currentSpread * 2
  const rightPageIndex = currentSpread * 2 + 1
  const leftCert = certificates[leftPageIndex]
  const rightCert = certificates[rightPageIndex]

  // Get next/prev pages for showing behind
  const nextLeftIndex = (currentSpread + 1) * 2
  const nextRightIndex = (currentSpread + 1) * 2 + 1
  const prevLeftIndex = (currentSpread - 1) * 2
  const prevRightIndex = (currentSpread - 1) * 2 + 1
  const nextLeftCert = certificates[nextLeftIndex]
  const nextRightCert = certificates[nextRightIndex]
  const prevLeftCert = certificates[prevLeftIndex]
  const prevRightCert = certificates[prevRightIndex]

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const handleNext = () => {
    if (currentSpread < totalSpreads - 1 && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection('right')
      
      const startTime = performance.now()
      const duration = 1200
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeInOutCubic(progress)
        
        setFlipProgress(easedProgress * 100)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCurrentSpread((prev) => prev + 1)
          setIsFlipping(false)
          setFlipDirection(null)
          setFlipProgress(0)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }

  const handlePrev = () => {
    if (currentSpread > 0 && !isFlipping) {
      setIsFlipping(true)
      setFlipDirection('left')
      
      const startTime = performance.now()
      const duration = 1200
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeInOutCubic(progress)
        
        setFlipProgress(easedProgress * 100)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCurrentSpread((prev) => prev - 1)
          setIsFlipping(false)
          setFlipDirection(null)
          setFlipProgress(0)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    setCurrentSpread(0)
  }, [certificates.length])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFlipping) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSpread, totalSpreads, isFlipping])

  if (certificates.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <p className="text-gray-600 text-lg">
          Không tìm thấy bằng khen nào phù hợp với bộ lọc
        </p>
      </div>
    )
  }

  // Render page content
  const renderPageContent = (cert: typeof leftCert, pageNum: number) => {
    if (!cert) {
      return (
        <div className="p-8 md:p-12 h-full flex items-center justify-center">
          <p className="text-gray-400 text-sm">Trang trống</p>
        </div>
      )
    }

    return (
      <div className="p-8 md:p-12 h-full flex flex-col">
        <div className="text-center mb-6">
          <div className="inline-block border-b-4 border-primary-dark pb-2 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-dark font-serif">
              SỔ VÀNG
            </h2>
          </div>
          <p className="text-sm text-gray-600 italic">
            Bệnh viện Trung ương Thái Nguyên
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-5xl">🏆</span>
            </div>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-primary-dark text-center mb-4 font-serif px-4">
            {cert.name}
          </h3>

          <div className="bg-white bg-opacity-80 rounded-lg p-4 w-full max-w-xs shadow-md mb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-semibold text-primary-dark">Cấp:</span>
                <span className="text-gray-700">{cert.level}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="font-semibold text-primary-dark">Năm:</span>
                <span className="text-gray-700">{cert.year}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary-dark">Khoa:</span>
                <span className="text-gray-700 text-right text-xs">{cert.department}</span>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-700 italic text-sm max-w-xs mb-4">
            "{cert.description}"
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary-dark to-transparent"></div>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-300">
          <p className="text-sm text-gray-600">
            Trang {pageNum}
          </p>
        </div>
      </div>
    )
  }

  // Soft Page Curl - lật về phía trước với hiệu ứng mềm mại
  const getLeftPageStyle = () => {
    if (!isFlipping || flipDirection !== 'left') {
      return {
        transform: 'rotateY(0deg)',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset -1px 0 0 rgba(0,0,0,0.1)',
        opacity: 1,
      }
    }
    
    const progress = flipProgress / 100
    const angle = 180 * progress
    
    const curlPosition = progress * 100
    const wave = Math.sin(progress * Math.PI)
    const curlAmplitude = 20 * wave
    
    const points = []
    const numPoints = 20
    for (let i = 0; i <= numPoints; i++) {
      const y = (i / numPoints) * 100
      const xOffset = Math.sin((i / numPoints) * Math.PI) * curlAmplitude * (1 - progress * 0.5)
      const x = Math.max(0, curlPosition - xOffset)
      points.push(`${x}% ${y}%`)
    }
    
    const clipPath = `polygon(0% 0%, ${points.join(', ')}, 0% 100%)`
    
    const shadowIntensity = 0.3 + progress * 0.5
    const shadowBlur = 40 + progress * 120
    const translateZ = Math.sin(progress * Math.PI) * 25
    
    return {
      transform: `rotateY(${angle}deg) translateZ(${translateZ}px)`,
      clipPath,
      WebkitClipPath: clipPath,
      boxShadow: `0 ${10 + progress * 50}px ${shadowBlur}px rgba(0,0,0,${shadowIntensity}), inset -2px 0 0 rgba(0,0,0,0.15)`,
      opacity: 1 - progress * 0.2,
    }
  }

  const getRightPageStyle = () => {
    if (!isFlipping || flipDirection !== 'right') {
      return {
        transform: 'rotateY(0deg)',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 1px 0 0 rgba(0,0,0,0.1)',
        opacity: 1,
      }
    }
    
    const progress = flipProgress / 100
    const angle = -180 * progress
    
    const curlPosition = 100 - (progress * 100)
    const wave = Math.sin(progress * Math.PI)
    const curlAmplitude = 20 * wave
    
    const points = []
    const numPoints = 20
    for (let i = 0; i <= numPoints; i++) {
      const y = (i / numPoints) * 100
      const xOffset = Math.sin((i / numPoints) * Math.PI) * curlAmplitude * (1 - progress * 0.5)
      const x = Math.min(100, curlPosition + xOffset)
      points.push(`${x}% ${y}%`)
    }
    
    const clipPath = `polygon(${points.join(', ')}, 100% 100%, 100% 0%)`
    
    const shadowIntensity = 0.3 + progress * 0.5
    const shadowBlur = 40 + progress * 120
    const translateZ = Math.sin(progress * Math.PI) * 25
    
    return {
      transform: `rotateY(${angle}deg) translateZ(${translateZ}px)`,
      clipPath,
      WebkitClipPath: clipPath,
      boxShadow: `0 ${10 + progress * 50}px ${shadowBlur}px rgba(0,0,0,${shadowIntensity}), inset 2px 0 0 rgba(0,0,0,0.15)`,
      opacity: 1 - progress * 0.2,
    }
  }

  const leftStyle = getLeftPageStyle()
  const rightStyle = getRightPageStyle()
  const isFirstSpread = currentSpread === 0

  // Render cover page content
  const renderCoverPage = () => {
    return (
      <div className="p-8 md:p-12 h-full flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <div className="inline-block border-b-4 border-primary-dark pb-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-dark font-serif mb-2">
              SỔ VÀNG
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary-dark font-serif">
              BỆNH VIỆN TRUNG ƯƠNG THÁI NGUYÊN
            </h2>
          </div>
          <p className="text-lg text-gray-600 italic mt-4">
            Kỷ niệm 75 năm thành lập
          </p>
          <p className="text-xl font-bold text-primary-dark mt-2">
            1951 - 2026
          </p>
        </div>

        <div className="mb-8">
          <div className="w-40 h-40 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-7xl">🏆</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-700 text-lg max-w-md">
            Thành tựu và vinh dự qua 75 năm phát triển
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary-dark to-transparent mt-6 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div 
        className="relative" 
        style={{ 
          perspective: '3000px', 
          perspectiveOrigin: 'center center',
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          <div className="flex gap-0 relative" style={{ transformStyle: 'preserve-3d' }}>
            {/* Background layer - shows next/prev pages */}
            <div className="absolute inset-0 flex gap-0" style={{ zIndex: 0 }}>
              {/* Background Left Page */}
              {!isFirstSpread && (
                <div className="w-1/2 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
                  {isFlipping && flipDirection === 'left' && prevLeftCert ? (
                    <div className="opacity-100">
                      {renderPageContent(prevLeftCert, prevLeftIndex + 1)}
                    </div>
                  ) : isFlipping && flipDirection === 'right' && nextLeftCert ? (
                    <div className="opacity-100">
                      {renderPageContent(nextLeftCert, nextLeftIndex + 1)}
                    </div>
                  ) : (
                    <div className="opacity-100">
                      {renderPageContent(leftCert, leftPageIndex + 1)}
                    </div>
                  )}
                </div>
              )}
              
              {/* Background Right Page */}
              <div className={`bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 ${isFirstSpread ? 'w-full' : 'w-1/2'}`}>
                {isFirstSpread ? (
                  <div className="opacity-100">
                    {renderCoverPage()}
                  </div>
                ) : isFlipping && flipDirection === 'right' && nextRightCert ? (
                  <div className="opacity-100">
                    {renderPageContent(nextRightCert, nextRightIndex + 1)}
                  </div>
                ) : isFlipping && flipDirection === 'left' && prevRightCert ? (
                  <div className="opacity-100">
                    {renderPageContent(prevRightCert, prevRightIndex + 1)}
                  </div>
                ) : (
                  <div className="opacity-100">
                    {renderPageContent(rightCert, rightPageIndex + 1)}
                  </div>
                )}
              </div>
            </div>

            {/* Left Page - Flipping (only show if not first spread) */}
            {!isFirstSpread && (
              <div
                className="relative w-1/2 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 shadow-2xl cursor-pointer overflow-hidden"
                onClick={() => !isFlipping && leftCert && onPageClick && onPageClick(leftCert)}
                style={{
                  minHeight: '700px',
                  transform: leftStyle.transform,
                  transformOrigin: 'right center',
                  transformStyle: 'preserve-3d',
                  transition: isFlipping ? 'none' : 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  clipPath: leftStyle.clipPath,
                  WebkitClipPath: leftStyle.clipPath,
                  boxShadow: leftStyle.boxShadow,
                  opacity: leftStyle.opacity,
                  zIndex: isFlipping && flipDirection === 'left' ? 20 : 10,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {renderPageContent(leftCert, leftPageIndex + 1)}
              </div>
            )}

            {/* Book Spine (only show if not first spread) */}
            {!isFirstSpread && (
              <div
                className="absolute left-1/2 top-0 bottom-0 w-2 transform -translate-x-1/2 z-15"
                style={{
                  background: 'linear-gradient(to right, rgba(139, 69, 19, 0.9), rgba(160, 82, 45, 0.9), rgba(139, 69, 19, 0.9))',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.4), 0 0 20px rgba(0,0,0,0.2)',
                }}
              ></div>
            )}

            {/* Right Page - Cover or Flipping */}
            <div
              className={`relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 shadow-2xl cursor-pointer overflow-hidden ${isFirstSpread ? 'w-full' : 'w-1/2'}`}
              onClick={() => !isFlipping && (isFirstSpread || rightCert) && onPageClick && (isFirstSpread ? null : onPageClick(rightCert))}
              style={{
                minHeight: '700px',
                transform: isFirstSpread ? 'rotateY(0deg)' : rightStyle.transform,
                transformOrigin: isFirstSpread ? 'center center' : 'left center',
                transformStyle: 'preserve-3d',
                transition: isFlipping ? 'none' : 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                clipPath: isFirstSpread ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : rightStyle.clipPath,
                WebkitClipPath: isFirstSpread ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : rightStyle.clipPath,
                boxShadow: isFirstSpread ? '0 10px 40px rgba(0,0,0,0.3)' : rightStyle.boxShadow,
                opacity: isFirstSpread ? 1 : rightStyle.opacity,
                zIndex: isFlipping && flipDirection === 'right' ? 20 : 10,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {isFirstSpread ? renderCoverPage() : renderPageContent(rightCert, rightPageIndex + 1)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentSpread === 0 || isFlipping}
          className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            currentSpread === 0 || isFlipping
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-dark text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Trang trước
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Spread {currentSpread + 1} / {totalSpreads}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSpread === totalSpreads - 1 || isFlipping}
          className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            currentSpread === totalSpreads - 1 || isFlipping
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-dark text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          Trang sau
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  )
}
