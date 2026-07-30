"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import LoginModal from "./LoginModal";

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Tutup dropdown saat klik di luar ─────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Inisial avatar dari nama user ─────────────────────────────────────────
  function getInitials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  return (
    <>
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
              href="/promo"
            >
              Promo (dummy)
            </Link>
            <Link
              className="h-full flex items-center text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors duration-200 text-label-md font-label-md"
              href="/bantuan"
            >
              Bantuan (dummy)
            </Link>
          </div>

          {/* ── Auth Area ─────────────────────────────────────────────────── */}
          <div className="flex gap-4 items-center">
            {/* Selama hydration, tampilkan placeholder untuk mencegah layout shift */}
            {isLoading ? (
              <div className="w-20 h-8 rounded animate-pulse" style={{ background: "var(--color-surface-container-low)" }} />
            ) : user ? (
              /* ── User sudah login: avatar + nama + dropdown ── */
              <div ref={dropdownRef} className="relative">
                <button
                  id="user-menu-button"
                  type="button"
                  onClick={() => setIsDropdownOpen((o) => !o)}
                  className="flex items-center gap-2.5 rounded-full pl-1.5 pr-3 py-1.5 transition-colors hover:opacity-80"
                  style={{
                    background: "var(--color-surface-container-low)",
                    border: "1px solid var(--color-outline-variant)",
                  }}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {/* Avatar inisial */}
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: "var(--color-primary)",
                      color: "var(--color-on-primary)",
                    }}
                  >
                    {getInitials(user.name)}
                  </span>
                  <span
                    className="text-label-md font-label-md max-w-[120px] truncate"
                    style={{ color: "var(--color-on-surface)" }}
                  >
                    {user.name.split(" ")[0]}
                  </span>
                  <span
                    className="material-symbols-outlined text-[16px] transition-transform duration-200"
                    style={{
                      color: "var(--color-on-surface-variant)",
                      transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    expand_more
                  </span>
                </button>

                {/* ── Dropdown menu ── */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl overflow-hidden z-[60]"
                    style={{
                      background: "var(--color-surface-container-lowest)",
                      border: "1px solid var(--color-outline-variant)",
                    }}
                    role="menu"
                    aria-labelledby="user-menu-button"
                  >
                    {/* Info user di atas dropdown */}
                    <div
                      className="px-4 py-3 border-b"
                      style={{ borderColor: "var(--color-outline-variant)" }}
                    >
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--color-on-surface)" }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        {user.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        role="menuitem"
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:opacity-80 text-left"
                        style={{
                          color: "var(--color-on-surface)",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            "var(--color-surface-container-low)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            "transparent")
                        }
                      >
                        <span className="material-symbols-outlined text-[18px]" style={{ color: "var(--color-primary)" }}>
                          person
                        </span>
                        Edit Profil
                      </button>

                      <button
                        role="menuitem"
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                        style={{
                          color: "var(--color-on-surface)",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            "var(--color-surface-container-low)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            "transparent")
                        }
                      >
                        <span className="material-symbols-outlined text-[18px]" style={{ color: "var(--color-primary)" }}>
                          confirmation_number
                        </span>
                        My Booking
                      </button>
                    </div>

                    {/* Divider + Logout */}
                    <div
                      className="border-t py-1"
                      style={{ borderColor: "var(--color-outline-variant)" }}
                    >
                      <button
                        role="menuitem"
                        type="button"
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                        style={{
                          color: "var(--color-error)",
                          background: "transparent",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            "color-mix(in srgb, var(--color-error) 10%, transparent)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background =
                            "transparent")
                        }
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          logout
                        </span>
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── User belum login: tombol Login & Register ── */
              <>
                <button
                  id="header-login-btn"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-primary dark:text-inverse-primary hover:text-primary dark:hover:text-inverse-primary transition-colors duration-200 text-label-md font-label-md"
                >
                  Login
                </button>
                <button
                  id="header-register-btn"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-on-primary px-4 py-2 rounded text-label-md font-label-md hover:opacity-80 transition-all"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Login Modal (portal ke body secara efektif lewat fixed positioning) ── */}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
