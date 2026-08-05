import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const packages = [
  { title: 'Frame Studio', price: '₹499', desc: 'Custom photo frames with premium print styling.' },
  { title: 'Brand Starter', price: '₹9,999', desc: 'Logo, poster, and social design package.' },
  { title: 'Website Launch', price: '₹24,999', desc: 'Landing page or small business website.' },
];

export default function Pricing() {
  return (
    <div>
      <Navbar />
      <main className="container space-y-16 py-16">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Pricing</p>
          <h1 className="section-title">Packages for every creative need.</h1>
          <p className="text-slate-300 leading-8">Clean pricing for frames, websites, branding, and premium marketing services.</p>
        </section>
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <article key={pkg.title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <h2 className="text-2xl font-bold text-white">{pkg.price}</h2>
              <p className="mt-2 text-xl font-semibold text-slate-100">{pkg.title}</p>
              <p className="mt-4 text-slate-300">{pkg.desc}</p>
              <button className="btn-primary mt-6">Book Now</button>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
