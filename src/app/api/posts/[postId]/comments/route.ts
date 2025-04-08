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

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { message: 'Le contenu est requis' },
        { status: 400 }
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

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: user.id,
        postId: postId,
      },
      include: {
        user: true
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = parseInt(params.postId);
    
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
