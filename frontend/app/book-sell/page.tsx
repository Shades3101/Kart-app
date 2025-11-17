"use client"

import { BookDetails } from "@/lib/type/type";
import { useAddProductsMutation } from "@/store/api";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import NoData from "../components/NoData";
import Link from "next/link";
import { Book, Camera, ChevronRight, CreditCard, DollarSign, HelpCircle, Loader2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filters } from "@/lib/Constant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function BookSell() {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [addProducts, { isLoading }] = useAddProductsMutation();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user)

    const { register, handleSubmit, watch, setValue, reset, control, formState: { errors } } = useForm<BookDetails>({
        defaultValues: {
            images: []
        }
    })

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files)
            const currentFiles = watch('images') || [];

            setUploadedImages((prevImage) => [...prevImage, ...newFiles.map((file) => URL.createObjectURL(file))].slice(0, 4));

            setValue('images', [...currentFiles, ...newFiles].slice(0, 4) as string[])
        }
    }

    const removeImage = (index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));

        const currentFiles = watch('images') || [];
        const uplaodFiles = currentFiles.filter((_, i) => i !== index);

        setValue('images', uplaodFiles)
    }

    const onSubmit = async (data: BookDetails) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'images') {
                    formData.append(key, value as string)
                }
            })
            if (data.paymentMode === "UPI") {
                formData.set('paymentDetails', JSON.stringify({ upiId: data.paymentDetails.upiId }))
            } else if (data.paymentMode === "Bank Account") {
                formData.set('paymentDetails', JSON.stringify({ bankDetails: data.paymentDetails.bankDetails }))
            }

            if (Array.isArray(data.images) && data.images.length > 0) {
                data.images.forEach((image) => formData.append('images', image))
            }

            const result = await addProducts(formData).unwrap();

            if (result.success) {
                router.push(`books/${result.data._id}`);
                toast.success("book added successfully");
                reset();

            }
        } catch (error) {
            toast.error("failed to list the book, try again later")
            console.log(error)
        }
    }

    const paymentMode = watch("paymentMode");

    const handleOpenLogin = () => {
        dispatch(toggleLoginDialog())
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

    return <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-4 text-blue-600">
                    Sell Your Used Books
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                    Submit a free classified ad to sell your used books for cash in India
                </p>
                <Link href="#" className="text-blue-500 hover: underline inline-flex items-center">
                    Learn how it works
                    <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Card className="shadow-lg border-t-4 border-t-blue-500">
                    <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 p-4">
                        <CardTitle className="text-2xl text-blue-700 flex items-center">
                            <Book className="mr-2 h-6 w-6" />
                            Book details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                            <Label htmlFor="title" className="md:w-1/4 font-medium text-gray-700">
                                Ad Title
                            </Label>
                            <div className="md:w-3/4">
                                <Input {...register("title", { required: "title is Required" })} placeholder="Enter your Book title" type="text" />
                                {errors.title && (
                                    <p className="text-red-500 text-sm">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                            <Label htmlFor="category" className="md:w-1/4 font-medium text-gray-700">
                                Book Type
                            </Label>
                            <div className="md:w-3/4">
                                <Controller name="category" control={control} rules={{ required: "Book type is required" }} render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Please select book type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filters.category.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )} />
                                {errors.category && (
                                    <p className="text-red-500 text-sm">
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                            <Label htmlFor="condition" className="md:w-1/4 font-medium text-gray-700">
                                Book Condition
                            </Label>
                            <div className="md:w-3/4">
                                <Controller name="condition" control={control} rules={{ required: "Condition is required" }} render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                                        {filters.condition.map((condition) => (
                                            <div key={condition} className="flex items-center space-x-2">
                                                <RadioGroupItem value={condition.toLowerCase()} id={condition.toLowerCase()} />

                                                <Label htmlFor={condition.toLowerCase()}>
                                                </Label>
                                                {condition}
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )} />
                                {errors.condition && (
                                    <p className="text-red-500 text-sm">
                                        {errors.condition.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                            <Label htmlFor="classType" className="md:w-1/4 font-medium text-gray-700">
                                For Class
                            </Label>
                            <div className="md:w-3/4">
                                <Controller name="classType" control={control} rules={{ required: "Book type is required" }} render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Please select book type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filters.classType.map((classType) => (
                                                <SelectItem key={classType} value={classType}>
                                                    {classType}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )} />
                                {errors.classType && (
                                    <p className="text-red-500 text-sm">
                                        {errors.classType.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                            <Label htmlFor="subject" className="md:w-1/4 font-medium text-gray-700">
                                Subject
                            </Label>

                            <div className="md:w-3/4">
                                <Input {...register("subject", { required: "Subject is Required" })} placeholder="Please Enter Your Book Subject" type="text" />
                                {errors.subject && (
                                    <p className="text-red-500 text-sm">
                                        {errors.subject.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className=" block mb-2 font-medium text-gray-700">
                                Upload Images
                            </Label>
                            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                                <div className="flex flex-col items-center gap-2">
                                    <Camera className="h-8 w-8 text-blue-500" />

                                    <Label htmlFor="images" className="cursor-pointer text-sm font-medium text-blue-600 hover:underline">
                                        Click here to upload up to 4 images (size: 15MB max. each)
                                    </Label>
                                    <Input onChange={handleImageUpload} id="images" type="file" className="hidden" accept="images/" multiple />
                                </div>
                                {uploadedImages.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {uploadedImages.map((image, index) => (
                                            <div key={index} className="relative">
                                                <Image src={image} alt={`book image${index + 1}`} width={200} height={200} className="rounded-lg object-cover w-full h-32 border border-gray-200" />
                                                <Button onClick={() => removeImage(index)} size="icon" className="absolute -right-2 -top-2" variant="destructive">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* OPTIONAL DETAILS */}
                <Card className="shadow-lg border-t-4 border-t-green-500">
                    <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 p-4">
                        <CardTitle className="text-2xl text-green-700 flex items-center m-0">
                            <HelpCircle className="mr-2 h-6 w-6" />
                            Optional Details
                        </CardTitle>
                        <CardDescription>
                            (Description, MRP, Author, ...)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    Book Information
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                            <Label htmlFor="price" className="md:w-1/4 font-medium text-gray-700">
                                                MRP
                                            </Label>
                                            <Input {...register("price", { required: "Book MRP is Required" })} placeholder="Enter Book MRP" type="text" className="md:w-3/4" />
                                            {errors.price && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.price.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                            <Label htmlFor="author" className="md:w-1/4 font-medium text-gray-700">
                                                Author
                                            </Label>
                                            <Input {...register("author")} placeholder="Enter Book Author Name" type="text" className="md:w-3/4" />
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                            <Label htmlFor="edition" className="md:w-1/4 font-medium text-gray-700">
                                                Edition (Year)
                                            </Label>
                                            <Input {...register("edition")} placeholder="Enter Book edition" type="text" className="md:w-3/4" />
                                        </div>

                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <AccordionTrigger>
                                    Add Description
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                            <Label htmlFor="description" className="md:w-1/4 font-medium text-gray-700">
                                                Description
                                            </Label>
                                            <Textarea id="description" {...register("description", { required: "Book Description is Required" })} placeholder="Enter Book Description" className="md:w-3/4" rows={4} />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>


                {/* Price Details */}
                <Card className="shadow-lg border-t-4 border-t-yellow-500">
                    <CardHeader className="bg-linear-to-r from-yellow-50 to-amber-50 p-4">
                        <CardTitle className="text-2xl text-yellow-700 flex items-center">
                            <DollarSign className="mr-2 h-6 w-6" />
                            Price Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                            <Label htmlFor="title" className="md:w-1/4 font-medium text-gray-700">
                                Set Price (₹)
                            </Label>
                            <div className="md:w-3/4">
                                <Input id="finalPrice" {...register("finalPrice", { required: "Final Price is Required" })} placeholder="Enter your Book Final Price" type="text" />
                                {errors.finalPrice && (
                                    <p className="text-red-500 text-sm">
                                        {errors.finalPrice.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-4">
                            <Label className="md:w-1/4 mt-2 font-medium text-gray-700">
                                Shippin Charges
                            </Label>
                            <div className="space-y-4 md:w-3/4">
                                <div className="flex items-center gap-4">
                                    <Input id="shippinCharge" {...register("shippingCharge")} placeholder="Enter Shipping Charges" type="text" className="w-full md:w-1/2" disabled={watch('shippingCharge') === 'free'} />
                                    <span className="text-sm">Or</span>
                                    <div className="flex items-center space-x-2">
                                        <Controller name="shippingCharge" control={control} rules={{ required: "Shipping Charge is required" }} render={({ field }) => (
                                            <Checkbox id="freeShipping" checked={field.value === "free"} onCheckedChange={(checked) => {

                                                field.onChange(checked ? 'free' : '')
                                            }} />
                                        )} />
                                        <Label htmlFor="freeShipping">
                                            Free Shipping
                                        </Label>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">Buyers Prefer free shipping or low Shipping Charges</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* bank details */}

                <Card className="shadow-lg border-t-4 border-t-blue-500">
                    <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 p-4">
                        <CardTitle className="text-2xl text-yellow-600 flex items-center">
                            <CreditCard className="mr-2 h-6 w-6" />
                            Bank Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">

                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                            <Label className="md:w-1/4 font-medium text-gray-700">
                                Payment Mode
                            </Label>
                            <div className="space-y-2 md:w-3/4">
                                <p className="text-sm text-muted-foreground mb-2"> Select Receiving Payment Mode </p>
                                <Controller name="paymentMode" control={control} rules={{ required: "Payment Mode is required" }} render={({ field }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="UPI" id="upi" {...register('paymentMode')} />
                                            <Label htmlFor="upi"> UPI ID</Label>

                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Bank Account" id="bank-account" {...register('paymentMode')} />
                                            <Label htmlFor="bank-account">Bank Account</Label>

                                        </div>
                                    </RadioGroup>
                                )} />
                                {errors.paymentMode && (
                                    <p className="text-red-500 text-sm">
                                        {errors.paymentMode.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {paymentMode === "UPI" && (
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                <Label htmlFor="upiId" className="md:w-1/4 font-medium text-gray-700">
                                    UPI ID:
                                </Label>
                                <Input {...register("paymentDetails.upiId", { required: "UPI ID is Required", pattern: { value: /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/, message: "Invalid Upi Id" } })} placeholder="Please Enter Your UPI/VPA ID" type="text" />
                                {errors.paymentDetails?.upiId && (
                                    <p className="text-red-500 text-sm">
                                        {errors.paymentDetails.upiId.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {paymentMode === "Bank Account" && (
                            <>
                                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                    <Label htmlFor="accountNumber" className="md:w-1/4 font-medium text-gray-700">
                                        Account Number
                                    </Label>
                                    <Input {...register("paymentDetails.bankDetails.accountNumber", { required: "Account Number is Required", pattern: { value: /^[0-9]{9,18}$/, message: "Invalid Account Number" } })} placeholder="Please Enter Your Account Number" type="text" />
                                    {errors.paymentDetails?.bankDetails?.accountNumber && (
                                        <p className="text-red-500 text-sm">
                                            {errors.paymentDetails.bankDetails.accountNumber.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                    <Label htmlFor="ifscCode" className="md:w-1/4 font-medium text-gray-700">
                                        IFSC Code
                                    </Label>
                                    <Input {...register("paymentDetails.bankDetails.ifscCode", { required: "IFSC Code is Required", pattern: { value: /^[A-Z]{4}[A-Z0-9]{6}$/, message: "Invalid IFSC Code " } })} placeholder="Please Enter Your IFSC Code" type="text" />
                                    {errors.paymentDetails?.bankDetails?.ifscCode && (
                                        <p className="text-red-500 text-sm">
                                            {errors.paymentDetails.bankDetails.ifscCode.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                    <Label htmlFor="bank Name" className="md:w-1/4 font-medium text-gray-700">
                                        Bank Name
                                    </Label>
                                    <Input {...register("paymentDetails.bankDetails.bankName", { required: "Bank Name is Required" })} placeholder="Please Enter Your Bank Name" type="text" />
                                    {errors.paymentDetails?.bankDetails?.bankName && (
                                        <p className="text-red-500 text-sm">
                                            {errors.paymentDetails.bankDetails.bankName.message}
                                        </p>
                                    )}
                                </div>
                            </>

                        )}

                    </CardContent>
                </Card>
                <Button type="submit" disabled={isLoading} className="w-60 text-md bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:from-orange-700 hover:to-orange-700 font-semibold py-6 shadow-lg rounde-lg transition duration-300 ease-in-out transform hover:scale-105">
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            Saving...
                        </div>

                    ) : (
                        "Post Your Book"
                    )}
                </Button>
                <p className="text-sm text-center mt-2 text-gray-600">
                    By clicking "Post Your Book", you agree to our {" "}
                    <Link href='/terms-of-use' className="text-blue-500 hover:underline">Terms of Use</Link>
                    ,{" "}
                    <Link href='/privacy-policy' className="text-blue-500 hover:underline">Privacy Policy</Link>
                </p>
            </form>
        </div>
    </div>
}