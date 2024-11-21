import React,{useState} from 'react'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <>
        <nav className="bg-blue-700 shadow-lg fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Title */}
          <div className="text-white font-bold text-xl">
            Word<span className="text-yellow-300">To</span>Pdf
          </div>

          {/* Menu for larger screens */}
          <div className="hidden md:flex space-x-6">
            <a href="#home" className="text-white hover:text-yellow-300">
              Home
            </a>
            <a href="#features" className="text-white hover:text-yellow-300">
              Features
            </a>
            
          </div>

          {/* Hamburger Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-600">
          <a
            href="#home"
            className="block px-4 py-2 text-white hover:bg-blue-700"
          >
            Home
          </a>
          <a
            href="#features"
            className="block px-4 py-2 text-white hover:bg-blue-700"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="block px-4 py-2 text-white hover:bg-blue-700"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="block px-4 py-2 text-white hover:bg-blue-700"
          >
            Contact
          </a>
        </div>
      )}
    </nav>

    </>
  )
}

export default Navbar
