'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Product } from './available-products'
import api from '@/lib/api'

interface AddOnItem {
  id: number        // local id chỉ dùng để render key
  productId: number // id thật từ backend
  name: string
  qty: number
  price: number
}

interface NewSessionPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface Court {
  id: number
  name: string
}

export function NewSessionPaymentModal({ isOpen, onClose, onSuccess }: NewSessionPaymentModalProps) {
  const [selectedCourt, setSelectedCourt] = useState<string>('none')
  const [startTime, setStartTime] = useState<string>('06:00')
  const [endTime, setEndTime] = useState<string>('08:00')
  const [paymentMethod, setPaymentMethod] = useState<string>('wallet')
  const [note, setNote] = useState<string>('')
  const [addOns, setAddOns] = useState<AddOnItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [court, setCourt] = useState<Court[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch danh sách sản phẩm thật từ API khi modal mở
  useEffect(() => {
    if (isOpen) {
      // axios.get<Product[]>('http://localhost:8080/products')
      api.get<Product[]>('/products')
        .then(res => setProducts(res.data))
        .catch(err => console.error('Failed to fetch products:', err))
      // axios.get<Court[]>('http://localhost:8080/courts')
      api.get<Court[]>('/products')
        .then(res => setCourt(res.data))
        .catch(err => console.error('Failed to fetch courts:', err))
    }
  }, [isOpen])

  const handleAddItem = () => {
    setAddOns([...addOns, { id: Date.now(), productId: 0, name: '', qty: 1, price: 0 }])
  }

  const handleRemoveItem = (id: number) => {
    setAddOns(addOns.filter(item => item.id !== id))
  }

  // Khi user chọn product từ dropdown → lưu cả productId và price thật
  // Dùng productId (số) để tìm kiếm thay vì name (tránh lỗi khi có 2 sản phẩm trùng tên)
  const handleSelectProduct = (localId: number, selectedProductId: string) => {
    const selected = products.find(p => p.id === Number(selectedProductId))
    if (!selected) return
    setAddOns(addOns.map(item =>
      item.id === localId
        ? { ...item, name: selected.name, productId: selected.id, price: selected.price }
        : item
    ))
  }

  const handleUpdateQty = (localId: number, qty: number) => {
    setAddOns(addOns.map(item =>
      item.id === localId ? { ...item, qty } : item
    ))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Map paymentMethod (UI state) → paymentType (API field)
      const paymentType = paymentMethod === 'wallet' ? 'BANKING' : 'CASH'

      const paymentDetails: any[] = []

      // 1. Nếu có chọn đặt sân -> Thêm một phần tử chỉ có courtBooking
      if (selectedCourt !== 'none' && selectedCourt !== '') {
        const courtId = parseInt(selectedCourt.replace('Court ', ''), 10)
        if (!isNaN(courtId)) {
          paymentDetails.push({
            courtBooking: {
              courtId: courtId,
              startTime: startTime,
              endTime: endTime,
            }
          })
        }
      }

      // 2. Nếu có sản phẩm (addOns) -> Thêm từng phần tử sản phẩm riêng biệt
      const validAddOns = addOns.filter(item => item.productId !== 0 && item.qty > 0)
      validAddOns.forEach(item => {
        paymentDetails.push({
          productId: item.productId,
          quantity: item.qty,
        })
      })

      const payload = {
        paymentDetails,
        paymentType,
        note,
      }

      // await axios.post('http://localhost:8080/payments', payload)
      await api.post('/payments', payload)

      // Reset form
      setSelectedCourt('none')
      setStartTime('06:00')
      setEndTime('08:00')
      setPaymentMethod('wallet')
      setNote('')
      setAddOns([])

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to create payment:', error)
      alert('Failed to create payment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalAmount = addOns.reduce((sum, item) => sum + (item.qty * item.price), 0)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-white">New Payment</DialogTitle>
        </DialogHeader>

        {/* Court Selection and Session Time - Side by Side */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="text-slate-400 text-xs font-bold block mb-3">COURT SELECTION</label>
            <Select value={selectedCourt} onValueChange={setSelectedCourt}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-12">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="none" className="text-white">
                  None
                </SelectItem>
                {court.map(court => (
                  <SelectItem key={court.id} value={court.id.toString()} className="text-white">
                    {court.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourt !== 'none' && selectedCourt !== '' && (
            <div>
              <label className="text-slate-400 text-xs font-bold block mb-3">SESSION TIME</label>
              <div className="flex gap-3 items-center">
                <Input
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white flex-1 h-12"
                  placeholder="23:59"
                />
                <span className="text-slate-400 text-lg">—</span>
                <Input
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white flex-1 h-12"
                  placeholder="23:59"
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Add-ons */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <label className="text-slate-400 text-xs font-bold">PRODUCT ADD-ONS</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddItem}
              className="text-cyan-500 hover:text-cyan-400 text-xs font-bold gap-1"
            >
              <Plus className="w-4 h-4" />
              ADD ITEM
            </Button>
          </div>

          <div className="space-y-2">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-3 mb-2 px-3">
              <div className="col-span-6 text-slate-400 text-xs font-bold text-center">Item Name</div>
              <div className="col-span-4 text-slate-400 text-xs font-bold text-center">Quantity</div>
              <div className="col-span-2 text-slate-400 text-xs font-bold text-center">Actions</div>
            </div>

            {/* Item rows */}
            {addOns.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-6">
                  <Select
                    value={item.productId !== 0 ? String(item.productId) : ''}
                    onValueChange={(value) => handleSelectProduct(item.id, value)}
                  >
                    <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white h-10 text-xs">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {products.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={String(product.id)}
                          className="font-bold text-xs focus:bg-slate-700 focus:text-white cursor-pointer"
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  placeholder="Qty"
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleUpdateQty(item.id, parseInt(e.target.value) || 0)}
                  className="col-span-4 bg-slate-800 border-slate-700 text-white h-10 text-center"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="col-span-2 text-slate-400 hover:text-red-500 h-10 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="text-slate-400 text-xs font-bold block mb-3">NOTE</label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white h-12"
            placeholder="Optional note..."
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="text-slate-400 text-xs font-bold block mb-3">PAYMENT METHOD</label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setPaymentMethod('wallet')}
              className={`h-14 text-sm font-bold rounded transition-all ${paymentMethod === 'wallet'
                ? 'bg-green-500 hover:bg-green-600 text-slate-900'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
            >
              BANKING
            </Button>
            <Button
              onClick={() => setPaymentMethod('cash')}
              className={`h-14 text-sm font-bold rounded transition-all ${paymentMethod === 'cash'
                ? 'bg-green-500 hover:bg-green-600 text-slate-900'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
            >
              CASH
            </Button>
          </div>
        </div>

        {/* Total */}
        {totalAmount > 0 && (
          <div className="mb-4 p-4 bg-slate-800 rounded-lg flex justify-between items-center">
            <span className="text-slate-400 text-sm font-bold">TOTAL AMOUNT</span>
            <span className="text-cyan-400 text-xl font-bold">
              {totalAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <DialogFooter className="flex gap-3 sm:flex-row">
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 bg-slate-800 hover:bg-red-700 text-white font-bold h-12 rounded"
          >
            CANCEL
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold h-12 rounded"
          >
            {isSubmitting ? 'PROCESSING...' : 'FINALIZE PAYMENT'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
