import React, { useState, useRef } from 'react'
import { 
  X, Wrench, Plus, Edit3, Trash2, Search, Filter, Image, 
  Upload, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, 
  Eye, Save, Tag, DollarSign, Layers, ChevronRight
} from 'lucide-react'
import { CARS_DATA } from '../data/carsData'

const SAMPLE_PRESET_IMAGES = [
  { label: 'Skyline R34 Blue', url: CARS_DATA[0]?.images[0] },
  { label: 'Porsche GT3 RS Green', url: CARS_DATA[1]?.images[0] },
  { label: 'Shelby Cobra Blue', url: CARS_DATA[2]?.images[0] },
  { label: 'Ferrari F40 Red', url: CARS_DATA[3]?.images[0] },
  { label: 'Dodge Charger Black', url: CARS_DATA[4]?.images[0] },
  { label: 'Lamborghini Countach White', url: CARS_DATA[5]?.images[0] },
  { label: 'Mercedes AMG ONE Silver', url: CARS_DATA[6]?.images[0] },
  { label: 'Toyota Supra MK4 White', url: CARS_DATA[7]?.images[0] }
]

const INITIAL_FORM = {
  id: '',
  name: '',
  brand: 'Hot Wheels',
  scale: '1:64',
  price: 1499,
  rating: 4.9,
  reviewsCount: 120,
  badge: 'Hot Wheels',
  material: 'Diecast Metal & Rubber',
  weight: '~145g',
  color: 'Midnight Black',
  year: '2024',
  category: 'Supercars',
  limitedEdition: 'Collector Edition Series',
  inStock: 15,
  images: [SAMPLE_PRESET_IMAGES[0]?.url || ''],
  featuresText: "Sealed blister card packaging\nReal rubber tires with custom wheels\nDiecast metal body and chassis\nDetailed headlights and rear diffuser\nIncludes protective clamshell case",
  dimensions: "7.4 cm x 3.2 cm x 2.0 cm"
}

