'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { Heart, Building, Rocket, Award, Calendar, Users, Activity, Building2 } from 'lucide-react'
import { historyService } from '@/lib/api/services'
import { History } from '@/lib/api/types'
import { motion } from 'framer-motion'


interface Milestone {
  year: number
  title: string
  period: string
  description: string
  icon: any
  color: string
  image: string
}

// Custom hook for Intersection Observer
function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    )

    observerRef.current.observe(currentRef)

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef)
      }
    }
  }, [])

  return [ref, isVisible] as const
}

// Custom hook for counter animation
function useCounter(end: number | string, duration: number = 2000, isActive: boolean = false) {
  const [count, setCount] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number>()
  const originalValueRef = useRef<number | string>(end)

  useEffect(() => {
    originalValueRef.current = end
  }, [end])

  useEffect(() => {
    if (!isActive) return

    // Parse the end value
    let numericEnd: number
    
    if (typeof end === 'string') {
      if (end.includes('K')) {
        const num = parseInt(end.replace(/[^0-9]/g, ''))
        numericEnd = num * 1000
      } else if (end.includes('+')) {
        numericEnd = parseInt(end.replace(/[^0-9]/g, ''))
      } else {
        numericEnd = parseInt(end) || 0
      }
    } else {
      numericEnd = end
    }

    if (isNaN(numericEnd) || numericEnd === 0) return

    setCount(0)
    startTimeRef.current = null

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease out function
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOut * numericEnd)

      setCount(currentCount)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(numericEnd)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [end, duration, isActive])

  // Format the output
  if (typeof originalValueRef.current === 'string') {
    if (originalValueRef.current.includes('K')) {
      return `${Math.floor(count / 1000)}K+`
    }
    if (originalValueRef.current.includes('+')) {
      return `${count.toLocaleString()}+`
    }
    return count.toLocaleString()
  }
  
  return count.toLocaleString()
}

// Get icon by title/keyword
const getIconByTitle = (title: string): any => {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes('chiến') || lowerTitle.includes('khó khăn')) return Heart
  if (lowerTitle.includes('hiện đại') || lowerTitle.includes('kỹ thuật')) return Rocket
  if (lowerTitle.includes('thành lập') || lowerTitle.includes('khôi phục')) return Building
  return Award
}

