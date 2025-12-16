'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const sendEmailSchema = z.object({
  to: z.array(z.string().email()),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  bodyHtml: z.string().optional(),
  isDraft: z.boolean().optional(),
})

export async function sendEmail(data: z.infer<typeof sendEmailSchema>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    const validated = sendEmailSchema.parse(data)

    // Find or create recipients
    const allRecipients = [
      ...validated.to,
      ...(validated.cc || []),
      ...(validated.bcc || []),
    ]

    const recipientUsers = await Promise.all(
      allRecipients.map(async (email) => {
        let user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          // Create external user
          user = await prisma.user.create({
            data: {
              email,
              name: email.split('@')[0],
            },
          })
        }
        return user
      })
    )

    // Create email with recipients
    const email = await prisma.email.create({
      data: {
        subject: validated.subject,
        body: validated.body,
        bodyHtml: validated.bodyHtml,
        senderId: session.user.id,
        isDraft: validated.isDraft || false,
        sentAt: validated.isDraft ? null : new Date(),
        recipients: {
          create: [
            ...validated.to.map((email) => ({
              userId: recipientUsers.find((u) => u.email === email)!.id,
              type: 'TO' as const,
            })),
            ...(validated.cc || []).map((email) => ({
              userId: recipientUsers.find((u) => u.email === email)!.id,
              type: 'CC' as const,
            })),
            ...(validated.bcc || []).map((email) => ({
              userId: recipientUsers.find((u) => u.email === email)!.id,
              type: 'BCC' as const,
            })),
          ],
        },
      },
    })

    revalidatePath('/inbox')
    revalidatePath('/sent')
    revalidatePath('/drafts')

    return { success: true, message: 'Email sent successfully', emailId: email.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message }
    }
    console.error('Send email error:', error)
    return { success: false, message: 'Failed to send email' }
  }
}

export async function getInboxEmails(page = 1, limit = 50) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', emails: [] }
    }

    const emails = await prisma.email.findMany({
      where: {
        recipients: {
          some: {
            userId: session.user.id,
          },
        },
        isTrashed: false,
        isSpam: false,
        isArchived: false,
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
          where: {
            userId: session.user.id,
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
        },
        attachments: true,
        labels: {
          include: {
            label: true,
          },
        },
        _count: {
          select: {
            recipients: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return { success: true, emails }
  } catch (error) {
    console.error('Get inbox emails error:', error)
    return { success: false, message: 'Failed to fetch emails', emails: [] }
  }
}

export async function getSentEmails(page = 1, limit = 50) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', emails: [] }
    }

    const emails = await prisma.email.findMany({
      where: {
        senderId: session.user.id,
        isDraft: false,
        isTrashed: false,
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
        _count: {
          select: {
            recipients: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return { success: true, emails }
  } catch (error) {
    console.error('Get sent emails error:', error)
    return { success: false, message: 'Failed to fetch sent emails', emails: [] }
  }
}

export async function getDraftEmails(page = 1, limit = 50) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', emails: [] }
    }

    const emails = await prisma.email.findMany({
      where: {
        senderId: session.user.id,
        isDraft: true,
        isTrashed: false,
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
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return { success: true, emails }
  } catch (error) {
    console.error('Get draft emails error:', error)
    return { success: false, message: 'Failed to fetch drafts', emails: [] }
  }
}

export async function getStarredEmails(page = 1, limit = 50) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', emails: [] }
    }

    const emails = await prisma.email.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { recipients: { some: { userId: session.user.id } } },
        ],
        isStarred: true,
        isTrashed: false,
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
      skip: (page - 1) * limit,
      take: limit,
    })

    return { success: true, emails }
  } catch (error) {
    console.error('Get starred emails error:', error)
    return { success: false, message: 'Failed to fetch starred emails', emails: [] }
  }
}

export async function getEmailById(emailId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', email: null }
    }

    const email = await prisma.email.findFirst({
      where: {
        id: emailId,
        OR: [
          { senderId: session.user.id },
          { recipients: { some: { userId: session.user.id } } },
        ],
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
        readReceipts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!email) {
      return { success: false, message: 'Email not found', email: null }
    }

    // Mark as read if recipient
    const recipient = email.recipients.find((r) => r.userId === session.user.id)
    if (recipient && !recipient.isRead) {
      await prisma.emailRecipient.update({
        where: { id: recipient.id },
        data: { isRead: true, readAt: new Date() },
      })
    }

    return { success: true, email }
  } catch (error) {
    console.error('Get email by ID error:', error)
    return { success: false, message: 'Failed to fetch email', email: null }
  }
}

export async function toggleStarEmail(emailId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    const email = await prisma.email.findFirst({
      where: {
        id: emailId,
        OR: [
          { senderId: session.user.id },
          { recipients: { some: { userId: session.user.id } } },
        ],
      },
    })

    if (!email) {
      return { success: false, message: 'Email not found' }
    }

    await prisma.email.update({
      where: { id: emailId },
      data: { isStarred: !email.isStarred },
    })

    revalidatePath('/inbox')
    revalidatePath('/starred')
    revalidatePath('/sent')

    return { success: true, isStarred: !email.isStarred }
  } catch (error) {
    console.error('Toggle star error:', error)
    return { success: false, message: 'Failed to toggle star' }
  }
}

export async function markAsRead(emailId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.emailRecipient.updateMany({
      where: {
        emailId,
        userId: session.user.id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    revalidatePath('/inbox')
    return { success: true }
  } catch (error) {
    console.error('Mark as read error:', error)
    return { success: false, message: 'Failed to mark as read' }
  }
}

export async function markAsUnread(emailId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.emailRecipient.updateMany({
      where: {
        emailId,
        userId: session.user.id,
      },
      data: {
        isRead: false,
        readAt: null,
      },
    })

    revalidatePath('/inbox')
    return { success: true }
  } catch (error) {
    console.error('Mark as unread error:', error)
    return { success: false, message: 'Failed to mark as unread' }
  }
}

export async function moveToTrash(emailId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.email.update({
      where: { id: emailId },
      data: { isTrashed: true },
    })

    revalidatePath('/inbox')
    revalidatePath('/trash')
    return { success: true }
  } catch (error) {
    console.error('Move to trash error:', error)
    return { success: false, message: 'Failed to move to trash' }
  }
}

export async function archiveEmail(emailId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.email.update({
      where: { id: emailId },
      data: { isArchived: true },
    })

    revalidatePath('/inbox')
    revalidatePath('/archive')
    return { success: true }
  } catch (error) {
    console.error('Archive email error:', error)
    return { success: false, message: 'Failed to archive email' }
  }
}

export async function deleteEmailPermanently(emailId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.email.delete({
      where: { id: emailId },
    })

    revalidatePath('/trash')
    return { success: true }
  } catch (error) {
    console.error('Delete email error:', error)
    return { success: false, message: 'Failed to delete email' }
  }
}