export default function AdminInventoryModal({
  isOpen = true,
  onClose,
  cars = [],
  onAddCar,
  onUpdateCar,
  onDeleteCar,
  onResetDefaultCars,
  onPreviewCar,
  onOpenStorefront,
  onOpenOwner,
  onAddToast,
  isFullView = false
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('ALL')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [previewImageMode, setPreviewImageMode] = useState('preset') // 'preset' | 'url' | 'upload'
  const fileInputRef = useRef(null)

  if (!isOpen && !isFullView) return null

  const filteredCars = cars.filter(c => {
    const matchSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchBrand = selectedBrand === 'ALL' || c.brand.toLowerCase() === selectedBrand.toLowerCase()
    return matchSearch && matchBrand
  })

  const lowStockCount = cars.filter(c => c.inStock < 10).length
  const totalStockCount = cars.reduce((sum, c) => sum + (c.inStock || 0), 0)

  const handleOpenAdd = () => {
    setFormData({
      ...INITIAL_FORM,
      id: `dc-${Date.now().toString().slice(-4)}`
    })
    setIsEditing(true)
  }

  const handleOpenEdit = (car) => {
    setFormData({
      ...car,
      featuresText: Array.isArray(car.features) ? car.features.join('\n') : (car.features || '')
    })
    setIsEditing(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'inStock' || name === 'reviewsCount') ? Number(value) : value
    }))
  }

  // Handle image file upload
  const handleImageFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) {
      if (onAddToast) onAddToast("Image file size should be under 4MB", "error")
      return
    }
    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result
      setFormData(prev => ({
        ...prev,
        images: [dataUrl, ...(prev.images.slice(1))]
      }))
      if (onAddToast) onAddToast("Image uploaded and loaded into preview!", "success")
    }
    reader.readAsDataURL(file)
  }

  const handleSaveSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      if (onAddToast) onAddToast("Please provide a model name", "error")
      return
    }

    const featuresArray = formData.featuresText
      ? formData.featuresText.split('\n').map(f => f.trim()).filter(Boolean)
      : ["Premium diecast metal body", "Collector edition packaging"]

    const carToSave = {
      ...formData,
      features: featuresArray,
      badge: formData.brand,
      images: formData.images && formData.images.length > 0 ? formData.images : [SAMPLE_PRESET_IMAGES[0]?.url]
    }

    const existingIndex = cars.findIndex(c => c.id === carToSave.id)
    if (existingIndex >= 0) {
      onUpdateCar(carToSave)
      if (onAddToast) onAddToast(`Updated model "${carToSave.name}"`, "success")
    } else {
      onAddCar(carToSave)
      if (onAddToast) onAddToast(`Added new model "${carToSave.name}" to catalog!`, "success")
    }

    setIsEditing(false)
  }

  const handleStockStep = (carId, delta) => {
    const car = cars.find(c => c.id === carId)
    if (!car) return
    const newStock = Math.max(0, (car.inStock || 0) + delta)
    onUpdateCar({ ...car, inStock: newStock })
  }

  const handleDelete = (car) => {
    if (window.confirm(`Are you sure you want to remove "${car.name}" from catalog?`)) {
      onDeleteCar(car.id)
      if (onAddToast) onAddToast(`Removed "${car.name}" from catalog`, "info")
    }
  }

  const content = (
    <div className={`admin-dialog-inner ${isFullView ? 'full-view' : 'modal-mode'}`}>
      {!isFullView && onClose && (
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      )}

      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-title-group">
          <div className="admin-badge">
            <Wrench size={15} color="#10b981" />
            <span>Inventory & Catalog Console</span>
          </div>
          <h2 className="admin-main-title">Diecast Product Listing Manager</h2>
          <p className="admin-subtitle">
            Add new cars, update prices, manage stock quantities, adjust specifications, and upload photographs.
          </p>
        </div>

        <div className="admin-top-actions">
          {onOpenStorefront && (
            <button 
              className="btn-secondary btn-sm"
              onClick={onOpenStorefront}
              title="View Live Storefront"
            >
              <Eye size={14} /> View Storefront
            </button>
          )}
          {onOpenOwner && (
            <button 
              className="btn-secondary btn-sm"
              onClick={onOpenOwner}
              title="View Owner Financials"
            >
              <Crown size={14} color="#f59e0b" /> Sales Analytics
            </button>
          )}
          <button 
            className="btn-secondary btn-sm"
            onClick={() => {
              if (window.confirm("Reset all catalog models back to defaults? Custom additions will be overwritten.")) {
                onResetDefaultCars()
                if (onAddToast) onAddToast("Catalog reset to default diecast collection", "info")
              }
            }}
            title="Reset Catalog to Defaults"
          >
            <RefreshCw size={14} /> Reset Defaults
          </button>
          <button 
            className="btn-primary btn-sm"
            onClick={handleOpenAdd}
          >
            <Plus size={16} /> Add New Diecast Model
          </button>
        </div>
      </div>

        {/* Stock & Stats Chips */}
        <div className="admin-stats-row">
          <div className="admin-stat-chip">
            <Layers size={15} color="#3b82f6" />
            <span><strong>{cars.length}</strong> Total Models</span>
          </div>
          <div className="admin-stat-chip">
            <Tag size={15} color="#10b981" />
            <span><strong>{totalStockCount}</strong> Total Stock Units</span>
          </div>
          {lowStockCount > 0 && (
            <div className="admin-stat-chip warning">
              <AlertTriangle size={15} color="#f59e0b" />
              <span><strong>{lowStockCount}</strong> Low Stock (&lt; 10 units)</span>
            </div>
          )}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <Search size={15} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search model by name, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="admin-filter-selects">
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Brands</option>
              <option value="Hot Wheels">Hot Wheels</option>
              <option value="Matchbox">Matchbox</option>
              <option value="Mini GT">Mini GT</option>
            </select>
          </div>
        </div>

        {/* Listing Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Model Details</th>
                <th>Brand & Scale</th>
                <th>Category</th>
                <th>Retail Price</th>
                <th>Live Stock Stepper</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map(car => (
                <tr key={car.id}>
                  <td>
                    <div className="model-cell">
                      <img 
                        src={car.images?.[0] || SAMPLE_PRESET_IMAGES[0].url} 
                        alt={car.name} 
                        className="admin-car-thumb"
                      />
                      <div>
                        <strong className="model-name-text">{car.name}</strong>
                        <span className="model-id-text">{car.id} • {car.year}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="brand-pill">{car.brand}</span>
                    <span className="scale-pill-sub">{car.scale}</span>
                  </td>
                  <td>
                    <span className="category-text">{car.category}</span>
                  </td>
                  <td>
                    <strong className="price-cell-text">₹{car.price.toLocaleString('en-IN')}</strong>
                  </td>
                  <td>
                    <div className="stock-stepper">
                      <button 
                        className="stock-btn" 
                        onClick={() => handleStockStep(car.id, -1)}
                        title="Decrease Stock"
                      >
                        -
                      </button>
                      <span className={`stock-count ${car.inStock < 10 ? 'low' : ''}`}>
                        {car.inStock}
                      </span>
                      <button 
                        className="stock-btn" 
                        onClick={() => handleStockStep(car.id, 1)}
                        title="Increase Stock"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions-cell">
                      <button 
                        className="icon-action-btn edit" 
                        onClick={() => handleOpenEdit(car)}
                        title="Edit Full Model Specs"
                      >
                        <Edit3 size={15} />
                      </button>
                      {onPreviewCar && (
                        <button 
                          className="icon-action-btn preview"
                          onClick={() => {
                            onClose()
                            onPreviewCar(car)
                          }}
                          title="Preview in Store Modal"
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      <button 
                        className="icon-action-btn delete" 
                        onClick={() => handleDelete(car)}
                        title="Delete from Catalog"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD / EDIT SUB-MODAL */}
        {isEditing && (
          <div className="admin-submodal-overlay" onClick={() => setIsEditing(false)}>
            <div 
              className="admin-submodal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="submodal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wrench size={18} color="#10b981" />
                  <h3>{formData.id ? `Edit: ${formData.name || 'Model'}` : 'Add New Diecast Model'}</h3>
                </div>
                <button className="modal-close-btn" onClick={() => setIsEditing(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveSubmit} className="admin-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Model Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleFormChange}
                      placeholder="e.g. 1970 Ford Mustang Boss 302"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Brand Manufacturer *</label>
                    <select name="brand" value={formData.brand} onChange={handleFormChange}>
                      <option value="Hot Wheels">Hot Wheels</option>
                      <option value="Matchbox">Matchbox</option>
                      <option value="Mini GT">Mini GT</option>
                      <option value="Tarmac Works">Tarmac Works</option>
                      <option value="Inno64">Inno64</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Scale *</label>
                    <select name="scale" value={formData.scale} onChange={handleFormChange}>
                      <option value="1:64">1:64 (Standard Hot Wheels scale)</option>
                      <option value="1:43">1:43 (Mid-scale collector)</option>
                      <option value="1:24">1:24 (Display scale)</option>
                      <option value="1:18">1:18 (Large premium display)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={formData.category} onChange={handleFormChange}>
                      <option value="Supercars">Supercars</option>
                      <option value="JDM Legends">JDM Legends</option>
                      <option value="American Muscle">American Muscle</option>
                      <option value="Race & GT">Race & GT</option>
                      <option value="Vintage Classics">Vintage Classics</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Retail Price (INR ₹) *</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleFormChange}
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Initial Stock Inventory (Units) *</label>
                    <input 
                      type="number" 
                      name="inStock" 
                      value={formData.inStock} 
                      onChange={handleFormChange}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Year / Release</label>
                    <input 
                      type="text" 
                      name="year" 
                      value={formData.year} 
                      onChange={handleFormChange}
                      placeholder="e.g. 1999 or 2024"
                    />
                  </div>

                  <div className="form-group">
                    <label>Color & Finish</label>
                    <input 
                      type="text" 
                      name="color" 
                      value={formData.color} 
                      onChange={handleFormChange}
                      placeholder="e.g. Midnight Purple with Chrome Wheels"
                    />
                  </div>

                  <div className="form-group">
                    <label>Material Construction</label>
                    <input 
                      type="text" 
                      name="material" 
                      value={formData.material} 
                      onChange={handleFormChange}
                      placeholder="e.g. Diecast Metal body with Rubber tires"
                    />
                  </div>

                  <div className="form-group">
                    <label>Limited Edition / Series Tag</label>
                    <input 
                      type="text" 
                      name="limitedEdition" 
                      value={formData.limitedEdition} 
                      onChange={handleFormChange}
                      placeholder="e.g. Modern Classics 2024 Series"
                    />
                  </div>
                </div>

                {/* Image Selection Section */}
                <div className="image-manager-section">
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Product Photograph & Media
                  </label>

                  <div className="image-source-tabs">
                    <button
                      type="button"
                      className={`img-tab ${previewImageMode === 'preset' ? 'active' : ''}`}
                      onClick={() => setPreviewImageMode('preset')}
                    >
                      Choose from Vault Presets
                    </button>
                    <button
                      type="button"
                      className={`img-tab ${previewImageMode === 'url' ? 'active' : ''}`}
                      onClick={() => setPreviewImageMode('url')}
                    >
                      Direct Image URL
                    </button>
                    <button
                      type="button"
                      className={`img-tab ${previewImageMode === 'upload' ? 'active' : ''}`}
                      onClick={() => setPreviewImageMode('upload')}
                    >
                      Upload Local Photo
                    </button>
                  </div>

                  {previewImageMode === 'preset' && (
                    <div className="preset-images-grid">
                      {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                        <div 
                          key={idx}
                          className={`preset-thumb-card ${formData.images?.[0] === preset.url ? 'selected' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, images: [preset.url] }))}
                        >
                          <img src={preset.url} alt={preset.label} />
                          <span>{preset.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {previewImageMode === 'url' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <input 
                        type="url"
                        placeholder="https://example.com/diecast-car.jpg"
                        value={formData.images?.[0] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
                        className="checkout-input"
                      />
                    </div>
                  )}

                  {previewImageMode === 'upload' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef}
                        onChange={handleImageFile}
                        style={{ display: 'none' }}
                      />
                      <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={15} /> Select Image File from Computer
                      </button>
                    </div>
                  )}

                  {formData.images?.[0] && (
                    <div className="image-live-preview">
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live Image Preview:</span>
                      <img src={formData.images[0]} alt="Preview" className="preview-box-img" />
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label>Features & Collector Highlights (One per line)</label>
                  <textarea 
                    rows={4}
                    name="featuresText"
                    value={formData.featuresText}
                    onChange={handleFormChange}
                    placeholder="Sealed blister card packaging&#10;Real rubber tires with 5-spoke wheels&#10;Diecast metal body casting"
                  />
                </div>

                <div className="submodal-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                  >
                    <Save size={16} /> {formData.id ? 'Save Changes' : 'Create & List Model'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  )

  if (isFullView) {
    return (
      <div className="admin-full-page-wrapper">
        <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1400px' }}>
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog admin-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  )
}
