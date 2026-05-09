import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { PAGINATION_LIMIT } from '../constants/app.constants';

interface IPaginationProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalItems, onPageChange }: IPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGINATION_LIMIT));

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) { pages.push(i); }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  if (totalItems === 0) return undefined;

  const startItem = (currentPage - 1) * PAGINATION_LIMIT + 1;
  const endItem = Math.min(currentPage * PAGINATION_LIMIT, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      <div className="text-sm text-(--color-text-muted)">
        Showing <span className="font-medium text-(--color-text-secondary)">{startItem}</span> to{' '}
        <span className="font-medium text-(--color-text-secondary)">{endItem}</span> of{' '}
        <span className="font-medium text-(--color-text-secondary)">{totalItems}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-(--radius-sm) text-[#6b7280] hover:text-(--color-text-primary) hover:bg-(--color-surface-raised) disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-[120ms] active:scale-[0.95]" aria-label="Previous page">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPageNumbers().map((page, index) => {
          return typeof page === 'string' ? (
            <div key={`ellipsis-${index}`} className="px-1.5 text-(--color-text-muted)"><MoreHorizontal className="w-4 h-4" /></div>
          ) : (
            <button key={page} onClick={() => handlePageChange(page)} className={`w-8 h-8 flex items-center justify-center rounded-(--radius-sm) text-sm font-medium transition-all duration-[120ms] active:scale-[0.95] ${currentPage === page ? 'bg-(--color-primary) text-(--color-text-inverse) shadow-(--shadow-xs)' : 'text-(--color-text-secondary) hover:bg-(--color-surface-raised) hover:text-(--color-text-primary)'}`}>
              {page}
            </button>
          );
        })}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-(--radius-sm) text-[#6b7280] hover:text-(--color-text-primary) hover:bg-(--color-surface-raised) disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-[120ms] active:scale-[0.95]" aria-label="Next page">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
