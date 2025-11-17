import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Order } from "@/lib/type/type"
import { CheckCircle, Eye, Package, Truck, XCircle } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

interface OrderDetailsProps {
    order: Order;
}

const StatusStep = ({ title, icon, isCompleted, isActive } : { title: string, icon: ReactNode, isCompleted: boolean, isActive: boolean }) => {

    const iconColor = isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400";

    const circleBg = isCompleted ? "bg-green-100" : isActive ? "bg-blue-100" : "bg-gray-100";

    const textColor = isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-500";

    return (
        <div className="flex flex-col items-center">
            <div className={`rounded-full p-2 ${circleBg}`}>
                <div className={iconColor}>{icon}</div>
            </div>
            <span className={`text-xs mt-1 font-medium ${textColor}`}>{title}</span>
        </div>
    );
};


export default function OrderDialog({ order }: OrderDetailsProps) {

    const getStatusIndex = (Status: string) => {
        const statuses = ['processing', 'shipped', 'delivered', 'cancelled']
        return statuses.indexOf(Status);
    }

    const statusIndex = getStatusIndex(order?.status);

    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] mx-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-purple-700">
                    Order Details
                </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
                <div className="bg-linear-to-r from-purple-100 to-pink-100 text-white p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-purple-800 mb-2">
                        Order Status
                    </h3>
                    <div className="flex justify-between items-center">
                        <StatusStep title="processing" icon={<Package className="h-5 w-5" />} isCompleted={statusIndex > 0} isActive={statusIndex === 0} />
                        <div className={`h-1 flex-1 ${statusIndex > 0 ? "bg-green-500" : "bg-gray-300"}`} />

                        <StatusStep title="shipped" icon={<Truck className="h-5 w-5" />} isCompleted={statusIndex > 1} isActive={statusIndex === 1} />
                        <div className={`h-1 flex-1 ${statusIndex > 1 ? "bg-green-500" : "bg-gray-300"}`} />

                        <StatusStep title="delivered" icon={<CheckCircle className="h-5 w-5" />} isCompleted={statusIndex > 2} isActive={statusIndex === 2} />

                        {order?.status === "cancelled" && (
                            <>
                                <div className="h-1 flex-1 bg-red-500">
                                    <StatusStep title="cancelled" icon={<XCircle className="h-5 w-5" />} isCompleted={true} isActive={true} />
                                </div>
                            </>
                        )}

                    </div>
                </div>
                <div className="bg-linear-to-r from-blue-100 to-cyan-100 p-4 rounded-b-lg">
                    <h3 className="font-semibold text-lg text-blue-800 mb-2">
                        Items
                    </h3>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                            <div className="flex items-center space-x-4" key={index}>
                                <Image src={item.product.images[0]} alt={item.product.title} width={60} height={60} className="rounded-md" />
                                <div>
                                    <p className="font-medium">
                                        {item.product.title}
                                    </p>
                                    <div className="flex gap-2">
                                        <p className="font-medium">
                                            {item?.product?.subject}
                                        </p>
                                        ({order?.items?.map(item => item?.product?.author).join(", ")})
                                    </div>
                                    <p className="text-sm text-gray-600"> Quantity {item?.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-linear-to-r from-green-100 to-teal-100 p-4 rounded-lg">
                    <h3 className="font-serif text-lg text-green-800 mb-2">
                        Shipping Address
                    </h3>
                    <p>
                        {order?.shippingAddress?.addressLine1}
                    </p>
                    <p>{order?.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>

                </div>

                  <div className="bg-linear-to-r from-yellow-100 to-amber-100 p-4 rounded-lg">
                    <h3 className="font-serif text-lg text-green-800 mb-2">
                        Payment Details
                    </h3>
                    <p>
                      Order Id:  {order?.paymentDetails?.razorpay_order_id}
                    </p>
                    <p> Payment Id: {order?.paymentDetails?.razorpay_payment_id}</p>
                    <p> Amount: ₹ {order?.totalAmount}</p>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}