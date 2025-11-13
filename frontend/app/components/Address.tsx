import { Address } from "@/lib/type/type"
import { useAddOrUpdateAddressMutation, useGetAddressQuery } from "@/store/api";
import { useState } from "react";
import {  useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import ItemLoader from "@/lib/ItemLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";


interface AddressResponse {
    success: boolean,
    message: string,
    data: {
        addresses: Address[]
    }
}

type AddressFormValues = z.infer<typeof addressFormSchema>;

const addressFormSchema = z.object({
    phone: z.string().min(10, "Phone Number is Required"),
    addressLine1: z.string().min(5, "Address line 1 is Requied"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is Required"),
    state: z.string().min(2),
    pincode: z.string().min(6, "Pincode is Required")
})

interface CheckoutAddress {
    onAddressSelect: (address: Address) => void;
    selectedAddressId?: string
}

export default function AddressPage({ onAddressSelect, selectedAddressId }: CheckoutAddress) {

    const { data: addressData, isLoading } = useGetAddressQuery() as {
        data: AddressResponse | undefined,
        isLoading: boolean
    }

    const [addOrUpdateAddress] = useAddOrUpdateAddressMutation();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const addresses = addressData?.data.addresses || [];
    console.log(addresses)

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: ""
        }
    })

    const handleEditingAddress = (address: Address) => {
        setEditingAddress(address);
        form.reset(address);
        setShowAddressForm(true)
    }

    const onSubmit = async (data: AddressFormValues) => {
        try {
            let result;
            if (editingAddress) {
                const updateAddress = { ...editingAddress, ...data, addressId: editingAddress._id }
                result = await addOrUpdateAddress(updateAddress).unwrap();

            } else {
                result = await addOrUpdateAddress(data).unwrap();
            }
            setShowAddressForm(false);
            setEditingAddress(null);
        } catch (error) {
            console.log(error)
        }
    }

    if (isLoading) {
        return <ItemLoader />
    }

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 mb-6">
            {addresses.map((address: Address) => (
                <Card key={address._id} className={`relactive overflow-hidden rounded-lg border transition-all duration-300 ${selectedAddressId === address._id ? "border-blue-500 shadow-lg" : "border-gray-200 shadow-md hover:shadow-lg"}`} >
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <Checkbox checked={selectedAddressId === address._id} onCheckedChange={() => onAddressSelect(address)} className="W-5 H-5" />
                            <div className="flex items-center justify-between">
                                <Button size="icon" variant="ghost" onClick={() => handleEditingAddress(address)}>

                                    <Pencil className="h-5 w-5 text-gray-600 hover:blue-500" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p> {address?.addressLine1} </p>
                            {address.addressLine2 && (
                                <p> {address.addressLine2} </p>
                            )}
                            <p>
                                {address.city}, {address.state} {" "}
                                {address.pincode}
                            </p>
                            <p className="mt-2 font-medium">
                                Phone: {address.phone}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
            <DialogTrigger asChild>
                <Button className="w-full" variant="outline" >
                    <Plus className="mr-2 h-4 w-4" /> {" "}
                    {editingAddress ? "Edit Address" : "Add New Address"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingAddress ? "Edit Address" : "Add New Address"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="phone" render={({ field }) =>
                            <FormItem>
                                <FormLabel>
                                    Phone Number
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter 10-Digit Phone Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>} />

                        <FormField control={form.control} name="addressLine1" render={({ field }) =>
                            <FormItem>
                                <FormLabel>
                                    Address Line 1
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Street Address, House number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>} />

                        <FormField control={form.control} name="addressLine2" render={({ field }) =>
                            <FormItem>
                                <FormLabel>
                                    Address Line 2 (Optional)
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Apartment, suite, unit, etc." {...field} />
                                </FormControl>
                            </FormItem>} />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="city" render={({ field }) =>
                                <FormItem>
                                    <FormLabel>
                                        City
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Your City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>} />

                            <FormField control={form.control} name="state" render={({ field }) =>
                                <FormItem>
                                    <FormLabel>
                                        State
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Your State" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>} />
                        </div>
                        <FormField control={form.control} name="pincode" render={({ field }) =>
                            <FormItem>
                                <FormLabel>
                                    Pin Code
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Your pincode" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>} />

                        <Button type="submit" className="w-full">
                            {editingAddress ? "Update Address" : "Add Address"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </div>
}
