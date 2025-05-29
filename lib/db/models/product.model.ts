import { IProductInput } from './../../../type/index'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface IProduct extends Document, IProductInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
    },
    category: {
      type: String,
      required: true,
      minlength: 1,
    },
    subCategory: {
      type: String,
      required: true,
      minlength: 1,
    },
    images: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      trim: true,
      required: false,
    },
    price: {
      type: String,
      required: false,
      validate: {
        validator: (value: string) =>
          value === undefined || /^\d+\.\d{2}$/.test(value),
        message: 'Price must have exactly two decimal places (e.g., 49.99)',
      },
    },
    listPrice: {
      type: String,
      required: false,
      validate: {
        validator: (value: string) =>
          value === undefined || /^\d+\.\d{2}$/.test(value),
        message:
          'List price must have exactly two decimal places (e.g., 49.99)',
      },
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    avgRating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    ratingDistribution: {
      type: [
        {
          rating: { type: Number, required: false }, // Optional within object
          count: { type: Number, required: false }, // Optional within object
        },
      ],
      default: [], // Match Zod
      validate: {
        validator: (arr: Array<{ rating: number; count: number }>) =>
          arr.length <= 5,
        message: 'Rating distribution must have at most 5 entries',
      },
    },
    numSales: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Product =
  (models.Product as Model<IProduct>) ||
  model<IProduct>('Product', productSchema)

export default Product
