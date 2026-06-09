import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-surface dark:bg-on-surface text-primary dark:text-inverse-primary docked full-width top-0 border-b border-outline-variant dark:border-outline flat no shadows z-50">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-16">
        <Link
          href="/"
          className="text-headline-md font-headline-md font-bold text-primary dark:text-inverse-primary"
        >
          TiketIn
        </Link>
        <div className="hidden md:flex gap-8 items-center h-full">
          <Link
            className="h-full flex items-center text-primary dark:text-inverse-primary border-b-2 border-primary dark:border-inverse-primary pb-1 text-label-md font-label-md"
            href="#"
          >
            Cari Tiket
          </Link>
          <Link
            className="h-full flex items-center text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors duration-200 text-label-md font-label-md"
            href="#"
          >
            Promo
          </Link>
          <Link
            className="h-full flex items-center text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors duration-200 text-label-md font-label-md"
            href="#"
          >
            Bantuan
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <button
            type="button"
            className="text-primary dark:text-inverse-primary hover:text-primary dark:hover:text-inverse-primary transition-colors duration-200 text-label-md font-label-md"
          >
            Login
          </button>
          <button
            type="button"
            className="bg-primary text-on-primary px-4 py-2 rounded text-label-md font-label-md hover:opacity-80 transition-all"
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}
