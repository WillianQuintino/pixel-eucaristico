import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 border-b-4 border-black sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-none z-[1] mt-3 w-52 p-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black"
          >
            <li><Link href="/">Home</Link></li>
            <li><Link href="/games">Games</Link></li>
            <li><Link href="/software">Software</Link></li>
            <li><Link href="/curriculum">Curriculum</Link></li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-bold tracking-tighter">Pixel Eucarístico</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link href="/" className="hover:bg-primary hover:text-white border-2 border-transparent hover:border-black transition-all rounded-none">Home</Link></li>
          <li><Link href="/games" className="hover:bg-primary hover:text-white border-2 border-transparent hover:border-black transition-all rounded-none">Games</Link></li>
          <li><Link href="/software" className="hover:bg-primary hover:text-white border-2 border-transparent hover:border-black transition-all rounded-none">Software</Link></li>
          <li><Link href="/curriculum" className="hover:bg-primary hover:text-white border-2 border-transparent hover:border-black transition-all rounded-none">Curriculum</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn btn-primary btn-sm border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-none">Login</a>
      </div>
    </div>
  );
}
