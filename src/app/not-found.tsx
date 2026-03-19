import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-green-mid mb-4">
          Page Not Found
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-stone-900 mb-6">
          404
        </h1>
        <p className="font-sans text-stone-500 mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find that page. It may have been moved or no
          longer exists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3.5 bg-green-dark text-white font-sans text-sm tracking-[0.2em] uppercase hover:bg-green-mid transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/cox-cottage"
            className="px-8 py-3.5 border border-stone-300 text-stone-700 font-sans text-sm tracking-[0.2em] uppercase hover:border-green-dark hover:text-green-dark transition-colors"
          >
            View the Cottage
          </Link>
        </div>
      </div>
    </div>
  );
}
