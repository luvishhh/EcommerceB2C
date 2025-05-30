import { NextRequest, NextResponse } from 'next/server'

import Product from '@/lib/db/models/product.model'
import { connectToDatabase } from '@/lib/db'

export const GET = async (request: NextRequest) => {
  const listType = request.nextUrl.searchParams.get('type') || 'history'
  const productIdsParam = request.nextUrl.searchParams.get('ids')
  const categoriesParam = request.nextUrl.searchParams.get('categories')
  const subCategoriesParam = request.nextUrl.searchParams.get('subCategories')

  if (!productIdsParam || !categoriesParam) {
    return NextResponse.json([])
  }

  const productIds = productIdsParam.split(',')
  const categories = categoriesParam.split(',')
  const subCategories = subCategoriesParam?.split(',') || []

  await connectToDatabase()

  // For history view, just return the products in the same order as the IDs
  if (listType === 'history') {
    const products = await Product.find({
      _id: { $in: productIds },
    })
    return NextResponse.json(
      products.sort(
        (a, b) =>
          productIds.indexOf(a._id.toString()) -
          productIds.indexOf(b._id.toString())
      )
    )
  }

  // For related products, try to find products in the same subcategory first
  // If not enough products found, fall back to same category
  const subCategoryFilter = {
    subCategory: { $in: subCategories },
    _id: { $nin: productIds },
    isPublished: true,
  }

  let products = await Product.find(subCategoryFilter)
    .sort({ numSales: -1 })
    .limit(10)

  // If we don't have enough products from the same subcategory,
  // get more from the same category
  if (products.length < 10) {
    const categoryFilter = {
      category: { $in: categories },
      _id: { $nin: [...productIds, ...products.map((p) => p._id.toString())] },
      isPublished: true,
    }

    const additionalProducts = await Product.find(categoryFilter)
      .sort({ numSales: -1 })
      .limit(10 - products.length)

    products = [...products, ...additionalProducts]
  }

  return NextResponse.json(products)
}
