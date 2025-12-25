'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft, QrCode, Calendar, MapPin } from 'lucide-react'
import QRCode from 'react-qr-code'
import { artifactsService } from '@/lib/api/services'
import { Artifact } from '@/lib/api/types'

interface ArtifactDetail {
  id: number
  name: string
  period: string
  year: number
  type: string
  space: string
  department: string
  description: string
  history: string
  context: string
  images: string[]
}

export default function ArtifactDetailPage() {
  const params = useParams()
  const artifactId = params.id as string
  const [artifact, setArtifact] = useState<ArtifactDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtifact = async () => {
      if (!artifactId) return

      try {
        setLoading(true)
        setError(null)
        const id = parseInt(artifactId)
        
        if (isNaN(id)) {
          setError('ID không hợp lệ')
          return
        }

        const response = await artifactsService.getById(id)
        
        if (response.success && response.data) {
          const data = response.data
          // Map dữ liệu từ API format sang format mà component cần
          // Lưu ý: API chỉ có artifactId, artifactName, description, imageUrl
          // Các field khác sẽ dùng giá trị mặc định
          const mappedArtifact: ArtifactDetail = {
            id: data.artifactId,
            name: data.artifactName,
            period: '1951-2025', // Default value
            year: 1951, // Default value
            type: 'Khác', // Default value
            space: 'Khu A', // Default value
            department: 'Phòng trưng bày', // Default value
            description: data.description || '',
            history: data.description || '', // Dùng description cho history nếu không có
            context: 'Hiện vật được trưng bày tại phòng truyền thống của bệnh viện.',
            images: data.imageUrl ? [data.imageUrl] : [],
          }
          setArtifact(mappedArtifact)
        } else {
          setError(response.error || 'Không tìm thấy hiện vật')
        }
      } catch (err) {
        console.error('Error fetching artifact:', err)
        setError('Đã xảy ra lỗi khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    fetchArtifact()
  }, [artifactId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mb-4"></div>
            <p className="text-lg text-gray-700">Đang tải dữ liệu...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !artifact) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-primary-dark mb-4">
            {error || 'Không tìm thấy hiện vật'}
          </h1>
          <Link href="/artifact" className="btn-primary inline-block">
            Quay lại danh sách
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const qrValue = `${typeof window !== 'undefined' ? window.location.origin : ''}/artifact/${artifactId}`

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <Link
          href="/artifact"
          className="inline-flex items-center text-primary-dark hover:text-primary-dark mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại danh sách
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ảnh chính */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-xl p-6 border-4 border-primary-dark">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-white via-blue-50 to-primary-dark rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                <span className="text-8xl">📦</span>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 italic">
                  Hiện vật được trưng bày tại {artifact.space}
                </p>
              </div>
            </div>

            {/* Ảnh phụ */}
            {artifact.images && artifact.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {artifact.images.slice(1).map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="aspect-square bg-blue-50 rounded-lg overflow-hidden flex items-center justify-center"
                  >
                    <span className="text-3xl">📷</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thông tin bên phải */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
                {artifact.name}
              </h1>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 text-primary-dark mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-primary-dark">Năm sử dụng</p>
                    <p className="text-gray-700">{artifact.year}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-primary-dark mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-primary-dark">Khoa phòng / Bối cảnh</p>
                    <p className="text-gray-700">{artifact.department}</p>
                    <p className="text-sm text-gray-600 mt-1">{artifact.context}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">
                Mô tả lịch sử
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {artifact.description}
              </p>
              
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-primary-dark">
              <div className="flex items-center mb-4">
                <QrCode className="w-6 h-6 mr-2 text-primary-dark" />
                <h3 className="text-lg font-bold text-primary-dark">
                  QR Code hiện vật
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Quét mã QR để xem thông tin hiện vật này trên điện thoại
              </p>
              <div className="bg-white p-4 rounded-lg flex justify-center border-2 border-gray-200">
                <QRCode
                  value={qrValue}
                  size={200}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  viewBox="0 0 256 256"
                />
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Dùng để đặt tại phòng trưng bày thật
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
