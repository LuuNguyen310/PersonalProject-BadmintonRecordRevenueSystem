'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Dashboard } from '@/components/dashboard'
import { SessionPaymentAudit } from '@/components/session-payment-audit'
import { AvailableProducts } from '@/components/available-products'
import { ShiftVerdict } from '@/components/shift-verdict'
import { Testing } from '@/components/testing'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'payment-audit':
        return <SessionPaymentAudit />
      case 'products':
        return <AvailableProducts />
      case 'shift-verdict':
        return <ShiftVerdict />
      case 'testing':
        return <Testing />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  )
}
