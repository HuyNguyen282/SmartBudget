import type { Metadata } from "next"
import "./globals.css" // Thêm dòng này để dự án nhận CSS toàn cục nhé!

export const metadata: Metadata = {
  title: "SmartBudget",
  description: "Kiểm soát tài chính trong tầm tay bạn",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>{children}</body> 
    </html>
  )
}