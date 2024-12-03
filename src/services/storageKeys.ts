// Define all storage keys as constants to prevent typos and enable better refactoring
export const STORAGE_KEYS = {
  QUOTES: 'quotes',
  ORDERS: 'orders',
  USERS: 'users',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  MATERIALS: 'materials',
  PRODUCT_TYPES: 'productTypes',
  PRESET_VALUES: 'presetValues',
  PRICING_RULES: 'pricingRules',
  TEMPLATE_SETTINGS: 'templateSettings',
  RECEIPT_TEMPLATE: 'receiptTemplate',
  ORDER_TEMPLATE: 'orderTemplate'
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];