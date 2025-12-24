'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { Heart, Building, Rocket, Award } from 'lucide-react'
import { historyService } from '@/lib/api/services'
import { History } from '@/lib/api/types'

interface Milestone {
  year: number
  title: string
  period: string
  description: string
  icon: any
  color: string
  image: string
}

// Map icon names to actual icons
const iconMap: Record<string, any> = {
  Building,
  Heart,
  Rocket,
  Award,
}

// Map period to color
const getColorByPeriod = (period: string): string => {
  if (period.includes('1951') || period.includes('1965')) return 'bg-primary-dark'
  if (period.includes('1965') || period.includes('1975')) return 'bg-red-600'
  if (period.includes('1976') || period.includes('1995')) return 'bg-green-600'
  if (period.includes('1996') || period.includes('2010')) return 'bg-blue-600'
  if (period.includes('2011') || period.includes('2025')) return 'bg-purple-600'
  return 'bg-yellow-600'
}

// Get icon by title/keyword
const getIconByTitle = (title: string): any => {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes('chiến') || lowerTitle.includes('khó khăn')) return Heart
  if (lowerTitle.includes('hiện đại') || lowerTitle.includes('kỹ thuật')) return Rocket
  if (lowerTitle.includes('thành lập') || lowerTitle.includes('khôi phục')) return Building
  return Award
}

function MilestoneItem({ milestone, Icon, isEven }: { milestone: Milestone, Icon: any, isEven: boolean }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className={`relative flex flex-col lg:flex-row items-center ${
        isEven ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Nội dung */}
      <div
        className={`w-full lg:w-5/12 ${
          isEven ? 'lg:pr-8' : 'lg:pl-8'
        }`}
      >
        <div className="card">
          <div className="flex items-center mb-4">
            <div
              className={`w-12 h-12 ${milestone.color} rounded-full flex items-center justify-center mr-4`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-dark">
                {milestone.year}
              </div>
              <div className="text-sm text-gray-600">
                {milestone.period}
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-primary-dark mb-3">
            {milestone.title}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {milestone.description}
          </p>
        </div>
      </div>


      {/* Ảnh minh họa */}
      <div
        className={`w-full lg:w-5/12 ${
          isEven ? 'lg:pl-8' : 'lg:pr-8'
        }`}
      >
        {milestone.image && !imageError ? (
          <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg relative">
            <Image
              src={milestone.image}
              alt={`${milestone.title} - ${milestone.year}`}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gradient-to-br from-white to-primary-dark rounded-lg overflow-hidden flex items-center justify-center">
            <span className="text-6xl">📸</span>
          </div>
        )}
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
            const color = getColorByPeriod(history.period)
            
            return {
              year,
              title: history.title,
              period: history.period,
              description: history.description,
              icon: Icon,
              color,
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
      <div className="min-h-screen flex flex-col bg-gray-50">
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
      <div className="min-h-screen flex flex-col bg-gray-50">
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
            Lịch sử 75 năm
          </h1>
          <p className="text-lg text-gray-700">
            Dòng lịch sử bệnh viện – 1951–2026
          </p>
        </div>

        {/* Timeline dọc cho mobile, ngang cho desktop */}
        <div className="relative">
          {/* Đường timeline */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-dark opacity-30"></div>
          <div className="lg:hidden absolute left-8 w-1 h-full bg-primary-dark opacity-30"></div>

          {/* Các mốc */}
          {milestones.length > 0 ? (
            <div className="space-y-12 lg:space-y-24">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon
                const isEven = index % 2 === 0
                
                return (
                  <MilestoneItem 
                    key={milestone.year}
                    milestone={milestone}
                    Icon={Icon}
                    isEven={isEven}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Chưa có dữ liệu lịch sử</p>
            </div>
          )}
        </div>

        {/* Thống kê */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-dark mb-2">75</div>
            <div className="text-sm text-gray-600">Năm phát triển</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-dark mb-2">1000+</div>
            <div className="text-sm text-gray-600">Cán bộ nhân viên</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-dark mb-2">500K+</div>
            <div className="text-sm text-gray-600">Bệnh nhân/năm</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-dark mb-2">50+</div>
            <div className="text-sm text-gray-600">Khoa phòng</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

