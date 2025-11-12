"use client"

import NoData from "@/app/components/NoData";
import { ShareButton } from "@/app/components/Share";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ItemLoader from "@/lib/ItemLoader";
import { BookDetails } from "@/lib/type/type";
import { useAddToCartMutation, useAddToWishlistMutation, useGetProductsByIdQuery, useRemoveFromWishlistMutation } from "@/store/api";
import { addToCart } from "@/store/slice/cartSlice";
import { addToWishListAction, removeFromWishlistAction } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Heart, Loader2, MapPin, MessageCircle, Share, ShoppingCart, Truck, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function ProductPage() {

    const params = useParams();
    const id = params.id;
    const [selectedImage, setSelectedImage] = useState(0);
    const router = useRouter();
    const [isAddToCart, setIsAddToCart] = useState(false);
    const { data: apiResponse = {}, isLoading, isError } = useGetProductsByIdQuery(id);
    const [book, setBook] = useState<BookDetails | null>(null);
    const [addToCartMutation] = useAddToCartMutation();
    const [addToWishlistMutation] = useAddToWishlistMutation();
    const [removeWishlistMutation] = useRemoveFromWishlistMutation();
    const wishlist = useSelector((state: RootState) => state.wishlist.items)
    const dispatch = useDispatch();
    useEffect(() => {
        if (apiResponse.success) {
            setBook(apiResponse.data)

        }
    }, [apiResponse])


    const handleAddToCart = async () => {
        if (book) {
            setIsAddToCart(true)

            try {
                const result = await addToCartMutation({
                    productId: book._id,
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
    }

    const handleAddToWishlist = async (productId: string) => {
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

            } else {
                const result = await addToWishlistMutation(productId).unwrap();
                if (result.success) {
                    dispatch(addToWishListAction(result.data))
                    toast.success(result.message || "Added To Wishlist")
                } else {
                    throw new Error(result.message || "Failed To Add To Wishlist")
                }
            }
        } catch (error: any) {
            const errormessage = error?.data?.message;
            toast.error(errormessage)
        }
    }

    const bookImage = book?.images || [];
    if (isLoading) {
        return <ItemLoader />
    }

    if (!book || isError) {
        return (
            <div className="my-10 max-w-3xl justify-center mx-auto">
                <NoData
                    imageUrl="/images/no-book.jpg"
                    message="Loading...."
                    description="Wait, we are fetching book details"
                    onClick={() => router.push("/book-sell")}
                    buttonText="Sell Your First Book"
                />
            </div>
        );
    }

    const calculateDiscount = (price: number, finalPrice: number): number => {
        if (price > finalPrice && price > 0) {
            return Math.round(((price - finalPrice) / price) * 100)
        }
        return 0;
    }

    const formatDate = (date: Date) => {
        const newDate = new Date(date);
        return formatDistanceToNow(newDate, { addSuffix: true })
    }

    return <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto  px-4 py-8">
            <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="text-primary hover: underline">
                    {" "}
                    Home {" "}
                </Link>
                <span>/</span>
                <Link href="/books" className="text-primary hover: underline">
                    Books
                </Link>
                <span>/</span>
                <span className="text-gray-600"> {book.category} </span>
                <span>/</span>
                <span className="text-gray-600"> {book.title} </span>
            </nav>
            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="relative h-[400px] overflow-hidden rounded-lg border bg-white shadow-md">
                        <Image src={bookImage[selectedImage]} alt={book.title} fill className="object-contain" />

                        {calculateDiscount(book.price, book.finalPrice) > 0 && (
                            <span className="absolute left-0 top-2 rounded-r-lg px-2 py-1 text-xs font-medium bg-orange-600/90 text-white hover:bg-orange-700">
                                {calculateDiscount(book.price, book.finalPrice)}% Off
                            </span>
                        )}
                        <div className="absolute top-3 right-3">
                            <Button variant="outline" size="icon" onClick={() => handleAddToWishlist(book._id)} className="rounded-full w-10 h-10 flex items-center justify-center hover:scale-110">
                                <Heart className= {` ${wishlist.some((w) => w.products.includes(book._id)) ? "fill-red-500" : "" }`} />
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                        {bookImage.map((images, index) => (
                            <button key={index} onClick={() => setSelectedImage(index)} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-200${selectedImage === index ? 'ring-2 ring-primary scale-105' : 'hover:scale-105'}`}>
                                <Image src={images} alt={`${book.title} ${index + 1}`} fill className="object-cover">

                                </Image>
                            </button>
                        ))}
                    </div>
                </div>

                {/* books details */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">
                                {book.title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Posted {formatDate(book.createdAt)}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <ShareButton url={`${window.location.origin}/books/${book._id}`}
                            title= {`Check Out this book: ${book.title}`}
                            text= {`I found this interesting Book on Kart: ${book.title}` } />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-black">
                                ₹{book.finalPrice}
                            </span>
                            {book.price && (
                                <span className="text-lg text-zinc-500 line-through">
                                    ₹{book.price}
                                </span>
                            )}
                            <Badge className="text-green-600" variant="secondary">
                                <Truck />Shipping Available
                            </Badge>
                        </div>
                        <Button className="w-60 py-6 hover:bg-blue-600 bg-blue-700 flex items-center justify-center gap-2 transition cursor-pointer" onClick={handleAddToCart} disabled={isAddToCart}>
                            {isAddToCart ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Adding To Cart
                                </>
                            ) : (
                                <>
                                    <ShoppingCart />
                                    Buy Now
                                </>
                            )}
                        </Button>

                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Book Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="font-medium text-muted-foreground"> Subject/Title </div>
                                    <div> {book.subject} </div>

                                    <div className="font-medium text-muted-foreground"> Course </div>
                                    <div> {book.classType} </div>

                                    <div className="font-medium text-muted-foreground"> Category </div>
                                    <div> {book.category} </div>

                                    <div className="font-medium text-muted-foreground"> Author </div>
                                    <div> {book.author} </div>

                                    <div className="font-medium text-muted-foreground"> Edition </div>
                                    <div> {book.edition} </div>

                                    <div className="font-medium text-muted-foreground"> Condition </div>
                                    <div> {book.condition} </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Description
                        </CardTitle>
                        <p>{book.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-lg mb-2">
                                Our Community
                            </h3>
                            <p className="text-md text-muted-foreground">
                                We're not just another shopping website where you buy from professional sellers - {" "}
                                We are a vibrant community of students, book lovers across India who deliver happiness to each other!
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div>
                                Ad Id: {book._id}
                            </div>
                            <div>
                                Posted: {formatDate(book.createdAt)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Book Seller Detail */}

                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Seller Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User2 className="text-slate-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium"> {book.seller.name} </span>
                                        <Badge variant="secondary" className="text-green-600">
                                            <CheckCircle2 />
                                            Verified
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {book.seller?.addresses?.[0]?.city && book.seller.addresses[0]?.state
                                            ? `${book.seller.addresses[0].city}, ${book.seller.addresses[0].state}`
                                            : "Location Not Available"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {book.seller.phone && (
                            <div className="flex items-center gap-2 text-sm">
                                <MessageCircle className="h-4 w-4" />
                                <span> Contact : {book.seller.phone}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* How it Works */}
            <section className="mt-16">
                <h2 className="mb-8 text-2xl font-bold">
                    How it works?
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        {
                            step: "Step 1",
                            title: "Seller posts an Ad",
                            description:
                                "Seller posts an ad on book kart to sell their used books.",
                            image: { src: "/icons/ads.png", alt: "Post Ad" },
                        },
                        {
                            step: "Step 2",
                            title: "Buyer Pays Online",
                            description:
                                "Buyer makes an online payment to book kart to buy those books.",
                            image: { src: "/icons/pay_online.png", alt: "Payment" },
                        },
                        {
                            step: "Step 3",
                            title: "Seller ships the books",
                            description: "Seller then ships the books to the buyer",
                            image: { src: "/icons/fast-delivery.png", alt: "Shipping" },
                        },

                    ].map((item, index) => (

                        <Card key={index} className="bg-linear-to-br from-amber-50 to-amber-100 border-none">
                            <CardHeader>
                                <Badge className="w-fit mb-2"> {item.step} </Badge>
                                <CardTitle className="text-lg">
                                    {item.title}
                                </CardTitle>
                                <CardDescription> {item.description} </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Image src={item.image.src} alt={item.image.alt} width={120} height={120} className="mx-auto" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    </div>
}