import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const gallery = [
  { title: 'Wedding Frame', tag: '12x18' },
  { title: 'Birthday Poster', tag: '10x15' },
  { title: 'Couple Frame', tag: '16x24' },
  { title: 'Branding Board', tag: 'Website + Logo' },
];

export default function Portfolio() {
  return (
    <div>
      <Navbar />
      <main className="container space-y-16 py-16">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Portfolio</p>
          <h1 className="section-title">Recent visual stories and commerce work.</h1>
          <p className="text-slate-300 leading-8">Our portfolio features premium frames, poster designs, product launches, and branded digital campaigns.</p>
        </section>
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 h-52 rounded-3xl bg-brand-950" />
              <p className="text-sm uppercase tracking-[0.25em] text-brand-300">{item.tag}</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{item.title}</h2>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
