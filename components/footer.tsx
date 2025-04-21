import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ডুমুরিয়া নিউজ ২৪</h3>
            <p className="text-gray-300">আমাদের সাথে থাকুন সর্বশেষ খবর জানতে। আমরা সর্বদা সঠিক এবং নিরপেক্ষ সংবাদ প্রদান করি।</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">দ্রুত লিঙ্ক</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  হোম
                </Link>
              </li>
              <li>
                <Link href="/category/national" className="text-gray-300 hover:text-white">
                  জাতীয়
                </Link>
              </li>
              <li>
                <Link href="/category/international" className="text-gray-300 hover:text-white">
                  আন্তর্জাতিক
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="text-gray-300 hover:text-white">
                  খেলাধুলা
                </Link>
              </li>
              <li>
                <Link href="/category/entertainment" className="text-gray-300 hover:text-white">
                  বিনোদন
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">যোগাযোগ</h3>
            <address className="not-italic text-gray-300">
              <p>ডুমুরিয়া, খুলনা</p>
              <p>বাংলাদেশ</p>
              <p className="mt-2">ইমেইল: info@dumurianews24.com</p>
              <p>ফোন: +৮৮০ ১২৩৪৫৬৭৮৯০</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} ডুমুরিয়া নিউজ ২৪। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  )
}
