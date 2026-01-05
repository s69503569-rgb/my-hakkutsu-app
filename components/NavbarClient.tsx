'use client'

import Link from "next/link";
import { signout } from "@/app/auth/actions";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

export default function NavbarClient({ user }: { user: User | null }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="bg-white shadow-sm p-4 sticky top-0 z-50 border-b border-stone-100">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="text-2xl font-bold text-[#8d6e63] flex items-center gap-2">
                    <span>🏺</span>
                    <span>発掘Mate</span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-600 focus:outline-none p-2"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavLinks user={user} mobile={false} />
                </nav>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <NavLinks user={user} mobile={true} onItemClick={() => setIsMenuOpen(false)} />
                </div>
            )}
        </header>
    );
}

function NavLinks({ user, mobile, onItemClick }: { user: User | null, mobile: boolean, onItemClick?: () => void }) {
    const baseClass = mobile
        ? "text-gray-600 hover:text-[#8d6e63] font-medium transition-colors block py-2 px-2 hover:bg-gray-50 rounded"
        : "text-gray-600 hover:text-[#8d6e63] font-medium transition-colors";

    return (
        <>
            <Link href="/jobs" className={baseClass} onClick={onItemClick}>
                求人を探す
            </Link>
            <Link href="/learning" className={baseClass} onClick={onItemClick}>
                学びの広場
            </Link>

            {user ? (
                <>
                    <Link href="/mypage" className={baseClass} onClick={onItemClick}>
                        マイページ
                    </Link>
                    <Link href="/settings" className={baseClass} onClick={onItemClick}>
                        設定
                    </Link>
                    <form action={signout} className={mobile ? "w-full" : ""}>
                        <button type="submit" className={mobile
                            ? "w-full text-left text-sm bg-gray-100 text-gray-600 px-4 py-3 rounded hover:bg-gray-200 transition-colors"
                            : "text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                        }>
                            ログアウト
                        </button>
                    </form>
                </>
            ) : (
                <Link
                    href="/auth"
                    className={mobile
                        ? "block bg-[#8d6e63] text-white px-5 py-3 rounded text-center font-bold shadow-sm"
                        : "bg-[#8d6e63] text-white px-5 py-2 rounded-full hover:bg-[#6d4c41] transition-colors font-bold shadow-sm hover:shadow"
                    }
                    onClick={onItemClick}
                >
                    ログイン / 登録
                </Link>
            )}
        </>
    )
}
