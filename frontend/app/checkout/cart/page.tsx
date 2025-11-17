"use client"

import AddressPage from "@/components/Address";
import CartItemPage from "@/components/CartItems";
import NoData from "@/components/NoData";
import PriceDetails from "@/components/PriceDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ItemLoader from "@/lib/ItemLoader";
import { Address } from "@/lib/type/type";
import { useAddToWishlistMutation, useCreateOrUpdateOrderMutation, useCreateRazorpayPaymentMutation, useGetCartQuery, useGetOrderByIdQuery, useRemoveFromCartMutation, useRemoveFromWishlistMutation } from "@/store/api";
import { clearCart, setCart } from "@/store/slice/cartSlice";
import { resetCheckout, setCheckoutStep, setOrderId } from "@/store/slice/CheckoutSlice";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { addToWishListAction, removeFromWishlistAction } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { ChevronRight, CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation"
import Script from "next/script";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user.user);
    const { orderId, step } = useSelector((state: RootState) => state.checkout);
    const [showAddressDialog, setShowAddressDialog] = useState(false);
    const [isOrderProcessing, setIsOrderProcessing] = useState(false);
    const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(user?._id);
    const [removeCartMutation] = useRemoveFromCartMutation();
    const [addToWishlistMutation] = useAddToWishlistMutation();
    const [removeWishlistMutation] = useRemoveFromWishlistMutation();
    const wishlist = useSelector((state: RootState) => state.wishlist.items)
    const cart = useSelector((state: RootState) => state.cart)
    const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
    const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(orderId || "");
    const [createRazorPayment] = useCreateRazorpayPaymentMutation();
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    useEffect(() => {
        if (orderData && orderData.shippingAddress) {
            setSelectedAddress(orderData.shippingAddress)
        }
    }, [orderData])

    useEffect(() => {
        if (step === "address" && !selectedAddress) {
            setShowAddressDialog(true)
        }
    }, [step, selectedAddress])

    useEffect(() => {
        if (cartData?.success && cartData?.data) {
            dispatch(setCart(cartData.data))
        }
    }, [cartData, dispatch])



    const handleRemoveItems = async (productId: string) => {
        try {
            const result = await removeCartMutation(productId).unwrap();
            if (result.success) {
                dispatch(setCart(result.data))

                toast.success(result.message || "Item Removed Successfully")
            }
        } catch (error) {
            console.log(error)
            toast.error("failed to remove Item from Cart")
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

    function handleOpenLogin() {
        dispatch(toggleLoginDialog());
    }

    const totalAmount = cart.items.reduce((acc, item) => acc + (item.product.finalPrice * item.quantity), 0)
    const totalOriginalAmount = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
    const totalDiscount = totalOriginalAmount - totalAmount;

    const shippingCharge = cart.items.map(item => item.product.shippingCharge?.toLowerCase() === "free" ? 0 : parseFloat(item.product.shippingCharge) || 0)
    const maxShippingCharge = Math.max(...shippingCharge, 0)
    const finalAmount = totalAmount + maxShippingCharge


    console.log(orderData)
    const handlePayment = async () => {
        if (!orderId) {
            toast.error("No Error found. Please Try Again")
            return;
        }
        setIsOrderProcessing(true)
        try {
            const { data, error } = await createRazorPayment(orderId);
            console.log("payment data", data)

            if (error) {
                throw new Error("Razor Payment Failed")
            }
            const razorpayOrder = data.data.order;
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Kart",
                description: "Item Purchase",
                order_id: razorpayOrder.id,
                handler: async function (response: any) {
                    try {
                        const result = await createOrUpdateOrder({
                            orderId,
                            updates: {
                                paymentStatus: "complete",  // Add this
                                status: "processing",        // Add this
                                paymentDetails: {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                }
                            }
                        }).unwrap();

                        console.log(result)
                        if (result.success) {
                            dispatch(clearCart());
                            dispatch(resetCheckout());
                            toast.success("Payment Successful!")
                            router.push(`/checkout/payment-success?orderId=${orderId}`)
                        } else {
                            throw new Error(result.message)
                        }
                    } catch (error) {
                        console.log('failed to update Order', error)
                        toast.error("Payment Successful, but failed to update Order")
                    }
                },
                prefill: {
                    name: orderData?.data?.user?.name,
                    email: orderData?.data?.user?.email,
                    contact: orderData?.data?.user?.phone
                },
                theme: {
                    color: "#3399cc"
                }
            }
            const razorpay = new window.Razorpay(options)
            razorpay.open();
        } catch (error) {
            toast.error("Failed To initiate the payment")
        } finally {
            setIsOrderProcessing(false)
        }
    }

    const handleProceedToCheckout = async () => {
        if (step === "cart") {
            try {
                const result = await createOrUpdateOrder({ updates: { totalAmount: finalAmount } }).unwrap();
                console.log(result)
                if (result.success) {
                    toast.success("Order Create Successfully");
                    dispatch(setOrderId(result.data._id));
                    dispatch(setCheckoutStep("address"));
                } else {
                    throw new Error(result.message)
                }
            } catch (error) {
                toast.error(`failed to create order`)
                console.log(error)
            }
        } else if (step === "address") {
            if (selectedAddress) {
                dispatch(setCheckoutStep("payment"))
            } else {
                setShowAddressDialog(true)
            }
        } else if (step === "payment") {
            handlePayment()
        }
    }

    const handleSelectAddress = async (address: Address) => {
        setSelectedAddress(address)
        setShowAddressDialog(false);
        if (orderId) {
            try {
                await createOrUpdateOrder({ orderId, updates: {  shippingAddress: address } }).unwrap();
                toast.success('Address updated Successfully')
            } catch (error) {
                console.log(error);
                toast.error('failed to update address')
            }
        }
    }

    if (!user) {
        return (
            <NoData
                message="Please log in to access your cart."
                description="You need to be logged in to view your cart and checkout."
                buttonText="Login"
                imageUrl="/images/login.jpg"
                onClick={handleOpenLogin}
            />
        );
    }

    if (cart.items.length === 0) {
        return (
            <NoData
                message="Your cart is empty."
                description="Looks like you haven't added any items yet. 
            Explore our collection and find something you love!"
                buttonText="Browse Books"
                imageUrl="/images/cart.webp"
                onClick={() => router.push('/books')}
            />
        );
    }

    if (isCartLoading || isOrderLoading) {
        return <ItemLoader />
    }


    return <>
        <Script
            id="razorpay-checkout-js"
            src="https://checkout.razorpay.com/v1/checkout.js"
        />


        <div className="min-h-screen bg-white">
            <div className="bg-gray-100 py-4 px-6 mb-8">
                <div className="container mx-auto flex items-center">
                    <ShoppingCart className="h-6 w-6 mr-2 text-gray-600" />
                    <span className="text-lg font-semibold text-gray-800">
                        {cart.items.length} {cart.items.length === 1 ? "item" : "items"} {"\n"}
                        in Your Cart
                    </span>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8">
                    <div className="flex justify-center items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`rounded-full p-3 ${step === "cart" ? "bg-blue-600 text-gray-200" : "bg-gray-200 text-gray-600"}`}>
                                <ShoppingCart className="h-6 w-6" />
                            </div>
                            <span className="font-medium hidden md:inline">
                                Cart
                            </span>
                        </div>

                        <ChevronRight className="h-5 w-5 text-gray-400" />

                        <div className="flex items-center gap-2">
                            <div className={`rounded-full p-3 ${step === "address" ? "bg-blue-600 text-gray-200" : "bg-gray-200 text-gray-600"}`}>
                                <MapPin className="h-6 w-6" />
                            </div>
                            <span className="font-medium hidden md:inline">
                                Address
                            </span>
                        </div>

                        <ChevronRight className="h-5 w-5 text-gray-400" />

                        <div className="flex items-center gap-2">
                            <div className={`rounded-full p-3 ${step === "payment" ? "bg-blue-600 text-gray-200" : "bg-gray-200 text-gray-600"}`}>
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <span className="font-medium hidden md:inline">
                                Payment
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    Order Summary
                                </CardTitle>

                                <CardDescription>
                                    Review Your Items
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CartItemPage items={cart.items} onRemoveItem={handleRemoveItems} onToggleWishlist={handleAddToWishlist} wishlist={wishlist} />
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <PriceDetails totalOriginalAmount={totalOriginalAmount} totalAmount={finalAmount} totalDiscount={totalDiscount} itemCount={cart.items.length} shippingCharge={maxShippingCharge}
                            isOrderProcessing={isOrderProcessing} step={step} onProceed={handleProceedToCheckout} onBack={() => dispatch(setCheckoutStep(step === "address" ? "cart" : "address"))}
                        />

                        {selectedAddress && (
                            <Card className="mt-6 mb-6 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        Delivery Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <p> {selectedAddress?.state} </p>
                                        {selectedAddress.addressLine2 && (
                                            <p> {selectedAddress.addressLine2} </p>
                                        )}
                                        <p>
                                            {selectedAddress.city}, {selectedAddress.state} {" "}
                                            {selectedAddress.pincode}
                                        </p>
                                        <p>
                                            Phone: {selectedAddress.phone}
                                        </p>
                                    </div>
                                    <Button className="mt-4" variant="outline" onClick={() => setShowAddressDialog(true)}>
                                        <MapPin className="h-4 w-4 mr-2" /> Change Address
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
                <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>
                                Select or Add Delivery Address
                            </DialogTitle>
                        </DialogHeader>

                        <AddressPage onAddressSelect={handleSelectAddress} selectedAddressId={selectedAddress?._id} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    </>
}