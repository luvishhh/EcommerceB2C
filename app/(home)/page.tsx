import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
// import { Card, CardContent } from '@/components/ui/card'
import {
  getAllCategories,
  getProductsByTag,
  getProductsForCard,
} from '@/lib/actions/product.action'
import { toSlug } from '@/lib/utils'
import data from '@/lib/data'
import { Card, CardContent } from '@/components/ui/card'
import ProductSlider from '@/components/shared/product/product-slider'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'

export default async function HomePage() {
  const todaysDeals = await getProductsByTag({ tag: 'todays-deal' })
  console.log("Fetched Today's Deals:", todaysDeals)

  type CategoryType = {
    name: string
    count: number
    subcategories: Array<{
      name: string
      count: number
      sampleImages: string[]
    }>
    featuredImage: string | null
  }

  // Get all categories and filter those with products
  const categories = ((await getAllCategories()) as CategoryType[])
    .filter((category) => category.count > 0)
    .slice(0, 4)
  console.log('Fetched Categories:', categories)
  const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' })

  const newArrivals = await getProductsForCard({
    tag: 'new-arrival',
    limit: 4,
  })
  console.log('Fetched New Arrivals:', newArrivals)

  const featureds = await getProductsForCard({
    tag: 'featured',
    limit: 4,
  })
  console.log('Fetched Featured Products:', featureds)

  const bestSellers = await getProductsForCard({
    tag: 'best-seller',
    limit: 4,
  })
  console.log('Fetched Best Sellers:', bestSellers)

  const cards = [
    {
      title: 'Categories to explore',
      link: {
        text: 'See More',
        href: '/search',
      },
      items:
        categories && Array.isArray(categories)
          ? categories.map((category) => {
              const activeSubcategories = category.subcategories.filter(
                (sub) => sub.count > 0
              )
              const item = {
                name: category.name,
                // Use the first product image as category image, fallback to placeholder
                image:
                  category.featuredImage ||
                  `/images/${toSlug(category.name)}.jpg`,
                href: `/search?category=${category.name}`,
                description: `${category.count} products in ${activeSubcategories.length} subcategories`,
                // Include subcategory details for interactive display
                subcategories: activeSubcategories.map((sub) => ({
                  name: sub.name,
                  count: sub.count,
                  images: sub.sampleImages?.slice(0, 2) || [], // Show up to 2 sample images per subcategory
                })),
              }
              return item
            })
          : [], // Added check and fallback empty array
    },
    {
      title: 'Explore New Arrivals',
      items:
        newArrivals && Array.isArray(newArrivals)
          ? newArrivals.map((product) => ({
              ...product,
              image: product.images?.[0], // Use the first image from the fetched product data
              images: product.images, // Pass all images for thumbnails
            }))
          : [], // Added check and fallback empty array
      link: {
        text: 'View All',
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: 'Discover Best Sellers',
      items:
        bestSellers && Array.isArray(bestSellers)
          ? bestSellers.map((product) => ({
              ...product,
              image: product.images?.[0], // Use the first image from the fetched product data
              images: product.images, // Pass all images for thumbnails
            }))
          : [], // Added check and fallback empty array
      link: {
        text: 'View All',
        href: '/search?tag=best-seller',
      },
    },
    {
      title: 'Featured Products',
      items:
        featureds && Array.isArray(featureds)
          ? featureds.map((product) => ({
              ...product,
              image: product.images?.[0], // Use the first image from the fetched product data
              images: product.images, // Pass all images for thumbnails
            }))
          : [], // Added check and fallback empty array
      link: {
        text: 'Shop Now',
        href: '/search?tag=featured',
      },
    },
  ]

  return (
    <>
      <HomeCarousel items={data.carousels} />
      <div className='md:p-4 md:space-y-4 bg-border pt-4'>
        <HomeCard cards={cards} />
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            {/* Add check for todaysDeals before passing to ProductSlider */}
            {todaysDeals && Array.isArray(todaysDeals) && (
              <ProductSlider title={"Today's Deals"} products={todaysDeals} />
            )}
          </CardContent>
        </Card>

        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            {/* Add check for bestSellingProducts before passing to ProductSlider */}
            {bestSellingProducts && Array.isArray(bestSellingProducts) && (
              <ProductSlider
                title='Best Selling Products'
                products={bestSellingProducts}
                hideDetails
              />
            )}
          </CardContent>
        </Card>
      </div>
      <div className='p-4 bg-background'>
        <BrowsingHistoryList />
      </div>
    </>
  )
}
