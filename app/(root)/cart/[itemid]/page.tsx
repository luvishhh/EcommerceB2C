import CartAddItem from './cart-add-item'

export default async function CartAddItemPage({
  params,
}: {
  params: Promise<{ itemid: string }>
}) {
  const { itemid } = await params
  console.log('params:', { itemid })
  return <CartAddItem itemId={itemid} />
}
