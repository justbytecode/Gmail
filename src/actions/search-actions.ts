'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function searchEmails(query: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', emails: [] }
    }

    if (!query || query.trim().length === 0) {
      return { success: true, emails: [] }
    }

    const emails = await prisma.email.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { recipients: { some: { userId: session.user.id } } },
        ],
        isTrashed: false,
        AND: {
          OR: [
            { subject: { contains: query, mode: 'insensitive' } },
            { body: { contains: query, mode: 'insensitive' } },
            { sender: { email: { contains: query, mode: 'insensitive' } } },
            { sender: { name: { contains: query, mode: 'insensitive' } } },
          ],
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        recipients: {
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
        },
        attachments: true,
        labels: {
          include: {
            label: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: 50,
    })

    return { success: true, emails }
  } catch (error) {
    console.error('Search emails error:', error)
    return { success: false, message: 'Failed to search emails', emails: [] }
  }
}

export async function advancedSearchEmails(filters: {
  from?: string
  to?: string
  subject?: string
  hasWords?: string
  doesntHave?: string
  hasAttachment?: boolean
  dateFrom?: Date
  dateTo?: Date
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', emails: [] }
    }

    const where: any = {
      OR: [
        { senderId: session.user.id },
        { recipients: { some: { userId: session.user.id } } },
      ],
      isTrashed: false,
      AND: [],
    }

    if (filters.from) {
      where.AND.push({
        sender: {
          OR: [
            { email: { contains: filters.from, mode: 'insensitive' } },
            { name: { contains: filters.from, mode: 'insensitive' } },
          ],
        },
      })
    }

    if (filters.to) {
      where.AND.push({
        recipients: {
          some: {
            user: {
              OR: [
                { email: { contains: filters.to, mode: 'insensitive' } },
                { name: { contains: filters.to, mode: 'insensitive' } },
              ],
            },
          },
        },
      })
    }

    if (filters.subject) {
      where.AND.push({
        subject: { contains: filters.subject, mode: 'insensitive' },
      })
    }

    if (filters.hasWords) {
      where.AND.push({
        OR: [
          { subject: { contains: filters.hasWords, mode: 'insensitive' } },
          { body: { contains: filters.hasWords, mode: 'insensitive' } },
        ],
      })
    }

    if (filters.doesntHave) {
      where.AND.push({
        AND: [
          { subject: { not: { contains: filters.doesntHave, mode: 'insensitive' } } },
          { body: { not: { contains: filters.doesntHave, mode: 'insensitive' } } },
        ],
      })
    }

    if (filters.hasAttachment) {
      where.AND.push({
        attachments: {
          some: {},
        },
      })
    }

    if (filters.dateFrom) {
      where.AND.push({
        sentAt: {
          gte: filters.dateFrom,
        },
      })
    }

    if (filters.dateTo) {
      where.AND.push({
        sentAt: {
          lte: filters.dateTo,
        },
      })
    }

    const emails = await prisma.email.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        recipients: {
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
        },
        attachments: true,
        labels: {
          include: {
            label: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: 100,
    })

    return { success: true, emails }
  } catch (error) {
    console.error('Advanced search error:', error)
    return { success: false, message: 'Failed to search emails', emails: [] }
  }
}