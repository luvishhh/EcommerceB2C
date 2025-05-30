'use server'

import { connectToDatabase } from '@/lib/db'
import Product, { IProduct } from '@/lib/db/models/product.model'
import { CATEGORY_MAPPING, PAGE_SIZE } from '@/lib/constants'

export async function getAllCategories() {
  await connectToDatabase()
  const productCounts = await Product.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: {
          category: '$category',
          subCategory: '$subCategory',
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.category',
        subcategories: {
          $push: {
            name: '$_id.subCategory',
            count: '$count',
          },
        },
        totalCount: { $sum: '$count' },
      },
    },
    { $sort: { _id: 1 } },
  ])
  // Define types for the aggregation result
  type SubcategoryCount = { name: string; count: number }
  type ProductCountData = {
    _id: string
    subcategories: SubcategoryCount[]
    totalCount: number
  } // Merge with the constant mapping to include all possible subcategories
  const categories = await Promise.all(
    Object.entries(CATEGORY_MAPPING).map(
      async ([category, allSubcategories]) => {
        const productData =
          productCounts.find((p) => p._id === category) ||
          ({
            _id: category,
            subcategories: [],
            totalCount: 0,
          } satisfies ProductCountData)

        // Create a map of existing subcategories with their counts
        const subcategoryMap = new Map(
          productData.subcategories.map((s: SubcategoryCount) => [
            s.name,
            s.count,
          ])
        ) // Include all possible subcategories, with count 0 for those without products
        const subcategories = allSubcategories.map((subName) => ({
          name: subName,
          count: subcategoryMap.get(subName) || 0,
        }))

        // Get sample product images for this category
        const sampleProducts = await Product.find(
          {
            category,
            isPublished: true,
            images: { $exists: true, $ne: [] },
          },
          {
            images: 1,
            subCategory: 1,
            _id: 0,
          }
        )
          .limit(4)
          .lean()

        // Group sample images by subcategory
        const subcategoryImages = sampleProducts.reduce(
          (acc, product) => {
            if (!acc[product.subCategory]) {
              acc[product.subCategory] = []
            }
            acc[product.subCategory].push(...product.images)
            return acc
          },
          {} as Record<string, string[]>
        )

        return {
          name: category,
          subcategories: subcategories.map((sub) => ({
            ...sub,
            sampleImages: subcategoryImages[sub.name] || [],
          })),
          count: productData.totalCount,
          // Get a representative image for the category
          featuredImage: sampleProducts[0]?.images[0] || null,
        }
      }
    )
  )

  return categories
}
export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()

  // More robust default images to use if a product has no images
  const defaultImages = [
    'https://5.imimg.com/data5/SELLER/Default/2024/9/448356866/SL/BI/VQ/2785593/6x12-inch-ss-door-hinges.jpeg', // Example Hinge 1
    'https://5.imimg.com/data5/SELLER/Default/2024/12/477202127/OM/BI/UA/121291727/4-12-inch-stainless-steel-butt-hinges.jpg', // Example Hinge 2
    'https://m.media-amazon.com/images/I/71gKog4VCuL._AC_UF1000,1000_QL80_.jpg', // Example Lock 1
    'https://m.media-amazon.com/images/I/61BQvwjB01L.jpg', // Example Lock 2
    'https://m.media-amazon.com/images/I/61YxvwkWusL.jpg', // Example Almirah Hardware 1
    'https://5.imimg.com/data5/SELLER/Default/2024/6/430299745/JP/GK/JZ/70873387/3-inch-ms-l-bracket-500x500.jpg', // Example Almirah Hardware 2
  ]

  const products = await Product.find(
    { tags: { $in: [tag] }, isPublished: true },
    {
      name: 1,
      slug: 1,
      images: 1,
      price: 1,
      listPrice: 1,
      category: 1,
      subCategory: 1,
      description: 1,
      _id: 0,
    }
  )
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  // Ensure every product has at least one image, using fallbacks if necessary
  const productsWithGuaranteedImages = products.map((product) => {
    // If product has no images, use default images
    if (!product.images || product.images.length === 0) {
      return {
        ...product,
        images: defaultImages.slice(0, 4), // Use first 4 default images as fallback
      }
    }
    // If product has images, ensure we return at least 4 by potentially padding with fallbacks
    const existingImages = product.images
    if (existingImages.length < 4) {
      const imagesToPad = defaultImages.slice(0, 4 - existingImages.length)
      return {
        ...product,
        images: [...existingImages, ...imagesToPad],
      }
    }

    // Otherwise, just use the first 4 existing images
    return {
      ...product,
      images: existingImages.slice(0, 4),
    }
  })

  return productsWithGuaranteedImages.map((product) => ({
    name: product.name,
    href: `/product/${product.slug}`,
    image: product.images[0], // This will now always be a valid URL from either fetched data or fallbacks
    images: product.images, // This will contain at least 4 images (fetched or fallbacks)
    price: product.price,
    listPrice: product.listPrice,
    category: product.category,
    subCategory: product.subCategory,
    description:
      product.description?.slice(0, 100) +
      (product.description && product.description.length > 100 ? '...' : ''), // Truncate description
  }))
}
export async function getSubcategoriesForCategory(category: string) {
  // Get all possible subcategories for this category
  const allSubcategories =
    CATEGORY_MAPPING[category as keyof typeof CATEGORY_MAPPING] || []

  // Get subcategories that have products
  const existingSubcategories = await Product.find({
    category,
    isPublished: true,
  }).distinct('subCategory')

  // Create a set of existing subcategories for quick lookup
  const existingSet = new Set(existingSubcategories)

  // Return all subcategories with a flag indicating if they have products
  return allSubcategories.map((subcategory) => ({
    name: subcategory,
    hasProducts: existingSet.has(subcategory),
  }))
}

