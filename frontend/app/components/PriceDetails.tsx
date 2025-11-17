import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, CreditCard, Shield } from "lucide-react"

interface PriceDetailsProps {
    totalOriginalAmount: number,
    totalAmount: number,
    totalDiscount: number,
    itemCount: number,
    shippingCharge: number
    isOrderProcessing: boolean,
    step: "cart" | "address" | "payment",
    onProceed: () => void,
    onBack: () => void
}

export default function PriceDetails({totalOriginalAmount, totalAmount, totalDiscount, itemCount, isOrderProcessing, step, onProceed, onBack, shippingCharge}: PriceDetailsProps) {

     return <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-xl">
                Price Details
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between">

                <span> Price ({itemCount} items) </span>
                <span> ₹{totalOriginalAmount} </span>
            </div>
            <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span> ₹{totalDiscount} </span>
            </div>
            <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className={`${shippingCharge === 0 ? "text-green-600" : "text-black"}`}> ₹{shippingCharge === 0 ? "Free": `${shippingCharge}`} </span>
            </div>
             <div className="border-t pt-4 font-medium flex justify-between">
                <span>Total Amount</span>
                <span> ₹{totalAmount} </span>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size = "lg" disabled = {isOrderProcessing} onClick={onProceed} >
                {isOrderProcessing ? ( 
                    "processing..."
                ) : step === "payment" ? (
                    <>
                        <CreditCard className="h-4 w-4 mr-2"/> Continue To Pay
                    </>
                ): (
                    <>
                    <ChevronRight className="h-4 w-4 mr-2"/>
                    {step ==="cart" ? "Proceed to Checkout" : "Proceed to Payment"}
                    </>
                )}
            </Button>

            {step !=="cart" && (
                <Button variant="outline" className="w-full" onClick={onBack}>
                    <ChevronLeft className="h-4 w-4 mr-2"/> Go Back
                </Button>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4"/>
                <span>Safe and Secure Payments</span>
            </div>
        </CardFooter>
     </Card>
}