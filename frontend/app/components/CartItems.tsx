import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CartItem } from "@/lib/type/type"
import { Heart, Trash, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CartItemsProp {
    items: CartItem[],
    onRemoveItem: (productId: string) => void,
    onToggleWishlist: (productId: string) => void,
    wishlist: { products: string[] }[]
}

export default function CartItemPage({ items, onRemoveItem, onToggleWishlist, wishlist }: CartItemsProp) {


    return <div>
        <ScrollArea className="h-[400px] pr-4">
            {items.map((item) => (
                <div key={item._id} className="flex flex-col md:flex-row gap-4 py-4 border-b last:border-0">
                    <Link href={`/books/${item.product._id}`}>
                        <Image src={item?.product?.images?.[0]} alt={item?.product?.title} width={80} height={100} className="object-contain w-60 md:40 rounded-b-xl" />
                    </Link>
                    <div className="flex-1">
                        <h3 className="font-semibold">
                            {item.product.title}
                        </h3>
                        <div className="mt-1 text-sm font-semibold text-gray-500">
                            Quantity: {item.quantity}
                        </div>
                        <div className="mt-1 font-semibold">
                            <span className="text-gray-500 line-through mr-2">
                                ₹{item.product.price}
                            </span>
                            ₹{item.product.finalPrice}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-green-600">
                            {item.product.shippingCharge === "free" ? "Free Shipping" : `Shipping ₹${item.product.shippingCharge}`}
                        </div>
                        <div className="mt-2 gap-2 flex">
                            <Button className="w-[100px] md:w-[200px]" variant="outline" size="sm" onClick={() => onRemoveItem(item.product._id)}>
                                <Trash2 className="h-4 w-4 mr-1" />
                                <span className="hidden md:inline">
                                    Remove
                                </span>
                            </Button>

                            <Button variant="outline" size="sm" onClick={() => onToggleWishlist(item.product._id)} className="w-[100px] md:w-[200px]">
                                <Heart className={` ${wishlist.some((w) => w.products.includes(item.product._id)) ? "fill-red-500" : ""}`} />
                                    <span className="hidden md:inline">
                                        {wishlist.some((w) => w.products.includes(item.product._id)) ? "Remove From Wishlist" : "Add To Wishlist"}
                                    </span>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </ScrollArea>
    </div>
}