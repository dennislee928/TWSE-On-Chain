export function Footer() {
  return (
    <footer className="bg-gray-900 text-white fixed bottom-0 left-0 right-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p>&copy; 2023 TWSE On-Chain. MIT License.</p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/your-username/twse-on-chain"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://openapi.twse.com.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              TWSE API
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
