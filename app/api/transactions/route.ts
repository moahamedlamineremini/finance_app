import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Schéma de validation pour une transaction
const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  title: z.string().min(1, 'Le titre est requis'),
  amount: z.number().positive('Le montant doit être positif'),
  category: z.string().min(1, 'La catégorie est requise'),
  date: z.string().optional(),
  description: z.string().optional(),
})

// GET - Récupérer toutes les transactions de l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les transactions de l'utilisateur
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ transactions }, { status: 200 })

  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle transaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validation des données
    const validatedData = transactionSchema.parse(body)

    // Créer la transaction
    const transaction = await prisma.transaction.create({
      data: {
        type: validatedData.type,
        title: validatedData.title,
        amount: validatedData.amount,
        category: validatedData.category,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        description: validatedData.description || null,
        userId: session.user.id,
      }
    })

    return NextResponse.json(
      { 
        message: 'Transaction créée avec succès',
        transaction 
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la création de la transaction:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une transaction
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de transaction requis' },
        { status: 400 }
      )
    }

    // Vérifier que la transaction appartient à l'utilisateur
    const transaction = await prisma.transaction.findUnique({
      where: { id }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      )
    }

    if (transaction.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Supprimer la transaction
    await prisma.transaction.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Transaction supprimée avec succès' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors de la suppression de la transaction:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
