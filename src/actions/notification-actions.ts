'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', notifications: [] }
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return { success: true, notifications }
  } catch (error) {
    console.error('Get notifications error:', error)
    return { success: false, message: 'Failed to fetch notifications', notifications: [] }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
      data: {
        isRead: true,
      },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Mark notification as read error:', error)
    return { success: false, message: 'Failed to mark notification as read' }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Mark all notifications as read error:', error)
    return { success: false, message: 'Failed to mark notifications as read' }
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Delete notification error:', error)
    return { success: false, message: 'Failed to delete notification' }
  }
}
