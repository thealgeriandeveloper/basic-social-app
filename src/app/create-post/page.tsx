'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreatePostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState('');

  if (!session) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8">Créer un nouveau post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-500">{error}</div>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titre
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Contenu
          </label>
          <textarea
            name="content"
            id="content"
            rows={6}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Publier
        </button>
      </form>
    </div>
  );
}