export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string
  limit?: number
}) {
  await connectToDatabase()
  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as IProduct[]
}
// GET ONE PRODUCT BY SLUG
export async function getProductBySlug(slug: string) {
  await connectToDatabase()
  const product = await Product.findOne({ slug, isPublished: true }).lean()
  if (!product) throw new Error('Product not found')
  return JSON.parse(JSON.stringify(product)) as IProduct
}
// GET RELATED PRODUCTS: PRODUCTS WITH SAME CATEGORY AND SUBCATEGORY
export async function getRelatedProductsByCategory({
  category,
  subCategory,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string
  subCategory?: string
  productId: string
  limit?: number
  page: number
}) {
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit

  // Base conditions
  const conditions: Record<string, unknown> = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  }

  // Add subcategory condition if provided
  if (subCategory) {
    conditions.subCategory = subCategory
  }

  const products = await Product.find(conditions)
    .sort({ numSales: 'desc' })
    .skip(skipAmount)
    .limit(limit)
    .lean()

  const productsCount = await Product.countDocuments(conditions)

  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  }
}
// GET ALL PRODUCTS
export async function getAllProducts({
  query,
  limit,
  page,
  category,
  subCategory,
  tag,
  price,
  rating,
  sort,
}: {
  query: string
  category: string
  subCategory?: string
  tag: string
  limit?: number
  page: number
  price?: string
  rating?: string
  sort?: string
}) {
  limit = limit || PAGE_SIZE
  await connectToDatabase()

  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {}
  const categoryFilter = category && category !== 'all' ? { category } : {}
  const subCategoryFilter =
    subCategory && subCategory !== 'all' ? { subCategory } : {}
  const tagFilter = tag && tag !== 'all' ? { tags: tag } : {}

  const ratingFilter =
    rating && rating !== 'all'
      ? {
          avgRating: {
            $gte: Number(rating),
          },
        }
      : {}
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {}
  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }
  const isPublished = { isPublished: true }
  const products = await Product.find({
    ...isPublished,
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...subCategoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean()

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...subCategoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + products.length,
  }
}

export async function getAllTags() {
  const tags = await Product.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
    { $project: { _id: 0, uniqueTags: 1 } },
  ])
  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      ) as string[]) || []
  )
}
