import { useState } from 'react';

export default function Copy({ value }) {
  const [isCopying, setIsCopying] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 1000 * 5);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isCopying}
      className="ml-4 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {isCopying ? (
        <svg
          className="h-5 w-5 text-green-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      )}
    </button>
  );
}
