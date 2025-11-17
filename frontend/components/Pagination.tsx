import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps){

    return <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled = {currentPage === 1}>
            <ChevronLeft/>
        </Button>
        {Array.from({length:totalPages}, (_,i) => i + 1).map((page)=> (
            <Button key={page} variant={currentPage === page ? "default" : "outline"} className = {currentPage === page ? "bg-blue-500 text-black" : ""} onClick={() => onPageChange(page)}>
                {page}
            </Button>
        ))}

          <Button variant="outline" size="icon" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled = {currentPage === totalPages}>
            <ChevronRight/>
        </Button>
    </div>
}