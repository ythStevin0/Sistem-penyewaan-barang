import Link from "next/link";
import { ArrowRight, Tent } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section Dummy */}
      <section className="relative bg-forest-900 text-white overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 to-transparent"></div>
        
        <div className="container relative z-10 flex flex-col items-center text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800/50 border border-forest-700 mb-6 backdrop-blur-sm text-forest-200 text-sm font-medium">
            <Tent className="h-4 w-4 text-accent" />
            <span>Pusat Sewa Alat Outdoor #1</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mb-6">
            Jelajahi Alam Bebas Tanpa Batas Bersama <span className="text-accent">Samidd</span>
          </h1>
          
          <p className="text-lg md:text-xl text-forest-200 max-w-2xl mb-10 leading-relaxed">
            Sewa tenda, carrier, dan peralatan pendakian gunung berkualitas dengan harga terjangkau. Mudah, cepat, dan aman.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/catalog" 
              className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
            >
              Lihat Katalog Alat
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="/cara-sewa" 
              className="inline-flex items-center justify-center gap-2 bg-forest-800 text-white px-8 py-4 rounded-lg font-medium hover:bg-forest-700 border border-forest-600 transition-colors"
            >
              Cara Sewa
            </Link>
          </div>
        </div>
      </section>

      {/* Spacing to test scroll */}
      <section className="py-24 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Kenapa Memilih Kami?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kami menyediakan peralatan camping terbaik yang selalu dirawat dan dibersihkan setelah digunakan.
          </p>
        </div>
      </section>
    </div>
  );
}

