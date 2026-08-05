import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="py-6">
      <div className="container flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-black text-white">Visil Spark Studio</Link>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-100">
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/register" className="text-sm text-slate-200/90">Register</Link>
        </div>
      </div>
    </header>
  );
}
