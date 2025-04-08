'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Post as PostType, Comment } from '@/types';

export default function Post({ id, title, content, author, createdAt, likes: initialLikes, comments: initialComments }: PostType) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes || []);
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState('');

  const handleLike = async () => {
    if (!session) {
      setError('Vous devez être connecté pour liker un post');
      return;
    }

    try {
      const res = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        const { liked } = await res.json();
        if (liked) {
          const newLike = {
            id: Date.now(), // Temporary ID
            userId: -1,
            postId: id,
            createdAt: new Date().toISOString()
          };
          setLikes([...likes, newLike]);
        } else {
          setLikes(likes.slice(0, -1));
        }
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('Vous devez être connecté pour commenter');
      return;
    }

    if (!newComment.trim()) {
      setError('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment('');
        setError('');
      } else {
        setError('Une erreur est survenue');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/posts/${id}/comments`);
      if (res.ok) {
        const loadedComments = await res.json();
        setComments(loadedComments);
      }
    } catch (error) {
      setError('Une erreur est survenue lors du chargement des commentaires');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{content}</p>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        <span>Par {author?.name || 'Anonymous'} • </span>
        <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: fr })}</span>
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
        >
          <svg
            className={`w-5 h-5 ${likes.length > 0 ? 'text-blue-500 fill-current' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span>{likes.length}</span>
        </button>

        <button
          onClick={() => {
            setShowComments(!showComments);
            if (!showComments) {
              loadComments();
            }
          }}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4">
          <form onSubmit={handleComment} className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="w-full p-2 border rounded-md"
              rows={2}
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Commenter
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-t pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{comment.user?.name || 'Anonymous'}</p>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
