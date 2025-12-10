'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Book from '@/components/Book'
import { Filter, Download, X } from 'lucide-react'

// Dữ liệu mẫu
const certificates = [
  {
    id: 1,
    name: 'Bằng khen của Bộ Y tế',
    level: 'Bộ Y tế',
    year: 2020,
    department: 'Toàn bệnh viện',
    image: '/cert-1.jpg',
    description: 'Thành tích xuất sắc trong công tác phòng chống dịch bệnh',
  },
  {
    id: 2,
    name: 'Huân chương Lao động hạng Nhì',
    level: 'Nhà nước',
    year: 2015,
    department: 'Toàn bệnh viện',
    image: '/cert-2.jpg',
    description: 'Ghi nhận những đóng góp to lớn trong sự nghiệp y tế',
  },
  {
    id: 3,
    name: 'Bằng khen của Tỉnh Thái Nguyên',
    level: 'Tỉnh',
    year: 2018,
    department: 'Khoa Ngoại',
    image: '/cert-3.jpg',
    description: 'Thành tích xuất sắc trong công tác khám chữa bệnh',
  },
  {
    id: 4,
    name: 'Giấy khen tập thể lao động xuất sắc',
    level: 'Bộ Y tế',
    year: 2022,
    department: 'Khoa Nội',
    image: '/cert-4.jpg',
    description: 'Tập thể lao động xuất sắc năm 2022',
  },
  {
    id: 5,
    name: 'Bằng khen đơn vị dẫn đầu',
    level: 'Bộ Y tế',
    year: 2021,
    department: 'Toàn bệnh viện',
    image: '/cert-5.jpg',
    description: 'Đơn vị dẫn đầu trong phong trào thi đua yêu nước',
  },
  {
    id: 6,
    name: 'Giấy khen khoa phòng xuất sắc',
    level: 'Bệnh viện',
    year: 2023,
    department: 'Khoa Sản',
    image: '/cert-6.jpg',
    description: 'Khoa phòng đạt thành tích xuất sắc năm 2023',
  },
]

const levels = ['Tất cả', 'Nhà nước', 'Bộ Y tế', 'Tỉnh', 'Bệnh viện']
const years = ['Tất cả', 2023, 2022, 2021, 2020, 2019, 2018, 2015]
const departments = ['Tất cả', 'Toàn bệnh viện', 'Khoa Nội', 'Khoa Ngoại', 'Khoa Sản']

export default function SoVangPage() {
  const [selectedLevel, setSelectedLevel] = useState('Tất cả')
  const [selectedYear, setSelectedYear] = useState('Tất cả')
  const [selectedDepartment, setSelectedDepartment] = useState('Tất cả')
  const [selectedCert, setSelectedCert] = useState<typeof certificates[0] | null>(null)

  const filteredCerts = certificates.filter((cert) => {
    const matchLevel = selectedLevel === 'Tất cả' || cert.level === selectedLevel
    const matchYear = selectedYear === 'Tất cả' || cert.year === selectedYear
    const matchDept = selectedDepartment === 'Tất cả' || cert.department === selectedDepartment
    return matchLevel && matchYear && matchDept
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
            Sổ vàng – Bằng khen
          </h1>
          <p className="text-lg text-gray-700">
            Thành tựu và vinh dự qua 75 năm phát triển
          </p>
        </div>

        {/* Filter Section - Top */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Filter className="w-5 h-5 mr-2 text-primary-dark" />
              <h2 className="text-xl font-bold text-primary-dark">Bộ lọc</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Lọc theo cấp khen */}
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-2">
                  Cấp khen
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lọc theo năm */}
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-2">
                  Năm nhận
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lọc theo khoa phòng */}
              <div>
                <label className="block text-sm font-semibold text-primary-dark mb-2">
                  Khoa phòng
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Book Component */}
        <Book
          certificates={filteredCerts}
          onPageClick={(cert) => setSelectedCert(cert)}
        />
      </div>

      {/* Modal chi tiết */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-primary-dark">
                  {selectedCert.name}
                </h2>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="aspect-[4/3] bg-gradient-to-br from-white to-primary-dark flex items-center justify-center rounded">
                    <span className="text-6xl">🏆</span>
                  </div>
                </div>

                <div>
                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="font-semibold text-primary-dark">Cấp khen:</span>
                      <p className="text-gray-700">{selectedCert.level}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-primary-dark">Năm nhận:</span>
                      <p className="text-gray-700">{selectedCert.year}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-primary-dark">Khoa phòng:</span>
                      <p className="text-gray-700">{selectedCert.department}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-primary-dark mb-2">Mô tả:</h3>
                    <p className="text-gray-700">{selectedCert.description}</p>
                  </div>

                  <button className="btn-primary w-full flex items-center justify-center">
                    <Download className="w-5 h-5 mr-2" />
                    Tải PDF
                  </button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-primary-dark mb-3">
                  Câu chuyện đằng sau thành tích
                </h3>
                <p className="text-gray-700">
                  {selectedCert.description} Đây là một thành tích đáng tự hào, thể hiện sự nỗ lực không ngừng
                  của toàn thể cán bộ, nhân viên bệnh viện trong công tác chăm sóc sức khỏe nhân dân.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
