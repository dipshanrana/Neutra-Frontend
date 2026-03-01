import Link from "next/link";
import Image from "next/image";

const SvgSearch = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 20L16 16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 8C9.34315 8 8 9.34315 8 11" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
  </svg>
)

const SvgUser = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 11C10 11 10 9 10 9" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
  </svg>
)

const SvgMenu = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth}>
    <line x1="4" x2="20" y1="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="4" x2="20" y1="6" y2="6" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="4" x2="14" y1="18" y2="18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white transition-all duration-300 font-sans shadow-[0_1px_0_rgba(29,53,87,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center lg:pr-16">
            <Link href="/" className="flex items-center">
              <span className="text-[1.75rem] font-medium tracking-tight text-[#1D3557] font-heading">
                Nutri<span className="text-[#34A0A4]">Core</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered text */}
          <div className="hidden md:flex flex-1 justify-center space-x-12">
            <Link href="/products" className="text-sm font-medium text-[#1D3557]/80 hover:text-[#34A0A4] transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium text-[#1D3557]/80 hover:text-[#34A0A4] transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium text-[#1D3557]/80 hover:text-[#34A0A4] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium text-[#1D3557]/80 hover:text-[#34A0A4] transition-colors">
              Contact
            </Link>
            <Link href="/information" className="text-sm font-medium text-[#1D3557]/80 hover:text-[#34A0A4] transition-colors">
              Information
            </Link>
            <Link href="/blog" className="text-sm font-medium text-[#1D3557]/80 hover:text-[#34A0A4] transition-colors">
              Blog
            </Link>
          </div>

          {/* Right Icon Nav */}
          <div className="hidden md:flex items-center space-x-6 pl-4">
            {/* Premium Search Box */}
            <div className="relative group flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="pl-5 pr-12 py-2.5 rounded-full border border-[#1D3557]/10 bg-[#F1FAEE]/30 text-sm text-[#1D3557] font-sans w-48 focus:outline-none focus:border-[#34A0A4]/50 focus:bg-white transition-all duration-300 placeholder:text-[#1D3557]/40 shadow-[0_2px_10px_rgba(29,53,87,0.02)]"
              />
              <button className="absolute right-4 text-[#1D3557]/50 hover:text-[#34A0A4] transition-colors">
                <SvgSearch className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
            </div>

            <button className="text-[#1D3557] hover:text-[#34A0A4] transition-colors">
              <SvgUser className="w-[20px] h-[20px]" strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-6">
            <button className="text-[#1D3557] hover:text-[#34A0A4] transition-colors">
              <SvgSearch className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button className="text-[#1D3557] hover:text-[#34A0A4]">
              <SvgMenu className="w-[24px] h-[24px]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
