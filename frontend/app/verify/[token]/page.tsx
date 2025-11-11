"use client"

import { useVerifyEmailMutation } from "@/store/api";
import { authStatus, setEmailVerified } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {

    const { token } = useParams<{ token: string }>()
    const router = useRouter();
    const dispatch = useDispatch();
    const [verifyEmail] = useVerifyEmailMutation();
    const isVerifyEmail = useSelector((state: RootState) => state.user.isEmailVerified)
    const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "alreadyVerified" | "failed">("loading");

    useEffect(() => {
        if (!token) return;

        const runVerification = async () => {
            if (isVerifyEmail) {
                setVerificationStatus("alreadyVerified")
                return;
            }
            try {
                const result = await verifyEmail(token).unwrap();
                console.log(result);
                if (result.success) {
                    dispatch(setEmailVerified(true))
                    setVerificationStatus("success")
                    dispatch(authStatus())
                    toast.success("Email verified successfully")
                    setTimeout(() => {
                        window.location.href = "/"
                    }, 3000)
                } else {
                    throw new Error(result.message || "Verification Failed")
                }
            } catch (error) {
                setVerificationStatus("failed")
                console.log(error)
            }
        }

        runVerification();
    }, [token, verifyEmail, dispatch, isVerifyEmail])
    
    return <div className="p-20 flex justify-center items-center bg-linear-to-r from-blue-100 to-purple-100 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-8 rounded-lg text-center max-w-md w-full">
            
            {verificationStatus === "loading" && (
                <div className="flex flex-col items-center">
                    <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Verifying Your Email
                    </h2>
                    <p className="text-gray-500">
                        Please wait while we verify your email.
                    </p>
                </div>
            )}

            {verificationStatus === "success" && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} className="bg-white p-8 rounded-lg text-center max-w-md w-full">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Email Verified
                        </h2>
                        <p className="text-gray-500">
                            Your Email has been Successfully Verified. You will be redirected to the home page Shortly
                        </p>
                    </motion.div>
                
            )}

            {verificationStatus === "failed" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-3">
                    <h2 className="text-2xl font-semibold text-red-600">Verification failed</h2>
                    <p className="text-gray-500">The link may be invalid or expired. Try requesting a new verification email.</p>
                    <a href="/" className="text-blue-600 underline">Go back home</a>
                </motion.div>
            )}

            {verificationStatus === "alreadyVerified" && (
                 <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} className="bg-white p-8 rounded-lg text-center max-w-md w-full">
                        <CheckCircle className="h-16 w-16 text-green-500  mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Email Already Verified
                        </h2>
                        <p className="text-gray-500">
                            Your Email is already Verified
                        </p>
                        <Button onClick={() => router.push("/")} className="bg-blue-500 mt-2 hover:bg-blue-600 text-white font-bold py-2 transition duration-300 ease-in-out transform hover:scale-105">
                            Go To HomePage
                        </Button>
                    </motion.div>
            )}
        </motion.div>
    </div>

}