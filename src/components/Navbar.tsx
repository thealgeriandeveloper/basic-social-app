'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            Mon Site
          </Link>
          <div className="flex space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Accueil
            </Link>
            {session ? (
              <>
                <Link href="/create-post" className="text-gray-700 hover:text-gray-900">
                  Créer un Post
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  Connexion
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-gray-900">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
