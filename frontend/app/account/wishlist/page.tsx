"use client"

import NoData from "@/components/NoData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ItemLoader from "@/lib/ItemLoader";
import { BookDetails } from "@/lib/type/type";
import { useAddToCartMutation, useGetWishlistQuery, useRemoveFromWishlistMutation } from "@/store/api";
import { addToCart } from "@/store/slice/cartSlice";
import { removeFromWishlistAction } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { Check, Heart, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation"
import { it } from "node:test";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function WishlistPage() {

    const router = useRouter();
    const dispatch = useDispatch();
    const [addToCartMutation] = useAddToCartMutation();
    const [removeWishlistMutation] = useRemoveFromWishlistMutation();
    const [isAddToCart, setIsAddToCart] = useState(false);
    const user = useSelector((state: RootState) => state.user.user);
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const cart = useSelector((state: RootState) => state.cart.items);
    const { data: wishlistData, isLoading } = useGetWishlistQuery({});
    const [wishlistItems, setWishlistItems] = useState<BookDetails[]>([])

    useEffect(() => {
        if (wishlistData?.success) {
            setWishlistItems(wishlistData?.data?.products)
        }
    }, [wishlistData])

    const handleAddToCart = async (productId: string) => {

        setIsAddToCart(true)

        try {
            const result = await addToCartMutation({
                productId,
                quantity: 1,
            }).unwrap();

            console.log(result)
            if (result.success && result.data) {
                dispatch(addToCart(result.data))
                toast.success(result.data.message || 'Added to Cart Successfully')
            } else {
                throw new Error(result.message || "Failed To Add To Cart")
            }
        } catch (error: any) {
            const errormessage = error?.data?.message;
            toast.error(errormessage)
        } finally {
            setIsAddToCart(false)
        }
    }

    const toggleWishlist = async (productId: string) => {
        const isWishlist = wishlist.some((item) => item.products.includes(productId))

        try {
            if (isWishlist) {
                const result = await removeWishlistMutation(productId).unwrap();
                if (result.success) {
                    dispatch(removeFromWishlistAction(productId))
                    toast.success(result.message || "Remove From Wishlist")
                } else {
                    throw new Error(result.message || "Failed To Remove from Wishlist")
                }
            }
        } catch (error: any) {
            const errormessage = error?.data?.message;
            toast.error(errormessage)
        }
    }

    const isItemInCart = (productId: string) => {
        return cart.some((CartItem) => CartItem.product._id === productId);

    }

    if (isLoading) {
        <ItemLoader />
    }

    if (!wishlistItems.length)
        return (
            <NoData
                message="Your wishlist is empty."
                description="Looks like you haven't added any items to your wishlist yet. 
                Browse our collection and save your favorites!"
                buttonText="Browse Books"
                imageUrl="/images/wishlist.webp"
                onClick={() => router.push("/books")}
            />
        );


    return <div className="space-y-6">
        <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-red-600" />
            <h3 className="text-2xl font-bold">
                My Wishlist
            </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
                <Card key={item._id}>
                    <CardHeader>
                        <CardTitle>
                            {item.title}
                        </CardTitle>
                        <CardDescription>
                            ₹ {item.finalPrice.toFixed(2)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <img className="aspect-square w-full object-cover" src={item.images[0]} alt={item.title} />
                    </CardContent>
                    <CardFooter className="flex justify-between">

                        <Button variant="outline" size="icon" onClick={() => toggleWishlist(item._id)}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                        {isItemInCart(item._id) ? (
                            <Button disabled>
                                <Check className="mr-2 h-5 w-5"/>
                                Item In Cart
                            </Button>
                        ): (
                            <Button onClick={() => handleAddToCart(item?._id)}>
                            {isAddToCart ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Add
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Add To Cart
                                </>
                            )}
                        </Button>
                        )}

                        
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>

}