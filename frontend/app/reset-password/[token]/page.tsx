"use client"

import { useResetPassMutation } from "@/store/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResetPassword {
    token: string,
    newPassword: string,
    confirmPassword: string
}

export default function resetPassword() {

    const { token } = useParams<{ token: string }>()
    const router = useRouter();
    const dispatch = useDispatch();
    const [resetPassword] = useResetPassMutation();
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [resetPassLoading, setResetPassLoading] = useState(false);

    const { register: register, handleSubmit: handleSubmit, watch, formState: { errors } } = useForm<ResetPassword>();
    const onSubmit = async (data: ResetPassword) => {
        setResetPassLoading(true)
        if (data.newPassword !== data.confirmPassword) {
            toast.error("Passwords Do Not match");
            setResetPassLoading(false)
            return
        }

        try {

            await resetPassword({ token: token, newPassword: data.newPassword }).unwrap;
            setResetPasswordSuccess(true)
            toast.success("Password Reset Successfully")

        } catch (error) {
            toast.error("Password Reset Failed")
        } finally {
            setResetPassLoading(false)
        }
    }
    return <div className="p-20 flex justify-center items-center bg-linear-to-r from-blue-100 to-purple-100">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-8 rounded-lg text-center max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 test-center">
                Reset Your Password
            </h2>

            {!resetPasswordSuccess ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="relative">
                        <Input {...register("newPassword", { required: " New Password is Required" })} placeholder=" New Password" type={showPassword ? "text" : "password"} className="pl-10" />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />

                        {showPassword ? (
                            <EyeOff className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" size={20} onClick={() => setShowPassword(false)} />

                        ) : (

                            <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" size={20} onClick={() => setShowPassword(true)} />
                        )}
                    </div>

                    {errors.newPassword && (
                        <p className="text-red-500 text-sm">
                            {errors.newPassword.message}
                        </p>
                    )}

                    <Input {...register("confirmPassword", { required: " Please Your Confirm Password " })} placeholder=" Confirm New Password" type="password" />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                    <Button className="w-full font-bold bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105" type="submit">
                        {resetPassLoading ? (
                            <Loader2 className="animate-spin mr-2" size={20} />
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                       Password reset Successfully
                    </h2>
                    <p className="text-gray-500">
                        Your Password Changed Successfully.
                    </p>
                    <Button onClick={() => router.push("/")} className="bg-blue-500 mt-2 hover:bg-blue-600 text-white font-bold py-2 transition duration-300 ease-in-out transform hover:scale-105">
                        Go To HomePage
                    </Button>
                </motion.div>
            )}
        </motion.div>
    </div>
}

