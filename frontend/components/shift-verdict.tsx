'use client'

import { Download, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function ShiftVerdict() {
  const executionLog = [
    {
      id: 1,
      action: 'Daily Revenue Certified',
      time: '15:58:12',
      status: 'completed',
    },
    {
      id: 2,
      action: 'Digital Ledger Synchronized',
      time: '15:45:00',
      status: 'completed',
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Shift Verdict</h1>
          <p className="text-slate-400 text-sm">
            Final Daily Revenue Report • <span className="text-cyan-500">Session #882</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold gap-2">
            <Download className="w-4 h-4" />
            Export Ledger
          </Button>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold gap-2">
            <Lock className="w-4 h-4" />
            Seal Record
          </Button>
        </div>
      </div>

      {/* Main Revenue Card */}
      <Card className="bg-slate-900 border-slate-800 p-8 mb-8">
        <div className="text-slate-400 text-xs font-bold mb-4">DAILY TOTAL REVENUE</div>
        <div className="flex items-end gap-8">
          <div>
            <div className="text-6xl font-bold text-white mb-2">$12,842.50</div>
            <div className="inline-block border border-cyan-500 border-opacity-50 rounded px-4 py-2">
              <span className="text-cyan-500 text-xs font-bold flex items-center gap-1">
                📈 +14.2% VS YESTERDAY
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
          <div className="text-white text-4xl font-bold mb-2">$2,450.00</div>
          <div className="text-slate-400 text-xs">19.1% OF TOTAL DAILY VOLUME</div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white text-sm">
              🔄
            </div>
            <div className="text-slate-400 text-xs font-bold">DIGITAL TRANSFER REVENUE</div>
          </div>
          <div className="text-white text-4xl font-bold mb-2">$10,392.50</div>
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

      {/* Execution Log */}
      <div>
        <h3 className="text-slate-400 text-xs font-bold mb-6">EXECUTION LOG</h3>
        <div className="space-y-4">
          {executionLog.map((log) => (
            <Card key={log.id} className="bg-slate-900 border-slate-800 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <div className="text-white font-bold">{log.action}</div>
                </div>
                <div className="text-cyan-500 text-sm font-bold">{log.time}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
