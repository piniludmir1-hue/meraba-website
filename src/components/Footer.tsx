import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-black text-white">
      <div className="container-max py-16 md:py-24">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          <div>
            <h3 className="mb-6 text-lg font-semibold">MERABA</h3>
            <p className="text-sm leading-7 text-gray-400">
              Global food service sourcing and supply partner for catering factories, food manufacturers, hospitality groups, and airlines.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-gray-300">Products</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Serving Ware', 'Catering Equipment', 'CPET Trays', 'Food Packaging'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="transition-smooth hover:text-meraba">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-gray-300">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/about" className="transition-smooth hover:text-meraba">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-smooth hover:text-meraba">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-gray-300">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Email: info@meraba.com</li>
              <li>Phone: +1 (555) 000-0000</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-xs text-gray-500">
            Copyright {currentYear} MERABA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
