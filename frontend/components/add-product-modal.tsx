import { useState, useEffect } from 'react'
import axios from 'axios'
import { Product } from './available-products'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (product: Product) => void
  categories: string[]
  editProduct?: Product | null
}

export function AddProductModal({ isOpen, onClose, onSuccess, categories, editProduct }: AddProductModalProps) {
  const [formData, setFormData] = useState({ name: '', price: '', category: 'BEVERAGE' })

  const isEditMode = editProduct

  // Pre-fill form when editing
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        price: String(editProduct.price),
        category: editProduct.category,
      })
    } else {
      setFormData({ name: '', price: '', category: 'BEVERAGE' })
    }
  }, [editProduct])

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
      }

      if (isEditMode && editProduct) {
        // PUT - Update existing product
        // const response = await axios.put(`http://localhost:8080/products/${editProduct.id}`, payload)
        const response = await api.put('/products/${editProduct.id}', payload)
        onSuccess(response.data)
      } else {
        // POST - Create new product
        // const response = await axios.post('http://localhost:8080/products', payload)
        const response = await api.post('/products', payload)
        onSuccess(response.data)
      }

      setFormData({ name: '', price: '', category: 'BEVERAGE' })
      onClose()
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} product:`, error)
      alert(`Failed to ${isEditMode ? 'update' : 'create'} product`)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-bold text-slate-400">Name</label>
            <Input
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-bold text-slate-400">Price (VND)</label>
            <Input
              type="number"
              placeholder="Product Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-bold text-slate-400">Category</label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {categories.filter(c => c !== 'ALL').map((category) => (
                  <SelectItem key={category} value={category} className="cursor-pointer focus:bg-slate-700 focus:text-white">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold"
          >
            {isEditMode ? 'Save Changes' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
