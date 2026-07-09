import siteSettings from '@/content/site-settings.json'
import header from '@/content/header.json'
import footer from '@/content/footer.json'
import media from '@/content/media.json'
import homepage from '@/content/homepage.json'
import homepageProductAreasData from '@/content/homepage-product-areas.json'
import productsPage from '@/content/products-page.json'
import aboutPage from '@/content/about-page.json'
import contactPage from '@/content/contact-page.json'
import accessibilityPage from '@/content/accessibility-page.json'
import industries from '@/content/industries.json'
import categoriesData from '@/content/categories.json'
import productsData from '@/content/products.json'

export const contentDocuments = {
  'src/content/site-settings.json': siteSettings,
  'src/content/header.json': header,
  'src/content/footer.json': footer,
  'src/content/media.json': media,
  'src/content/homepage.json': homepage,
  'src/content/homepage-product-areas.json': homepageProductAreasData,
  'src/content/products-page.json': productsPage,
  'src/content/about-page.json': aboutPage,
  'src/content/contact-page.json': contactPage,
  'src/content/accessibility-page.json': accessibilityPage,
  'src/content/industries.json': industries,
  'src/content/categories.json': categoriesData,
  'src/content/products.json': productsData,
} as const

export const contentDocumentPaths = Object.keys(contentDocuments) as Array<keyof typeof contentDocuments>

export function buildContentFromDocuments(documents: Partial<Record<keyof typeof contentDocuments, unknown>>) {
  const resolvedDocuments = {
    ...contentDocuments,
    ...documents,
  } as typeof contentDocuments

  return {
    global: resolvedDocuments['src/content/site-settings.json'],
    header: resolvedDocuments['src/content/header.json'],
    footer: resolvedDocuments['src/content/footer.json'],
    images: {
      ...resolvedDocuments['src/content/media.json'],
      heroMediaMode: resolvedDocuments['src/content/homepage.json'].hero.mediaMode || resolvedDocuments['src/content/media.json'].heroMediaMode,
      homepageHeroContinuous: resolvedDocuments['src/content/homepage.json'].hero.continuousImage || resolvedDocuments['src/content/media.json'].homepageHeroContinuous,
      homepageHero: resolvedDocuments['src/content/homepage.json'].hero.mainImage || resolvedDocuments['src/content/media.json'].homepageHero,
      homepageHeroSide1: resolvedDocuments['src/content/homepage.json'].hero.sideImage1 || resolvedDocuments['src/content/media.json'].homepageHeroSide1,
      homepageHeroSide2: resolvedDocuments['src/content/homepage.json'].hero.sideImage2 || resolvedDocuments['src/content/media.json'].homepageHeroSide2,
      homepageHeroSide3: resolvedDocuments['src/content/homepage.json'].hero.sideImage3 || resolvedDocuments['src/content/media.json'].homepageHeroSide3,
      productsHero: resolvedDocuments['src/content/products-page.json'].hero.image || resolvedDocuments['src/content/media.json'].productsHero,
      aboutHero: resolvedDocuments['src/content/about-page.json'].hero.image || resolvedDocuments['src/content/media.json'].aboutHero,
      companyOperations: resolvedDocuments['src/content/about-page.json'].companyStatement.image || resolvedDocuments['src/content/media.json'].companyOperations,
      productHandling: resolvedDocuments['src/content/about-page.json'].support.image || resolvedDocuments['src/content/media.json'].productHandling,
      contactHero: resolvedDocuments['src/content/contact-page.json'].hero.image || resolvedDocuments['src/content/media.json'].contactHero,
      contactInquiry: resolvedDocuments['src/content/contact-page.json'].formIntro.image || resolvedDocuments['src/content/media.json'].contactInquiry,
    },
    homepage: resolvedDocuments['src/content/homepage.json'],
    productsPage: resolvedDocuments['src/content/products-page.json'],
    aboutPage: resolvedDocuments['src/content/about-page.json'],
    contactPage: resolvedDocuments['src/content/contact-page.json'],
    accessibilityPage: resolvedDocuments['src/content/accessibility-page.json'],
    industries: resolvedDocuments['src/content/industries.json'],
    homepageProductAreas: resolvedDocuments['src/content/homepage-product-areas.json'].areas,
    categories: resolvedDocuments['src/content/categories.json'].categories,
    products: resolvedDocuments['src/content/products.json'].products,
  }
}

export type SiteContent = ReturnType<typeof buildContentFromDocuments>
export type Category = SiteContent['categories'][number]
export type HomepageProductArea = SiteContent['homepageProductAreas'][number]
export type Product = SiteContent['products'][number]

export const fallbackContent = buildContentFromDocuments({})

export function sortByOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getHomepageCategories(siteContent: SiteContent) {
  return sortByOrder(
    siteContent.homepageProductAreas.filter((category) => category.active)
  )
}

export function getProductsPageCategories(siteContent: SiteContent) {
  const activeCategories = siteContent.categories.filter((category) => category.active)
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

export function getProductsPageProducts(siteContent: SiteContent) {
  return siteContent.products
    .map((product, index) => ({ product, index }))
    .filter(({ product }) => product.active && product.showOnProductsPage)
    .sort((a, b) => {
      const orderDifference = a.product.sortOrder - b.product.sortOrder
      return orderDifference === 0 ? a.index - b.index : orderDifference
    })
    .map(({ product }) => product)
}

export function getHomepageProducts(siteContent: SiteContent) {
  return sortByOrder(
    siteContent.products.filter((product) => product.active && product.featuredOnHomepage)
  )
}

export function getCategoryName(siteContent: SiteContent, categoryId: string) {
  return siteContent.categories.find((category) => category.id === categoryId)?.name || categoryId
}
