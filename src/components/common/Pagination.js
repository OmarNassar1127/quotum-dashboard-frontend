import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (pagination.last_page <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(pagination.current_page - 1)}
          disabled={pagination.current_page === 1}
          className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
            ${pagination.current_page === 1
              ? "bg-gray-100 text-gray-400"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(pagination.current_page + 1)}
          disabled={pagination.current_page === pagination.last_page}
          className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
            ${pagination.current_page === pagination.last_page
              ? "bg-gray-100 text-gray-400"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(pagination.current_page - 1) * pagination.per_page + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total
              )}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2
                ${pagination.current_page === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {[...Array(pagination.last_page)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === pagination.last_page ||
                (page >= pagination.current_page - 1 &&
                  page <= pagination.current_page + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium
                      ${pagination.current_page === page
                        ? "z-10 bg-blue-600 text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    {page}
                  </button>
                );
              }
              if (
                page === pagination.current_page - 2 ||
                page === pagination.current_page + 2
              ) {
                return (
                  <span
                    key={page}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2
                ${pagination.current_page === pagination.last_page
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;