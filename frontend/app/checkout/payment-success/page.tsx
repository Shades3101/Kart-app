"use client"

import { useGetOrderByIdQuery } from "@/store/api";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import confetti from "canvas-confetti"
import ItemLoader from "@/lib/ItemLoader";
import { motion, scale } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Package, Truck } from "lucide-react";

export default function AfterPaymentPage() {

    const router = useRouter();
    const dispatch = useDispatch();
    const { orderId } = useSelector((state: RootState) => state.checkout);
    const { data: orderData, isLoading } = useGetOrderByIdQuery(orderId || "")

    useEffect(() => {
        if (!orderId) {
            router.push(`/checkout/cart`)
        } else {
            confetti({
                particleCount: 100,
                spread: 200,
                origin: { y: 0.6 }
            })
        }
    }, [orderId, dispatch, router])

    if (isLoading) {
        return <ItemLoader />

    }

    if (!orderId || !orderData) {
        return null
    }

    const { totalAmount, items, status, createdAt } = orderData.data
    return (
        <div className="min-h-screen bg-linear-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl"
            >
                <Card className="rounded-3xl bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">

                    <CardHeader className="text-center pt-12 pb-6">
                        <motion.div
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 12 }}
                            className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-sm"
                        >
                            <CheckCircle className="w-14 h-14 text-green-600" />
                        </motion.div>

                        <h1 className="text-4xl font-bold text-green-700 mt-6">
                            Payment Successfully!
                        </h1>

                        <p className="text-gray-600 text-sm mt-2">
                            Thank you for your purchase. Your order has been confirmed.
                        </p>

                        <hr className="mt-8 border-gray-200" />
                    </CardHeader>

                    <CardContent className="px-10 pb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
 
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h3 className="font-semibold text-xl text-gray-800 mb-4">
                                    Order Details
                                </h3>

                                <div className="bg-blue-50 p-6 rounded-xl shadow-sm">
                                    <p className="text-sm text-gray-700 mb-1">
                                        <span className="font-medium">Order Id:</span>{" "}
                                        <span className="text-blue-700 underline">{orderId}</span>
                                    </p>
                                    <p className="text-sm text-gray-700 mb-1">
                                        <span className="font-medium">Date:</span>{" "}
                                        <span className="text-blue-700">
                                            {new Date(createdAt).toLocaleDateString()}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-700 mb-1">
                                        <span className="font-medium">Total Amount:</span>{" "}
                                        <span className="text-blue-700">₹{totalAmount.toFixed(2)}</span>
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Items:</span>{" "}
                                        <span className="text-blue-700">{items.length}</span>
                                    </p>
                                </div>

                                <div className="bg-green-50 p-6 rounded-xl shadow-sm mt-6">
                                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-green-600" />
                                        Order Status
                                    </h4>

                                    <p className="text-green-700 font-medium text-sm">
                                        {status.toUpperCase()}
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="font-semibold text-xl text-gray-800 mb-4">
                                    What's Next?
                                </h3>

                                <ul className="space-y-5 text-gray-700">

                                    <li className="flex items-start gap-3">
                                        <Calendar className="w-6 h-6 text-purple-500" />
                                        <p className="text-sm leading-relaxed">
                                            You will receive an email confirmation shortly.
                                        </p>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <Truck className="w-6 h-6 text-blue-500" />
                                        <p className="text-sm leading-relaxed">
                                            Your order will be processed and shipped soon.
                                        </p>
                                    </li>

                                    <li className="flex items-start gap-3">
                                        <Calendar className="w-6 h-6 text-green-500" />
                                        <p className="text-sm leading-relaxed">
                                            You can track your order status in your account dashboard.
                                        </p>
                                    </li>

                                </ul>
                            </motion.div>
                        </div>
                        <div className="flex justify-center mt-12">
                            <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 rounded-lg font-semibold shadow-lg text-white bg-linear-to-r 
                   from-purple-600 to-indigo-600 hover:shadow-xl transition"
                                onClick={() => router.push("/")}
                            >
                                Continue Shopping
                            </motion.button>
                        </div>

                    </CardContent>
                </Card>

            </motion.div>
        </div>
    )
}