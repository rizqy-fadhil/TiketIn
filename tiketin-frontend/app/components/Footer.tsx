import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-inverse-surface text-primary dark:text-inverse-primary full-width border-t border-outline-variant dark:border-outline flat no shadows mt-auto">
      <div className="w-full py-stack-lg px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        <div className="text-headline-sm font-headline-sm font-bold text-on-surface dark:text-inverse-on-surface">
          TiketIn
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link
            className="text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary dark:hover:text-inverse-primary text-body-sm font-body-sm"
            href="#"
          >
            Tentang Kami
          </Link>
          <Link
            className="text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary dark:hover:text-inverse-primary text-body-sm font-body-sm"
            href="#"
          >
            Pusat Bantuan
          </Link>
          <Link
            className="text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary dark:hover:text-inverse-primary text-body-sm font-body-sm"
            href="#"
          >
            Syarat & Ketentuan
          </Link>
          <Link
            className="text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary dark:hover:text-inverse-primary text-body-sm font-body-sm"
            href="#"
          >
            Kebijakan Privasi
          </Link>
        </div>
        <div className="text-body-sm font-body-sm text-on-surface-variant dark:text-surface-variant">
          © 2024 TiketIn. Solusi Perjalanan Modern.
        </div>
      </div>
    </footer>
  );
}
