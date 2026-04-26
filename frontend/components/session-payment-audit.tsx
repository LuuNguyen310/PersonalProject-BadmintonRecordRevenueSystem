'use client'

import { useState, useEffect } from 'react'
import { Plus, TrendingUp, DollarSign, Calendar, Shield, Loader2, Edit, Trash2 } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { NewSessionPaymentModal } from '@/components/new-session-payment-modal'
import { EditSessionPaymentModal } from '@/components/edit-session-payment-modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import api from '@/lib/api'

// Cấu trúc response từ GET /payments
interface PaymentDetail {
  productName: string | null
  courtName: string | null
  startTime: string | null
  endTime: string | null
  totalHours: number | null
  unitPrice: number
  quantity: number
  subtotal: number
}

export interface Payment {
  paymentId: number
  paymentType: string   // "BANKING" | "CASH"
  note: string | null
  total: number
  paymentDate: string
  paymentDetails: PaymentDetail[]
}

export function SessionPaymentAudit() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPaymentType, setSelectedPaymentType] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState<string>('')

  useEffect(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    setSelectedDate(`${year}-${month}-${day}`)
  }, [])

  const fetchPayments = async (date: string) => {
    if (!date) return
    setIsLoading(true)
    setError(null)
    try {
      // const response = await axios.get<Payment[]>(`http://localhost:8080/payments/by-date?date=${date}`)
      const response = await api.get<Payment[]>(`/payments/by-date?date=${date}`)
      setPayments(response.data)
    } catch (err) {
      console.error('Failed to fetch payments:', err)
      setError('Failed to load payments. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  //Thực hiện sau khi component được mount hoặc selectedDate thay đổi
  useEffect(() => {
    if (selectedDate) {
      fetchPayments(selectedDate)
    }
  }, [selectedDate]) //Dependency array

  // Sau khi tạo payment mới thành công → refetch lại danh sách
  const handlePaymentSuccess = () => {
    if (selectedDate) {
      fetchPayments(selectedDate)
    }
  }

  const handleDeletePayment = async (payment: Payment) => {
    try {
      // await axios.delete(`http://localhost:8080/payments/${payment.paymentId}`)
      await api.delete('/payments/${payment.paymentId}')
      setPayments((prevPayments) => prevPayments.filter((p) => p.paymentId !== payment.paymentId))
    } catch (error) {
      console.error('Failed to delete payment:', error)
      alert('Failed to delete payment')
    }
  }
  
  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment)
    setIsEditModalOpen(true)
  }

  const filterPayment = payments.filter((payment) => {
    if (selectedPaymentType === 'ALL') {
      return payment;
    }
    return payment.paymentType === selectedPaymentType;
  });

  const metrics = [
    {
      label: 'DAILY GROSS',
      value: filterPayment.length > 0
        ? `${filterPayment.reduce((sum, p) => sum + (p.total || 0), 0).toLocaleString('vi-VN')}đ`
        : '—',
      icon: DollarSign,
      subtext: 'Total amount of all payments',
    },
    {
      label: 'TOTAL TRANSACTIONS',
      value: String(filterPayment.length),
      subtext: 'Validated sessions',
      icon: Calendar,
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Session Payment</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          NEW PAYMENT
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="bg-slate-900 border-slate-800 p-6">
              <div className="text-slate-400 text-xs font-bold mb-3">{metric.label}</div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                  {metric.change && (
                     <div className="text-cyan-500 text-sm flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {metric.change}
                    </div>
                  )}
                  {metric.subtext && (
                    <div className="text-slate-400 text-xs">{metric.subtext}</div>
                  )}
                </div>
                <Icon className="w-5 h-5 text-slate-600" />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-4 mb-8">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white font-bold text-xs h-9 px-3 rounded-md w-[140px] focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer"
        />
        <Select value={selectedPaymentType} onValueChange={setSelectedPaymentType}>
          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white font-bold text-xs h-9">
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="ALL" className="font-bold text-xs focus:bg-slate-700 focus:text-white cursor-pointer">
              ALL
            </SelectItem>
            <SelectItem value="BANKING" className="font-bold text-xs focus:bg-slate-700 focus:text-white cursor-pointer">
              BANKING
            </SelectItem>
            <SelectItem value="CASH" className="font-bold text-xs focus:bg-slate-700 focus:text-white cursor-pointer">
              CASH
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        <div className="text-slate-400 text-xs font-bold tracking-wider">
          COURT & TIME SESSION
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <span className="ml-3 text-slate-400">Loading payments...</span>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <Card className="bg-slate-900 border-red-800 p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              onClick={fetchPayments}
              className="bg-slate-800 hover:bg-slate-700 text-white"
            >
              Retry
            </Button>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !error && payments.length === 0 && (
          <Card className="bg-slate-900 border-slate-800 p-12 text-center">
            <p className="text-slate-500 text-sm">No payments recorded yet.</p>
          </Card>
        )}

        {/* Payment cards */}
        {!isLoading && !error && filterPayment.map((payment) => (
          <Card
            key={payment.paymentId}
            className={`border-l-4 p-6 bg-slate-900 border-slate-800 ${payment.paymentType === 'CASH' ? 'border-l-green-500' : 'border-l-cyan-500'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4 flex-1">
                <div className="flex-1">
                  {/* Payment ID + Date */}
                  <div className="flex gap-4">
                    <h3 className="text-white font-bold mb-1">
                      Payment {payment.paymentId}
                    </h3>
                    <span className="text-slate-400 text-sm mb-3">|</span>
                    <p className="text-slate-400 text-sm mb-3">
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleString('vi-VN')
                        : '—'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Payment details / items */}
                    <div>
                      <div className="text-slate-400 text-xs font-bold mb-2">DETAILS</div>
                      {payment.paymentDetails && payment.paymentDetails.length > 0
                        ? payment.paymentDetails.map((detail, i) => {
                          if (detail.courtName) {
                            const start = detail.startTime ? new Date(detail.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''
                            const end = detail.endTime ? new Date(detail.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''
                            return (
                              <div key={i} className="text-slate-300 text-sm mb-1 flex justify-between">
                                <span>{detail.courtName} {start && end ? `(${start} - ${end}, Total: ${detail.totalHours}h)` : ''}</span>
                                {detail.subtotal > 0 && <span>{detail.subtotal.toLocaleString('vi-VN')}đ</span>}
                              </div>
                            )
                          } else {
                            return (
                              <div key={i} className="text-slate-300 text-sm mb-1 flex justify-between">
                                <span>{(detail.quantity && detail.quantity > 0) ? `${detail.quantity}x ` : ''}{detail.productName || 'Unknown Item'}</span>
                                {detail.subtotal > 0 && <span>{detail.subtotal.toLocaleString('vi-VN')}đ</span>}
                              </div>
                            )
                          }
                        })
                        : <div className="text-slate-500 text-sm">—</div>
                      }
                      {/* Note */}
                      {payment.note && (
                        <div className="text-slate-500 text-xs mt-2 italic">
                          Note: {payment.note}
                        </div>
                      )}
                    </div>

                    {/* Payment method */}
                    <div>
                      <div className={`text-xl font-bold mb-2 uppercase tracking-wide text-center ${payment.paymentType === 'CASH' ? 'text-green-500' : 'text-cyan-500'}`}>
                        {payment.paymentType}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total amount and Actions */}
              <div className="text-right flex flex-col items-end justify-between self-stretch">
                <div className="text-cyan-500 text-2xl font-bold mb-2">
                  {payment.total != null
                    ? `${payment.total.toLocaleString('vi-VN')}đ`
                    : '. . .'}
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 bg-slate-800 border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500 hover:bg-slate-800"
                    title="Edit Payment"
                    onClick={() => handleEditPayment(payment)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0 bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500 hover:bg-slate-800"
                        title="Delete Payment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Payment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this payment?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleDeletePayment(payment)}
                        >Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <NewSessionPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
      
      <EditSessionPaymentModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingPayment(null)
        }}
        onSuccess={handlePaymentSuccess}
        payment={editingPayment}
      />
    </div>
  )
}
