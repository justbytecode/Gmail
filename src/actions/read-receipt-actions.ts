'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function recordReadReceipt(emailId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    // Check if email exists and user is a recipient
    const email = await prisma.email.findFirst({
      where: {
        id: emailId,
        recipients: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        sender: true,
      },
    })

    if (!email) {
      return { success: false, message: 'Email not found' }
    }

    // Check if read receipt already exists
    const existingReceipt = await prisma.readReceipt.findUnique({
      where: {
        emailId_userId: {
          emailId,
          userId: session.user.id,
        },
      },
    })

    if (existingReceipt) {
      return { success: true, message: 'Read receipt already recorded' }
    }

    // Create read receipt
    await prisma.readReceipt.create({
      data: {
        emailId,
        userId: session.user.id,
      },
    })

    // Create notification for sender
    if (email.senderId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: email.senderId,
          type: 'READ_RECEIPT',
          title: 'Email Read',
          message: `${session.user.email} has read your email: ${email.subject}`,
          emailId,
        },
      })
    }

    revalidatePath(`/email/${emailId}`)
    return { success: true }
  } catch (error) {
    console.error('Record read receipt error:', error)
    return { success: false, message: 'Failed to record read receipt' }
  }
}

export async function getReadReceipts(emailId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', receipts: [] }
    }

    const receipts = await prisma.readReceipt.findMany({
      where: {
        emailId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        readAt: 'desc',
      },
    })

    return { success: true, receipts }
  } catch (error) {
    console.error('Get read receipts error:', error)
    return { success: false, message: 'Failed to fetch read receipts', receipts: [] }
  }
}