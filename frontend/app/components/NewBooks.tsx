import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { books } from "@/lib/Constant";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewBooks() {
    const [currentBook, setCurrentBook] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBook((prev) => (prev + 1) % 3); // 3 is to show only three items at a time 
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrentBook((prev) => (prev - 1 + 3) % 3)
    }

    const nextSlide = () => {
        setCurrentBook((prev) => (prev + 1) % 3)
    }

    const calculateDiscount = (price: number, finalPrice: number): number => {
        if (price > finalPrice && price > 0) {

            return Math.round(((price - finalPrice) / price) * 100)
        }
        return 0;
    }

    return <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
                Newly Added Books
            </h2>
            <div className="relative">
                {books.length > 0 ? (
                    <>
                        <div className="overflow-hidden">
                            <div className="flex transition-transform duration-500 ease-in-out "
                                style={{ transform: `translateX(-${currentBook * 100}%)` }}>
                                {[0, 1, 2].map((slideIndex) => (
                                    <div key={slideIndex} className="flex-none w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {books.slice(slideIndex * 3, slideIndex * 3 + 3).map((book) => (
                                                <Card key={book._id} className="relative">
                                                    <CardContent className="p-4">
                                                        <Link href={`/books/${book._id}`}>
                                                            <div className="relative">
                                                                <Image 
                                                                src={book.images[0]} 
                                                                alt={book.title} 
                                                                width={200} 
                                                                height={300} 
                                                                className="mb-4 h-[200px] w-full object-cover rounded-md"
                                                                />
                                                                {calculateDiscount(book.price, book.finalPrice) > 0 && (
                                                                    <span className="absolute left-0 top-2 rounded-r-lg bg-red-500 px-2 py-1 text-xs font-medium text-white">
                                                                            {calculateDiscount(book.price, book.finalPrice)}%off
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className="mb-2 line-clamp-2 text-sm font-medium">
                                                                {book.title}
                                                            </h3>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className="text-lg font-bold">
                                                                        ₹{book.finalPrice} 
                                                                    </span>
                                                                    {book.price && (
                                                                        <span className="text-sm text-muted-foreground line-through">
                                                                            ₹{book.price} 
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex justify-between items-center text-xs text-zinc-400">
                                                                    <span>
                                                                        {book.condition}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="pt-4">
                                                                    <Button className = "flex float-end  bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700">
                                                                        Buy Now
                                                                    </Button>
                                                            </div>
                                                        </Link>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Scroll Button */}

                        <button className=" absolute -left-15 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md" onClick={prevSlide}>
                                <ChevronLeft/>
                        </button>
                        
                        <button className=" absolute -right-15 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md" onClick={nextSlide}>
                                <ChevronRight/>
                        </button>


                        {/* Dot Animtaion */}
                        <div className="mt-8 flex justify-center space-x-2">
                            {[0,1,2].map((dot) => (
                                <button key={dot} onClick={() => setCurrentBook(dot)} className={`h-3 w-3 rounded-full ${currentBook === dot? 'bg-blue-600': 'bg-gray-300'}`}>

                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500">
                        No Books To Display
                    </p>
                )}
            </div>
        </div>
    </section>
}