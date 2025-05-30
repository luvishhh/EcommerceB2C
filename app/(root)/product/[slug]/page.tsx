import { Card, CardContent } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import { Separator } from '@/components/ui/separator'
import ProductSlider from '@/components/shared/product/product-slider'
import Rating from '@/components/shared/product/rating'
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from '@/lib/actions/product.action'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return { title: 'Product not found' }
  }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images,
    },
  }
}

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const searchParams = await props.searchParams
  const { page, color, size } = searchParams
  const params = await props.params
  const { slug } = params

  const product = await getProductBySlug(slug)
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    subCategory: product.subCategory,
    productId: product._id,
    page: Number(page || '1'),
  })

  return (
    <div>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          <div className='col-span-2'>
            <ProductGallery images={product.images} />
          </div>

          <div className='flex w-full flex-col gap-2 md:p-5 col-span-2'>
            <div className='flex flex-col gap-3'>
              <p className='p-medium-16 rounded-full bg-grey-500/10 text-grey-500'>
                Brand {product.brand} {product.category}
              </p>
              <h1 className='font-bold text-lg lg:text-xl'>{product.name}</h1>
              <div className='flex items-center gap-2'>
                <span>{product.avgRating.toFixed(1)}</span>
                <Rating rating={product.avgRating} />
                <span>{product.numReviews} ratings</span>
              </div>
              <Separator />
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <div className='flex gap-3'>
                  <ProductPrice
                    price={Number(product.price) || 0}
                    listPrice={
                      product.listPrice ? Number(product.listPrice) : undefined
                    }
                    isDeal={product.tags.includes('todays-deal')}
                    forListing={false}
                  />
                </div>
              </div>
            </div>
            <div>
              <SelectVariant
                product={product}
                size={size || product.sizes[0]}
                color={color || product.colors[0]}
              />
            </div>
            <Separator className='my-2' />
            <div className='flex flex-col gap-2'>
              <p className='p-bold-20 text-grey-600 font-bold'>Description:</p>
              <p className='p-medium-16 lg:p-regular-18'>
                {product.description}
              </p>
            </div>
            {/* Product Attributes */}
            <div className='mt-6'>
              <p className='p-bold-20 text-grey-600 mb-4 font-bold'>
                Product Details:
              </p>
              <div className='flex flex-wrap gap-3'>
                <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-grey-500/10'>
                  <span className='text-grey-500'>Category:</span>
                  <span className='font-medium'>{product.category}</span>
                </div>
                <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-grey-500/10'>
                  <span className='text-grey-500'>Subcategory:</span>
                  <span className='font-medium'>{product.subCategory}</span>
                </div>
                {product.brand && (
                  <div className='flex items-center gap-2 px-4 py-2 rounded-full bg-grey-500/10'>
                    <span className='text-grey-500'>Brand:</span>
                    <span className='font-medium'>{product.brand}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className='p-4 flex flex-col gap-4'>
                <ProductPrice price={Number(product.price) || 0} />

                {product.countInStock > 0 && product.countInStock <= 3 && (
                  <div className='text-destructive font-bold'>
                    {`Only ${product.countInStock} left in stock - order soon`}
                  </div>
                )}
                {product.countInStock !== 0 ? (
                  <div className='text-green-700 text-xl'>In Stock</div>
                ) : (
                  <div className='text-destructive text-xl'>Out of Stock</div>
                )}

                {/* Shipping Information */}
                <div className='mt-2'>
                  <p className='font-semibold'>Shipping Information:</p>
                  <p className='text-sm text-grey-600'>
                    Free shipping on orders over $50
                  </p>
                  <p className='text-sm text-grey-600'>
                    Estimated delivery: 2-4 business days
                  </p>
                </div>

                {/* Return Policy */}
                <div className='mt-2'>
                  <p className='font-semibold'>Return Policy:</p>
                  <p className='text-sm text-grey-600'>
                    30-day return policy. Items must be unused and in original
                    packaging.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className='mt-10'>
        <ProductSlider
          products={relatedProducts.data}
          title={`Best Sellers in ${product.category}`}
        />
      </section>
    </div>
  )
}
