import React from 'react';
import { Trash2, Lock, Unlock } from 'lucide-react';
import { CabinetItem } from '../../types/quote';
import { useEffect, useState } from 'react';
import { getProducts, getMaterials } from '../../services/catalogService';
import { getPricingRules } from '../../services/presetService';
import { calculateDisplayedPrice } from '../../services/priceCalculationService';

interface QuoteItemProps {
  item: CabinetItem;
  onUpdate: (id: string, updates: Partial<CabinetItem>) => void;
  onDelete: (id: string) => void;
}

export function QuoteItem({ item, onUpdate, onDelete }: QuoteItemProps) {
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [displayedPrice, setDisplayedPrice] = useState(0);
  const [isPriceLocked, setIsPriceLocked] = useState(true);

  useEffect(() => {
    setProducts(getProducts());
    setMaterials(getMaterials());
  }, []);

  useEffect(() => {
    const product = products.find(p => p.id === item.productId);
    setSelectedProduct(product);
    if (product && isPriceLocked) {
      const rules = getPricingRules();
      const calculatedPrice = calculateDisplayedPrice(product.unitCost, item.width, item.height, item.depth);
      setDisplayedPrice(calculatedPrice);
      onUpdate(item.id, { price: calculatedPrice });
    }
  }, [item.productId, item.width, item.height, item.depth, products, isPriceLocked]);

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      onUpdate(item.id, {
        productId,
        price: product.unitCost,
        material: product.materials[0]
      });
    }
  };

  const getMaterialName = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    return material?.name || 'Default';
  };

  const handlePriceChange = (value: number) => {
    if (!isPriceLocked) {
      onUpdate(item.id, { price: value });
      setDisplayedPrice(value);
    }
  };

  const togglePriceLock = () => {
    setIsPriceLocked(!isPriceLocked);
  };

  return (
    <tr>
      <td className="px-3 py-4 whitespace-nowrap">
        <select
          value={item.productId || ''}
          onChange={(e) => handleProductChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <select
          value={item.material || ''}
          onChange={(e) => onUpdate(item.id, { material: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={!selectedProduct}
        >
          <option value="">Select material</option>
          {selectedProduct?.materials.map((materialId) => (
            <option key={materialId} value={materialId}>
              {getMaterialName(materialId)}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <input
          type="number"
          value={item.width}
          onChange={(e) => onUpdate(item.id, { width: Number(e.target.value) })}
          className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Width"
        />
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <input
          type="number"
          value={item.height}
          onChange={(e) => onUpdate(item.id, { height: Number(e.target.value) })}
          className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Height"
        />
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <input
          type="number"
          value={item.depth}
          onChange={(e) => onUpdate(item.id, { depth: Number(e.target.value) })}
          className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Depth"
        />
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center justify-end space-x-2">
          <input
            type="number"
            value={displayedPrice}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            disabled={isPriceLocked}
            className={`block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-right ${
              isPriceLocked ? 'bg-gray-50' : ''
            }`}
          />
          <button
            onClick={togglePriceLock}
            className={`text-gray-500 hover:text-gray-700 ${
              !isPriceLocked ? 'text-indigo-600 hover:text-indigo-700' : ''
            }`}
            title={isPriceLocked ? 'Unlock price for manual input' : 'Lock price for automatic calculation'}
          >
            {isPriceLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </button>
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-right">
        <button 
          onClick={() => onDelete(item.id)}
          className="text-red-600 hover:text-red-900 ml-2"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}