// Split-screen milestone item with scroll animation
function MilestoneItem({ milestone, Icon, isReversed = false }: { milestone: Milestone, Icon: any, isReversed?: boolean }) {
  const [imageError, setImageError] = useState(false)
  const [textRef, textVisible] = useScrollReveal()
  const [imageRef, imageVisible] = useScrollReveal()

  // Animation directions change based on isReversed
  const textDirection = isReversed ? 'translate-x-12' : '-translate-x-12'
  const imageDirection = isReversed ? '-translate-x-12' : 'translate-x-12'

  // Render content based on isReversed
  const textContent = (
    <div
      ref={textRef}
      className={`transition-all ease-out ${
        textVisible
          ? 'opacity-100 translate-x-0'
          : `opacity-0 ${textDirection}`
      }`}
      style={{ transitionDuration: '800ms' }}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary-dark">
              {milestone.year}
            </div>
            <div className="text-sm text-gray-500 font-medium">
              {milestone.period}
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark leading-tight">
          {milestone.title}
        </h2>
        
        <p className="text-lg text-gray-700 leading-relaxed">
          {milestone.description}
        </p>
      </div>
    </div>
  )

  const imageContent = (
    <div
      ref={imageRef}
      className={`transition-all ease-out ${
        imageVisible
          ? 'opacity-100 translate-x-0'
          : `opacity-0 ${imageDirection}`
      }`}
      style={{ transitionDuration: '800ms' }}
    >
            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-primary-dark/5 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary-dark/5 rounded-full blur-2xl -z-10"></div>
              
              {/* Dotted pattern overlay */}
              <div 
                className="absolute inset-0 opacity-5 -z-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, #075EBC 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              ></div>

              {/* Image container with modern styling */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100">
                {milestone.image && !imageError ? (
                  <div className="aspect-[1.5/1] relative">
                    <Image
                      src={milestone.image}
                      alt={`${milestone.title} - ${milestone.year}`}
                      fill
                      className="object-contain grayscale hover:grayscale-0 transition-all duration-500 p-5"
                      onError={() => setImageError(true)}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-primary-dark/10 flex items-center justify-center">
                    <span className="text-6xl opacity-30">📸</span>
                  </div>
                )}
              </div>
            </div>
    </div>
  )

  return (
    <div className="relative py-0 md:py-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {isReversed ? (
            <>
              {imageContent}
              {textContent}
            </>
          ) : (
            <>
              {textContent}
              {imageContent}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Stats item component with counter animation
function StatItem({ 
  value, 
  label, 
  icon: Icon 
}: { 
  value: number | string
  label: string
  icon: any 
}) {
  const [ref, isVisible] = useScrollReveal()
  const count = useCounter(value, 2000, isVisible)

  return (
    <div
      ref={ref}
      className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-primary-dark/10 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-dark" />
        </div>
      </div>
      <div className="text-4xl md:text-5xl font-bold text-primary-dark mb-2">
        {count}
      </div>
      <div className="text-sm md:text-base text-gray-600 font-medium">
        {label}
      </div>
    </div>
  )
}

export default function LichSuPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await historyService.getAll()
        
        if (response.success && response.data) {
          // Map dữ liệu từ API format sang format mà component cần
          const mappedMilestones: Milestone[] = response.data.map((history: History) => {
            const year = parseInt(history.year) || 1951
            const Icon = getIconByTitle(history.title)
            
            return {
              year,
              title: history.title,
              period: history.period,
              description: history.description,
              icon: Icon,
              color: 'bg-primary-dark',
              image: history.image || '/img/ảnh 3.png', // Fallback image
            }
          })
          
          // Sắp xếp theo năm
          mappedMilestones.sort((a, b) => a.year - b.year)
          setMilestones(mappedMilestones)
        } else {
          setError(response.error || 'Không thể tải dữ liệu lịch sử')
        }
      } catch (err) {
        console.error('Error fetching histories:', err)
        setError('Đã xảy ra lỗi khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchHistories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mb-4"></div>
            <p className="text-lg text-gray-700">Đang tải dữ liệu...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-1">
        {/* Hero Header Section */}
        <section className="py-10 md:py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Lịch sử 75 năm
          </h1>
          <p className="text-xl text-gray-600">
            Dòng lịch sử bệnh viện – 1951–2026
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full" />
        </motion.div>
        </section>

        {/* Milestones Section */}
        {milestones.length > 0 ? (
          <section className="bg-white relative">
            {/* Thanh dọc ở giữa - chỉ hiển thị trên desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1.5 bg-primary-dark/60 transform -translate-x-1/2"></div>
            
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              const isReversed = index % 2 === 1 // Item thứ 2, 4, 6... sẽ đảo ngược
              
              return (
                <MilestoneItem 
                  key={milestone.year}
                  milestone={milestone}
                  Icon={Icon}
                  isReversed={isReversed}
                />
              )
            })}
          </section>
        ) : (
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <p className="text-lg text-gray-600">Chưa có dữ liệu lịch sử</p>
              </div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-gray-0">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
              <StatItem 
                value="75" 
                label="Năm phát triển" 
                icon={Calendar}
              />
              <StatItem 
                value="1000+" 
                label="Cán bộ nhân viên" 
                icon={Users}
              />
              <StatItem 
                value="500K" 
                label="Bệnh nhân/năm" 
                icon={Activity}
              />
              <StatItem 
                value="50+" 
                label="Khoa phòng" 
                icon={Building2}
              />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

