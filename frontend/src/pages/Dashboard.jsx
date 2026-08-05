import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <main className="container space-y-16 py-16">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Admin Dashboard</p>
          <h1 className="section-title">Manage orders, projects, and customers.</h1>
        </section>
        <section className="grid gap-6 lg:grid-cols-3">
          {['Orders', 'Projects', 'Analytics'].map((item) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <h2 className="text-xl font-semibold text-white">{item}</h2>
              <p className="mt-3 text-slate-300">Overview of the latest activity and metrics.</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
