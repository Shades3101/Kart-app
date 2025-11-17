"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userData } from "@/lib/type/type";
import { useUpdateUserMutation } from "@/store/api";
import { setUser } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function ProfilePage() {

    const [isEditing, setIsEditing] = useState(false);
    const user = useSelector((state: RootState) => state.user.user);
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const dispatch = useDispatch();

    const { register, handleSubmit, reset } = useForm<userData>({
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || ""
        }
    });

    useEffect(() => {
        reset({
            name: user.name,
            email: user.email,
            phone: user.phone
        })
    }, [user, isEditing, reset])


    //TODO: FIX THE EDITING DATA PROBLEM { Done }

    const handleProfileEdit = async (data: userData) => {
        try {
            const { name, phone } = data;
            const result = await updateUser({ userId: user?._id, userData: { name, phone } });

            if (result && result.data) {
                const updatedUser = result.data.data;

                dispatch(setUser(updatedUser));

                reset({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone
                });

                setIsEditing(false);
                toast.success("Profile Updated Successfully");
            } else {
                console.log(result.error);
                throw new Error("Could Not update Profile");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile");
        }
    }
    
    return <div className="space-y-6">
        <div className="bg-linear-to-r from-pink-500 to-rose-500 text-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-2">
                My Profile
            </h1>
            <p className=" text-pink-100">
                Manage Your Personal Information and Prefrences
            </p>
        </div>
        <Card className="border-t-4 border-t-pink-500 shadow-lg">
            <CardHeader className="bg-linear-to-r from-pink-50 to-rose-50">
                <CardTitle className="text-2xl text-pink-700">
                    Personal Information
                </CardTitle>
                <CardDescription>
                    Update Your Profile
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <form onSubmit={handleSubmit(handleProfileEdit)}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="username">
                                Username
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input id="username" placeholder="John Doe" disabled={!isEditing} className="pl-10" {...register("name")} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input id="email" placeholder="Johndoe@gmail.com" disabled={true} className="pl-10"{...register("email")} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                Phone
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input id="phone" placeholder="+1 234 567 890" disabled={!isEditing} className="pl-10" {...register("phone")} />
                            </div>
                        </div>
                    </div>

                    <CardFooter className="bg-pink-50 mt-4 flex justify-between rounded-lg">
                        {isEditing ? (
                            <>
                                <Button type="button" variant="outline" className="m-4" onClick={() => {
                                    setIsEditing(false);
                                    reset();
                                }}>
                                    Discard Changes
                                </Button>

                                <Button type="submit" variant="outline" className="bg-linear-to-r from-pink-500 to-rose-500 text-white" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button type="button" variant="outline" className=" m-4 bg-linear-to-r from-pink-500 to-rose-500 text-white " onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
                            </>
                        )}
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    </div>
}