import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function Contact() {
  return (
    <div>
      <Navbar />
      <main className="container space-y-16 py-16">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Contact</p>
          <h1 className="section-title">Let’s bring your idea to life.</h1>
          <p className="text-slate-300 leading-8">Message us for custom frames, website builds, branding projects, and WhatsApp collaboration.</p>
        </section>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
          <form className="grid gap-6">
            <input className="w-full rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-slate-100" placeholder="Name" />
            <input className="w-full rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-slate-100" placeholder="Email" />
            <textarea className="w-full rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-slate-100" rows="6" placeholder="Your message" />
            <button type="submit" className="btn-primary w-max">Send Message</button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
