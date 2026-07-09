import {
  fallbackContent,
  getCategoryName as getCategoryNameFromContent,
  getHomepageCategories as getHomepageCategoriesFromContent,
  getHomepageProducts as getHomepageProductsFromContent,
  getProductsPageCategories as getProductsPageCategoriesFromContent,
  getProductsPageProducts as getProductsPageProductsFromContent,
  sortByOrder,
} from '@/lib/fallbackContent'

export const content = fallbackContent

export { sortByOrder }

export function getHomepageCategories() {
  return getHomepageCategoriesFromContent(content)
}

export function getProductsPageCategories() {
  return getProductsPageCategoriesFromContent(content)
}

export function getProductsPageProducts() {
  return getProductsPageProductsFromContent(content)
}

export function getHomepageProducts() {
  return getHomepageProductsFromContent(content)
}

export function getCategoryName(categoryId: string) {
  return getCategoryNameFromContent(content, categoryId)
}

export type {
  Category,
  HomepageProductArea,
  Product,
  SiteContent,
} from '@/lib/fallbackContent'
