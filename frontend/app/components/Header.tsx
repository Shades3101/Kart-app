"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { ChevronRight, Heart, HelpCircle, Lock, LogOut, Menu, Package, Search, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "./AuthPage";
import { useLogoutMutation } from "@/store/api";
import toast from "react-hot-toast";


export default function Header() {

    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const isLoginOpen = useSelector((state: RootState) => state.user.isLoginDialogOpen);
    const [logoutMutation] = useLogoutMutation();

    const user = useSelector((state: RootState) => state.user.user);
    console.log(user)
    const userPlaceholder = user?.name.split(" ").map((name: string) => name[0]).join("");

    function handleProtectionNavigation(href: string) {

        if (user) {
            router.push(href);
            setIsDropdownOpen(false);
        } else {
            dispatch(toggleLoginDialog());
            setIsDropdownOpen(false);
        }
    }

    function handleLoginClick() {

        dispatch(toggleLoginDialog());
        setIsDropdownOpen(false);
    }

    async function handleLogout() {
        try {
            await logoutMutation({}).unwrap()
            dispatch(logout());
            toast.success("user logged out Successfully");
            setIsDropdownOpen(false);

        } catch (error) {
            toast.error("failed to logout")
        }
    }

    // dropdown menu items
    const menuItems = [
        ...(user && user ? [
            {
                href: "account/profile",
                content: (
                    <div className="flex space-x-4 itmes-center p-2 border-b">
                        <Avatar className="w-12 h-12 -ml-2 rounded-full">
                            {user?.profilePicture ? (
                                <AvatarImage src={user.profilePicture} alt="user_image"></AvatarImage>
                            ) : (
                                <AvatarFallback> {userPlaceholder} </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold text-md">
                                {user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {user.email}
                            </span>
                        </div>
                    </div>
                )
            }
        ] : [
            {
                icon: <Lock className="h-5 w-5" />,
                label: "Sign in/ Sign up",
                onclick: handleLoginClick
            },
        ]),

        {
            icon: <User className="h-5 w-5" />,
            label: "My Profile",
            onclick: () => handleProtectionNavigation('/account/profile')
        },
        {
            icon: <Package className="h-5 w-5" />,
            label: "My Orders",
            onclick: () => handleProtectionNavigation('/account/orders')
        },
        {
            icon: <Heart className="h-5 w-5" />,
            label: "Wishlist",
            onclick: () => handleProtectionNavigation('/account/wishlist')
        },
        {
            icon: <HelpCircle className="h-5 w-5" />,
            label: "Help",
            href: "/how-it-works"
        },
        ...(user && user ? [
            {
                icon: <LogOut className="h-5 w-5" />,
                label: "Logout",
                onclick: handleLogout
            },
        ] : [])
    ]

    const MenuItems = ({ className = "" }) => {

        return <div className={className} >
            {menuItems.map((item, index) =>
                item.href ? (
                    <Link key={index} href={item.href} className="flex items-center gap-3 px-4 py-4 text-sm rounded-lg hover:bg-gray-200"
                        onClick={() => setIsDropdownOpen(false)} >
                        {item.icon}
                        <span> {item.label} </span>
                        {item.content && <div className="mt-1"> {item.content}</div>}
                        <ChevronRight className="w-4 h-4 ml-auto" />
                    </Link>
                ) : (
                    <button key={index} className="flex w-full items-center gap-3 px-4 py-4 text-sm rounded-lg hover:bg-gray-200"
                        onClick={item.onclick} >
                        {item.icon}
                        <span> {item.label} </span>

                        <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                )
            )}
        </div>
    }

    return <div>
        <div className="border-b bg-white text-black dark:bg-gray-900 dark:text-white sticky z-50">

            <div className=" container w-[80%] mx-auto hidden lg:flex itmes-center justify-between p-4">
                <Link href='/' className="flex items-center">
                    <Image src="/images/web-logo.png" width={450} height={100} alt="desktop logo" className="h-15 w-auto" />
                </Link>

                <div className="flex flex-2 items-center justify-center max-w-xl px-4">
                    <div className="relative w-full">
                        <Input
                            type="text"
                            placeholder="Search"
                            className="w-full pr-10"
                        />

                        <Button size='icon' variant='ghost' className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer">
                            <Search />

                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href='/book-sell'>
                        <Button variant='secondary' className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                            Sell Used Items
                        </Button>
                    </Link>

                    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen} >
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size='default' className="flex items-center justify-center gap-2 p-3">
                                <Avatar className="w-7 h-7 rounded-full flex items-center justify-center">
                                    {user?.profilePicture ? (
                                        <AvatarImage src={user?.profilePicture} alt="user_image"></AvatarImage>
                                    ) : userPlaceholder ? (
                                        <AvatarFallback> {userPlaceholder} </AvatarFallback>
                                    ) : (
                                        <User />
                                    )}
                                </Avatar>
                                <div>My Account</div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <MenuItems />
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="relative">
                        <Link href="/checkout/cart">
                            <Button variant="ghost" className="relative">
                                <ShoppingCart className=" mr-1" />
                                Cart
                            </Button>
                            {user && (
                                <span className="absolute top-1 left-4 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white  rounded-full px-1 text-xs">3</span>
                            )}

                        </Link>
                    </div>

                </div>

            </div>
        </div>

        {/* Mobile Header */}
        <div className="mx-auto flex lg:hidden items-center justify-between p-4">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className=" w-80 p-0">
                    <SheetHeader>
                        <SheetTitle className="sr-only"></SheetTitle>
                    </SheetHeader>
                    <div className="border-b p-4 -mt-10">
                        <Link href="/">
                            <Image src="/images/web-logo.png" width={150} height={40} alt="mobile logo" className="h-10 w-auto" />
                        </Link>
                    </div>
                    <MenuItems className="py-2 text-black" />
                </SheetContent>
            </Sheet>

            <Link href='/' className="flex items-center">
                <Image src="/images/web-logo.png" width={450} height={100} alt="desktop logo" className="h-6 md:h-10 w-auto" />
            </Link>

            <div className="flex flex-2 items-center justify-center max-w-xl px-4">
                <div className="relative w-full">
                    <Input
                        type="text"
                        placeholder="Search"
                        className="w-full pr-10"
                    />

                    <Button size='icon' variant='ghost' className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer">
                        <Search />
                    </Button>
                </div>
            </div>
            <div className="relative">
                <Link href="/checkout/cart">
                    <Button variant="ghost" className="relative">
                        <ShoppingCart className=" mr-1" />

                    </Button>
                    {user && (
                        <span className="absolute top-1 left-4 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white  rounded-full px-1 text-xs">3</span>
                    )}

                </Link>
            </div>
        </div>
        <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />
    </div>
}

