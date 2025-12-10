import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Phòng Truyền Thống - Bệnh viện Trung ương Thái Nguyên',
  description: 'Kỷ niệm 75 năm thành lập - 1951-2026',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}

