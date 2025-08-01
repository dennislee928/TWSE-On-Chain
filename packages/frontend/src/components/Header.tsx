import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-gray-900">
              TWSE On-Chain
            </Link>
            <span className="text-sm text-gray-500">
              台灣證交所資料上鏈存證
            </span>
          </div>

          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              首頁
            </Link>
            <Link
              href="/docs"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              文檔
            </Link>
            <Link
              href="/api"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              API
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
