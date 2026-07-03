import siteSettings from '@/content/site-settings.json'
import header from '@/content/header.json'
import footer from '@/content/footer.json'
import media from '@/content/media.json'
import homepage from '@/content/homepage.json'
import homepageProductAreasData from '@/content/homepage-product-areas.json'
import productsPage from '@/content/products-page.json'
import aboutPage from '@/content/about-page.json'
import contactPage from '@/content/contact-page.json'
import industries from '@/content/industries.json'
import categoriesData from '@/content/categories.json'
import productsData from '@/content/products.json'

export type Category = (typeof categoriesData.categories)[number]
export type HomepageProductArea = (typeof homepageProductAreasData.areas)[number]
export type Product = (typeof productsData.products)[number]

export const content = {
  global: siteSettings,
  header,
  footer,
  images: {
    ...media,
    heroMediaMode: homepage.hero.mediaMode || media.heroMediaMode,
    homepageHeroContinuous: homepage.hero.continuousImage || media.homepageHeroContinuous,
    homepageHero: homepage.hero.mainImage || media.homepageHero,
    homepageHeroSide1: homepage.hero.sideImage1 || media.homepageHeroSide1,
    homepageHeroSide2: homepage.hero.sideImage2 || media.homepageHeroSide2,
    homepageHeroSide3: homepage.hero.sideImage3 || media.homepageHeroSide3,
    productsHero: productsPage.hero.image || media.productsHero,
    aboutHero: aboutPage.hero.image || media.aboutHero,
    companyOperations: aboutPage.companyStatement.image || media.companyOperations,
    productHandling: aboutPage.support.image || media.productHandling,
    contactHero: contactPage.hero.image || media.contactHero,
    contactInquiry: contactPage.formIntro.image || media.contactInquiry,
  },
  homepage,
  productsPage,
  aboutPage,
  contactPage,
  industries,
  homepageProductAreas: homepageProductAreasData.areas,
  categories: categoriesData.categories,
  products: productsData.products,
}

export function sortByOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getHomepageCategories() {
  return sortByOrder(
    content.homepageProductAreas.filter((category) => category.active)
  )
}

export function getProductsPageCategories() {
  const activeCategories = content.categories.filter((category) => category.active)
  const regularCategories = activeCategories.filter(
    (category) => !category.isSpecialLastCard && category.cardType !== 'request-cta'
  )
  const requestCtaCards = activeCategories.filter(
    (category) => category.isSpecialLastCard || category.cardType === 'request-cta'
  )

  return [
    ...sortByOrder(regularCategories),
    ...requestCtaCards,
  ]
}

export function getProductsPageProducts() {
  return content.products
    .map((product, index) => ({ product, index }))
    .filter(({ product }) => product.active && product.showOnProductsPage)
    .sort((a, b) => {
      const orderDifference = a.product.sortOrder - b.product.sortOrder
      return orderDifference === 0 ? a.index - b.index : orderDifference
    })
    .map(({ product }) => product)
}

export function getHomepageProducts() {
  return sortByOrder(
    content.products.filter((product) => product.active && product.featuredOnHomepage)
  )
}

export function getCategoryName(categoryId: string) {
  return content.categories.find((category) => category.id === categoryId)?.name || categoryId
}
