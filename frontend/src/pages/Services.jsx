import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const services = [
  'Photography',
  'Cinematic Videography',
  'Graphic Design',
  'Poster Design',
  'Logo & Branding',
  'Website Development',
  'Social Media Content',
  'Custom Frames & Mobile Cases',
];

export default function Services() {
  return (
    <div>
      <Navbar />
      <main className="container space-y-16 py-16">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Services</p>
          <h1 className="section-title">Digital services for your creative business.</h1>
          <p className="text-slate-300 leading-8">From website design to premium framed prints, we help brands shine with content, commerce, and custom visuals.</p>
        </section>
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <h2 className="text-xl font-semibold text-white">{service}</h2>
              <p className="mt-3 text-slate-300">High-quality delivery with attention to every visual detail.</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
