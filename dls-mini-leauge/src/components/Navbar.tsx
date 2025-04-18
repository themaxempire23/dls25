import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-3 flex space-x-6">
        <Link href="/" className="hover:text-gray-300">Home</Link>
        <Link href="/record" className="hover:text-gray-300">Record</Link>
        <Link href="/standings" className="hover:text-gray-300">Standings</Link>
        <Link href="/fixtures" className="hover:text-gray-300">Fixtures</Link>
      </div>
    </nav>
  );
}
