import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const postId = parseInt(params.postId);
    
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { message: 'Post non trouvé' },
        { status: 404 }
      );
    }

    // Check if user already liked the post
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        postId: postId,
      },
    });

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ liked: false });
    }

    // Like the post
    await prisma.like.create({
      data: {
        userId: user.id,
        postId: postId,
      },
    });

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error('Erreur lors du like/unlike:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
