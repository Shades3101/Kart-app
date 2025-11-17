"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BASE_URL, useForgotPasswordMutation, useLoginMutation, useRegisterMutation } from "@/store/api";
import { authStatus, toggleLoginDialog } from "@/store/slice/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Lock, EyeOff, Eye, Loader2, User, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

enum Tab {
    login = "login",
    signup = "signup",
    forgot = "forgot"
}

interface LoginProps {
    isLoginOpen: boolean,
    setIsLoginOpen: (open: boolean) => void;
}

interface LoginFormData {
    email: string,
    password: string
}

interface SignupFormData {
    name: string,
    email: string,
    password: string,
    agreeTerms: boolean
}
interface forgotPassFormData {
    email: string
}

export default function AuthPage({ isLoginOpen, setIsLoginOpen }: LoginProps) {

    const [currentTab, setCurrentTab] = useState<Tab>(Tab.login);
    const [ShowPassword, setShowPassword] = useState(false);
    const [forgotPasswordSuccess, setforgotPasswordSuccess] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [register] = useRegisterMutation();
    const [login] = useLoginMutation();
    const [forgotPass] = useForgotPasswordMutation();
    const dispatch = useDispatch();
    const router = useRouter();


    const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginError } } = useForm<LoginFormData>();
    const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: SignupError } } = useForm<SignupFormData>();
    const { register: registerForgot, handleSubmit: handleForgotSubmit, formState: { errors: ForgotError } } = useForm<forgotPassFormData>();

    const onSubmitSignUp = async (data: SignupFormData) => {
        setSignupLoading(true)

        try {
            const { email, password, name } = data;
            const result = await register({ email, password, name }).unwrap();

            if (result.success) {
                toast.success('Verification Link Sent Successfully'),
                    dispatch(toggleLoginDialog())
            }
        } catch (error) {
            toast.error("Email Already exists")
        } finally {
            setSignupLoading(false)
        }
    }

    const onSubmitLogin = async (data: LoginFormData) => {
        setLoginLoading(true)

        console.log(data)

        try {
            const { email, password } = data;
            const result = await login({ email, password }).unwrap();

            if (result.success) {
                console.log(result.success)
                toast.success('Login Successfully')
                dispatch(toggleLoginDialog())
                dispatch(authStatus())
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
            toast.error("Email or Password is Incorrect")
        } finally {
            setLoginLoading(false)
        }
    }

    const handleGoogleLogin = async () => {

        setGoogleLoading(true)
        try {
            router.push(`${BASE_URL}/auth/google`)
            dispatch(authStatus())
            dispatch(toggleLoginDialog())
            setTimeout(() => {
                toast.success("Google Login Successfully");
                
            }, 3000)
        } catch (error) {
        console.log(error)
        toast.error("Email or Password is Incorrect")
    } finally {
        setGoogleLoading(false)
    }
}

const onSubmitForgotPass = async (data: forgotPassFormData) => {
        setForgotLoading(true)

        console.log(data)

        try {
            const result = await forgotPass(data).unwrap();

            if (result.success) {
                console.log(result.success)
                toast.success('Password Reset Link Sent Successfully')
                setforgotPasswordSuccess(true);
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to send password reset Link")
        } finally {
            setForgotLoading(false)
        }
    }

return <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
    <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold mb-4">
                Welcome To Kart
            </DialogTitle>
            <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as Tab)}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="login"> Login</TabsTrigger>
                    <TabsTrigger value="signup"> SignUp</TabsTrigger>
                    <TabsTrigger value="forgot"> Forgot</TabsTrigger>
                </TabsList>
                <AnimatePresence mode="wait">
                    <motion.div key={currentTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>

                        <TabsContent value="login" className="space-y-4">
                            <form onSubmit={handleLoginSubmit(onSubmitLogin)} className="space-y-4">
                                <div className="relative">
                                    <Input {...registerLogin("email", { required: "Email is Required" })} placeholder="Email" type="email" className="pl-10" />
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                </div>

                                {loginError.email && (
                                    <p className="text-red-500 text-sm">
                                        {loginError.email.message}
                                    </p>
                                )}

                                <div className="relative">
                                    <Input {...registerLogin("password", { required: "Password is Required" })} placeholder="Password" type={ShowPassword ? "text" : "password"} className="pl-10" />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />

                                    {ShowPassword ? (
                                        <EyeOff className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" size={20} onClick={() => setShowPassword(false)} />

                                    ) : (

                                        <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" size={20} onClick={() => setShowPassword(true)} />
                                    )}
                                </div>

                                {loginError.password && (
                                    <p className="text-red-500 text-sm">
                                        {loginError.password.message}
                                    </p>
                                )}

                                <Button className="w-full font-bold" type="submit">
                                    {loginLoading ? (
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </form>

                            <div className="flex items-center my-4">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <p className="mx-2 text-gray-500 text-sm">
                                    Or
                                </p>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>
                            <Button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                                {googleLoading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                        Login With Google...
                                    </>
                                ) : (
                                    <>
                                        <Image src='/icons/google.svg' alt="google" width={20} height={20} />
                                        Login With Google
                                    </>
                                )}

                            </Button>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4">
                            <form onSubmit={handleSignupSubmit(onSubmitSignUp)} className="space-y-4">
                                <div className="relative">
                                    <Input {...registerSignup("name", { required: "Name is Required" })} placeholder="Name" type="text" className="pl-10" />
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                </div>
                                {SignupError.name && (
                                    <p className="text-red-500 text-sm">
                                        {SignupError.name.message}
                                    </p>
                                )}

                                <div className="relative">
                                    <Input {...registerSignup("email", { required: "Email is Required" })} placeholder="Email" type="email" className="pl-10" />
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                </div>
                                {SignupError.email && (
                                    <p className="text-red-500 text-sm">
                                        {SignupError.email.message}
                                    </p>
                                )}

                                <div className="relative">
                                    <Input {...registerSignup("password", { required: "Password is Required" })} placeholder="Password" type={ShowPassword ? "text" : "password"} className="pl-10" />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />

                                    {ShowPassword ? (
                                        <EyeOff className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" size={20} onClick={() => setShowPassword(false)} />

                                    ) : (

                                        <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" size={20} onClick={() => setShowPassword(true)} />
                                    )}
                                </div>

                                {SignupError.password && (
                                    <p className="text-red-500 text-sm">
                                        {SignupError.password.message}
                                    </p>
                                )}

                                <div className="flex items-center">
                                    <input type="checkbox" {...registerSignup('agreeTerms', {
                                        required: "You must agree to the terms and conditions before continuing forward"
                                    })}
                                        className="mr-2"
                                    />
                                    <label className="text-sm text-gray-700 ">
                                        I agree to the Terms & Conditions
                                    </label>
                                </div>
                                {SignupError.agreeTerms && (
                                    <p className="text-red-500 text-sm">
                                        {SignupError.agreeTerms.message}
                                    </p>
                                )}

                                <Button className="w-full font-bold" type="submit">
                                    {signupLoading ? (
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="forgot" className="space-y-4">
                            {!forgotPasswordSuccess ? (

                                <form className="space-y-4" onSubmit={handleForgotSubmit(onSubmitForgotPass)}>
                                    <div className="relative">
                                        <Input {...registerForgot("email", { required: "Email is Required" })} placeholder="Email" type="email" className="pl-10" />
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                    </div>
                                    {ForgotError.email && (
                                        <p className="text-red-500 text-sm">
                                            {ForgotError.email.message}
                                        </p>
                                    )}

                                    <Button className="w-full font-bold" type="submit">
                                        {forgotLoading ? (
                                            <Loader2 className="animate-spin mr-2" size={20} />
                                        ) : (
                                            "Forgot Password"
                                        )}
                                    </Button>
                                </form>

                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                                    <CheckCircle className="text-green-500 mx-auto" />
                                    <h3 className="text-xl font-semibold text-gray-700">
                                        Reset Link Send
                                    </h3>
                                    <p className="text-gray-500">
                                        `We've sent a password reset link to your email. Please
                                        check your inbox and follow the instructions to reset your
                                        password.`
                                    </p>
                                    <Button onClick={() => setforgotPasswordSuccess(false)} className="w-full">
                                        Send Another Link To Email
                                    </Button>
                                </motion.div>
                            )}

                        </TabsContent>
                    </motion.div>
                </AnimatePresence>
            </Tabs>

            <p className="text-sm text-center mt-2 text-gray-600">
                By clicking "agree", you agree to our {" "}
                <Link href='/terms-of-use' className="text-blue-500 hover:underline">Terms of Use</Link>
                ,{" "}
                <Link href='/privacy-policy' className="text-blue-500 hover:underline">Privacy Policy</Link>
            </p>
        </DialogHeader>
    </DialogContent>
</Dialog>
}
