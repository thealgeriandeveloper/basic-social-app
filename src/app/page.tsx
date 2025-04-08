import { prisma } from '@/lib/prisma';
import Post from '@/components/Post';
import { Post as PostType } from '@/types';

async function getPosts() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      likes: {
        include: {
          user: true
        }
      },
      comments: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Convert dates to strings and format the response
  return posts.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    comments: post.comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    })),
    likes: post.likes.map(like => ({
      ...like,
      createdAt: like.createdAt.toISOString()
    }))
  })) as PostType[];
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 space-y-8">
      <h1 className="text-3xl font-bold">Posts Récents</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">Aucun post pour le moment.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post: PostType) => (
            <Post key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
