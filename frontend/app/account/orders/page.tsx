"use client";

import NoData from "@/components/NoData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ItemLoader from "@/lib/ItemLoader";
import { Order } from "@/lib/type/type";
import { useGetUserOrdersQuery } from "@/store/api"
import { Calendar, CreditCard, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OrderDialog from "./OrderDialog";
import { Button } from "@/components/ui/button";

export default function OrderPage() {

    const { data: orderData, isLoading } = useGetUserOrdersQuery({});
    const [showAllOrders, setShowAllOrders] = useState(false);
    const router = useRouter();

    if (isLoading) {
        return <ItemLoader />
    }

    const orders: Order[] = orderData?.data || [];
    const displayedOrder = showAllOrders ? orders : orders.slice(0, 10);

    if (orders.length === 0) {
        return (
            <div className="my-10 max-w-3xl justify-center mx-auto">
                <NoData
                    imageUrl="/images/no-book.jpg"
                    message="You haven't order any books yet."
                    description="Start order your books to reach potential buyers. order your first book now!"
                    onClick={() => router.push("/books")}
                    buttonText="Order Your First Book"
                />
            </div>
        );
    }

    return <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="bg-linear-to-r from-orange-500 to-amber-500 text-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                My Orders
            </h1>
            <p className="text-purple-100">Manage Your Orders</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {displayedOrder.map((order) => (
                <Card key={order?._id} className="flex flex-col">
                    <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50">
                        <CardTitle className="text-lg sm:text-xl text-purple-700 flex items-center ">
                            <ShoppingBag className="h-5 w-5  mr-2" />
                            Order # {order?._id.slice(-6)}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            {new Date(order.createdAt).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grow space-y-2">
                        <div className="space-y-2">
                            <p className="font-semibold"> {order.items.map(item => item.product.title).join(", ")} </p>
                            <p className=" text-md text-muted-foreground font-semibold"> {order.items.map(item => item.product.author).join(", ")} </p>
                        </div>
                        <p className="text-sm flex items-center text-muted-foreground font-medium">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Total: ₹ {order.totalAmount}
                        </p>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground font-semibold"> Status: </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "delivered" ? 'bg-green-100 text-green-800' : order.status === "processing" ? 'bg-yellow-100 text-yellow-800' : order.status === "shipped" ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-purple-50">
                        <OrderDialog order = {order} />
                    </CardFooter>
                </Card>
            ))}
        </div>
        <div className="flex justify-center">
            <Button onClick={() => setShowAllOrders(!showAllOrders)} className="bg-linear-to-r from-purple-500 to-pink-500 text-white">
                {showAllOrders ? "Show Less" : "View All More"}
            </Button>
        </div>
    </div>
}