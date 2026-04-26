'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Edit } from 'lucide-react'
import axios from 'axios'
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

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AddProductModal } from './add-product-modal'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import api from '@/lib/api'

export function AvailableProducts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const categories = ['ALL', 'BEVERAGE', 'EQUIPMENT', 'OTHERS']

  const fetchProducts = async () => {
    try {
      // const response = await axios.get('http://localhost:8080/products')
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'BEVERAGE': return '🥤'
      case 'EQUIPMENT': return '🏸'
      case 'OTHERS': return '⚡'
      default: return '📦'
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleProductSuccess = (product: Product) => {
    if (editingProduct) {
      // Update existing product in the list
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)))
    } else {
      // Add new product to the list
      setProducts((prev) => [...prev, product])
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    try {
      // await axios.delete(`http://localhost:8080/products/${product.id}`)
      await api.delete('/products/${product.id}')
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id))
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    }
  }

  const categoryData = [
    { name: 'EQUIPMENT', value: 46 },
    { name: 'BEVERAGE', value: 32 },
    { name: 'OTHERS', value: 22 },
  ]

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === 'ALL' || product.category === selectedCategory) &&
      product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Available Products</h1>
      </div>

      {/* Total product */}
      <div className='mb-8'>
        <span className="font-bold text-white mb-2">Total product: {products.length}</span>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <Input
            placeholder="SEARCH CATALOG..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white pl-10 placeholder-slate-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white font-bold text-xs h-9">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="font-bold text-xs focus:bg-slate-700 focus:text-white cursor-pointer"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold"
          onClick={() => { setEditingProduct(null); setIsModalOpen(true) }}
        >
          <Plus className="w-4 h-4 mr-2" />
          ADD NEW PRODUCT
        </Button>
      </div>

      {/* Products Table */}
      <Card className="bg-slate-900 border-slate-800 mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left p-6 text-slate-400 text-xs font-bold">PRODUCT DETAIL</th>
                <th className="text-left p-6 text-slate-400 text-xs font-bold">CATEGORY</th>
                <th className="text-left p-6 text-slate-400 text-xs font-bold">PRICE</th>
                <th className="text-left p-6 text-slate-400 text-xs font-bold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-2xl">
                        {getCategoryIcon(product.category)}
                      </div>
                      <div>
                        <div className="text-white font-bold">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <Badge className="bg-cyan-500 bg-opacity-20 text-cyan-500 hover:bg-cyan-500 hover:bg-opacity-30">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="p-6">
                    <div className="text-cyan-500 font-bold">{product.price.toLocaleString('vi-VN')}đ</div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0 bg-slate-800 border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500 hover:bg-slate-800"
                        title="Edit Product"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-8 w-8 p-0 bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500 hover:bg-slate-800"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-900 border-slate-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Confirm delete product</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                              Are you sure to delete <span className="font-bold text-white">"{product.name}"</span>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleProductSuccess}
        categories={categories}
        editProduct={editingProduct}
      />
    </div>
  )
}
