import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const posts = [
  { title: 'How to sell premium frames online', date: 'June 2026' },
  { title: 'Creating photo products that convert', date: 'May 2026' },
  { title: 'Social content for wedding brands', date: 'April 2026' },
];

export default function Blog() {
  return (
    <div>
      <Navbar />
      <main className="container space-y-16 py-16">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Blog</p>
          <h1 className="section-title">Stories from the studio.</h1>
          <p className="text-slate-300 leading-8">Insights on product design, branding, web launches, and digital growth.</p>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <p className="text-sm uppercase tracking-[0.25em] text-brand-300">{post.date}</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{post.title}</h2>
              <p className="mt-4 text-slate-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
