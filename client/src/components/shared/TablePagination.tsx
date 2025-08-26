import React from 'react';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="mt-4 flex justify-between items-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <span className="mx-2">
              Page {currentPage} sur {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>


      </Pagination>
    </div>
  );
};

export default TablePagination;
