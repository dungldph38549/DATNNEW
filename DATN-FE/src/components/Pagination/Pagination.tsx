import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (page > 0) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) onPageChange(page + 1);
  };

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <button
        onClick={handlePrev}
        disabled={page === 0}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Trước
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded ${
            page === i
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 hover:bg-gray-300'
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={page === totalPages - 1}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Tiếp
      </button>
    </div>
  );
};

export default Pagination;
