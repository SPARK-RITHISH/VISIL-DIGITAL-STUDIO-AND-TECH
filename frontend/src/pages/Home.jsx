import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="container space-y-16 py-16">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <p className="rounded-full bg-brand-500/15 px-4 py-2 text-sm uppercase tracking-[0.3em] text-brand-100">Photo Frames, Website, Branding</p>
            <h1 className="section-title text-white">Visil Spark Studio — Premium Photo Frames & Digital Services</h1>
            <p className="section-subtitle text-lg leading-8 text-slate-300">Create beautiful custom frame products, websites, branding, and social media campaigns for weddings, events, and businesses.</p>
            <div className="flex flex-wrap gap-4">
              <a href="/shop" className="btn-primary">Shop Frames</a>
              <a href="/contact" className="text-sm text-slate-200 underline">Get a free quote</a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
            <div className="aspect-video overflow-hidden rounded-[1.5rem] bg-brand-950" />
            <div className="mt-6 space-y-4 text-slate-200">
              <div className="rounded-3xl border border-white/10 bg-brand-900/80 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Ready to launch your brand</p>
                <h2 className="mt-2 text-3xl font-bold">Visual commerce made easy.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">Fast delivery</p>
                  <p className="mt-2 font-semibold">3–5 day frame shipping</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">Online support</p>
                  <p className="mt-2 font-semibold">WhatsApp & email help</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Custom Frames', desc: 'Professional-quality frames for weddings, portraits, and events.' },
            { title: 'Branding', desc: 'Logos, posters, and social content with premium polish.' },
            { title: 'Websites', desc: 'Fast, responsive landing pages and e-commerce sites.' },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-slate-300">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
