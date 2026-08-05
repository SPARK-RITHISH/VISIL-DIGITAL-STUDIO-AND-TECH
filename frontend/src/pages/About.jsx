import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function About() {
  return (
    <div>
      <Navbar />
      <main className="container space-y-16 py-16">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">About Us</p>
          <h1 className="section-title">A boutique studio for frames, web, and branding.</h1>
          <p className="text-slate-300 leading-8">Visil Spark Studio blends photography, design, and digital commerce to build unforgettable customer experiences. We specialize in premium photo frames, custom mobile cases, and marketing-ready web solutions.</p>
        </section>
        <section className="grid gap-6 lg:grid-cols-3">
          {[
            { title: 'Our Mission', text: 'Deliver creative products and digital services with exceptional style and speed.' },
            { title: 'Our Vision', text: 'Build a modern studio where design meets commerce for social-first brands.' },
            { title: 'Our Values', text: 'Quality, trust, speed, and support at every stage.' },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <h2 className="text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-slate-300">{item.text}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
