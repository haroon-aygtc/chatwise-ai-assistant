
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  // Generate page numbers
  const generatePageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    const leftSiblingIndex = Math.max(2, currentPage - siblingCount);
    const rightSiblingIndex = Math.min(totalPages - 1, currentPage + siblingCount);
    
    // Add dots before left sibling if there's a gap
    if (leftSiblingIndex > 2) {
      pageNumbers.push("...");
    }
    
    // Add page numbers between left and right siblings
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }
    
    // Add dots after right sibling if there's a gap
    if (rightSiblingIndex < totalPages - 1) {
      pageNumbers.push("...");
    }
    
    // Always show last page if we have more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();
  
  // Handle next and previous page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  // Go to first or last page
  const goToFirstPage = () => {
    onPageChange(1);
  };
  
  const goToLastPage = () => {
    onPageChange(totalPages);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToFirstPage}
        disabled={currentPage === 1}
        title="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        title="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {pageNumbers.map((pageNumber, index) => (
        <Button
          key={index}
          variant={currentPage === pageNumber ? "default" : "outline"}
          size="sm"
          onClick={() => typeof pageNumber === "number" && onPageChange(pageNumber)}
          disabled={pageNumber === "..."}
        >
          {pageNumber}
        </Button>
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToLastPage}
        disabled={currentPage === totalPages}
        title="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
