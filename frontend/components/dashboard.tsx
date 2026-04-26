'use client'

import { Download, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Payment } from '@/components/session-payment-audit'
import axios from 'axios'
import { useEffect, useState } from 'react'
import api from '@/lib/api'

export function Dashboard() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // axios.get<Payment[]>('http://localhost:8080/payments')
    api.get<Payment[]>('/payments')
      .then(res => setPayments(res.data))
      .catch(err => console.error('Failed to fetch payments:', err))
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <h1 className="text-slate-400 text-xs font-bold">{mounted ? new Date().toLocaleDateString() : ""}</h1>
        </div>
        <div className="flex gap-3">
          <Button className="bg-green-800 hover:bg-green-700 text-slate-300 font-bold gap-2">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Main Revenue Card */}
      <Card className="bg-slate-900 border-slate-800 p-8 mb-8">
        <div className="text-slate-400 text-xs font-bold mb-4">DAILY TOTAL REVENUE</div>
        <div className="flex items-end gap-8">
          <div>
            <div className="text-6xl font-bold text-white mb-2">{payments.reduce((sum, payment) => sum + payment.total, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
            <div className="inline-block border border-cyan-500 border-opacity-50 rounded px-4 py-2">
              <span className="text-cyan-500 text-xs font-bold flex items-center gap-1">
                Improving ...
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center text-white text-sm">
              💰
            </div>
            <div className="text-slate-400 text-xs font-bold">CASH REVENUE</div>
          </div>
          <div className="text-white text-4xl font-bold mb-2">{payments.filter((payment) => payment.paymentType === 'CASH').reduce((sum, payment) => sum + payment.total, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
          <div className="text-slate-400 text-xs">19.1% OF TOTAL DAILY VOLUME</div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white text-sm">
              🔄
            </div>
            <div className="text-slate-400 text-xs font-bold">BANKING TRANSFER REVENUE</div>
          </div>
          <div className="text-white text-4xl font-bold mb-2">
            {payments.filter((payment) => payment.paymentType === 'BANKING').reduce((sum, payment) => sum + payment.total, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </div>
          <div className="space-y-1">
            <div className="text-slate-400 text-xs">💳 CREDIT CARDS: $8,122.50</div>
            <div className="text-slate-400 text-xs">💻 DIGITAL WALLETS: $2,270.00</div>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="text-slate-400 text-xs font-bold mb-4">TOTAL SESSIONS</div>
          <div className="text-white text-4xl font-bold">42</div>
          <div className="text-slate-400 text-xs mt-2">UNITS</div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="text-slate-400 text-xs font-bold mb-4">EFFICIENCY RATING</div>
          <div className="text-cyan-500 text-4xl font-bold">84%</div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6 flex items-end">
          <div className="w-full">
            <div className="text-slate-400 text-xs font-bold mb-4">PRODUCT UPSELL</div>
            <div className="flex justify-between items-end">
              <div className="text-white text-4xl font-bold">$3,105.00</div>
              <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-slate-300">
                🛒
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
