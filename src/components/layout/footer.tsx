import Link from "next/link";
import { Mountain } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-forest-950 text-forest-50 py-12 md:py-16">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Mountain className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Samidd<span className="text-accent">Outdoor</span></span>
          </Link>
          <p className="text-forest-200 text-sm leading-relaxed max-w-xs">
            Mitra terpercaya untuk petualangan alam bebas Anda. Menyediakan penyewaan perlengkapan pendakian berkualitas sejak 2024.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg text-white">Navigasi</h3>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-forest-200 hover:text-white transition-colors text-sm">Beranda</Link>
            <Link href="/catalog" className="text-forest-200 hover:text-white transition-colors text-sm">Katalog Peralatan</Link>
            <Link href="/cara-sewa" className="text-forest-200 hover:text-white transition-colors text-sm">Cara Sewa & Syarat</Link>
            <Link href="/faq" className="text-forest-200 hover:text-white transition-colors text-sm">Tanya Jawab (FAQ)</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg text-white">Hubungi Kami</h3>
          <address className="not-italic flex flex-col gap-2 text-sm text-forest-200">
            <p>Jl. Pendaki No. 99, Pos Pendakian</p>
            <p>Malang, Jawa Timur</p>
            <p className="mt-2">WhatsApp: +62 812-3456-7890</p>
            <p>Email: halo@samidd.id</p>
          </address>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg text-white">Sosial Media</h3>
          <div className="flex gap-4">
            <a href="#" className="h-10 w-10 rounded-full bg-forest-900 flex items-center justify-center text-forest-200 hover:bg-accent hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="h-10 w-10 rounded-full bg-forest-900 flex items-center justify-center text-forest-200 hover:bg-accent hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="h-10 w-10 rounded-full bg-forest-900 flex items-center justify-center text-forest-200 hover:bg-accent hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mt-12 pt-8 border-t border-forest-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-forest-400">
        <p>&copy; {new Date().getFullYear()} Samidd Outdoor. Hak cipta dilindungi.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-forest-200 transition-colors">Kebijakan Privasi</Link>
          <Link href="/terms" className="hover:text-forest-200 transition-colors">Syarat & Ketentuan</Link>
        </div>
      </div>
    </footer>
  );
}
