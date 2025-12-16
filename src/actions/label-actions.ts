'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createLabelSchema = z.object({
  name: z.string().min(1, 'Label name is required').max(50),
  color: z.string().optional(),
})

export async function createLabel(data: z.infer<typeof createLabelSchema>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    const validated = createLabelSchema.parse(data)

    // Check if label already exists
    const existingLabel = await prisma.label.findUnique({
      where: { name: validated.name },
    })

    let label
    if (existingLabel) {
      // Check if user already has this label
      const userLabel = await prisma.userLabel.findUnique({
        where: {
          userId_labelId: {
            userId: session.user.id,
            labelId: existingLabel.id,
          },
        },
      })

      if (userLabel) {
        return { success: false, message: 'Label already exists' }
      }

      // Associate existing label with user
      await prisma.userLabel.create({
        data: {
          userId: session.user.id,
          labelId: existingLabel.id,
        },
      })

      label = existingLabel
    } else {
      // Create new label and associate with user
      label = await prisma.label.create({
        data: {
          name: validated.name,
          color: validated.color || '#6B7280',
          userLabels: {
            create: {
              userId: session.user.id,
            },
          },
        },
      })
    }

    revalidatePath('/inbox')
    return { success: true, label }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message }
    }
    console.error('Create label error:', error)
    return { success: false, message: 'Failed to create label' }
  }
}

export async function getUserLabels() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', labels: [] }
    }

    const userLabels = await prisma.userLabel.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        label: {
          include: {
            emails: {
              where: {
                email: {
                  OR: [
                    { senderId: session.user.id },
                    { recipients: { some: { userId: session.user.id } } },
                  ],
                  isTrashed: false,
                },
              },
            },
          },
        },
      },
    })

    const labels = userLabels.map((ul) => ({
      ...ul.label,
      count: ul.label.emails.length,
    }))

    return { success: true, labels }
  } catch (error) {
    console.error('Get user labels error:', error)
    return { success: false, message: 'Failed to fetch labels', labels: [] }
  }
}

export async function updateLabel(labelId: string, data: { name?: string; color?: string }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    // Check if user has access to this label
    const userLabel = await prisma.userLabel.findFirst({
      where: {
        userId: session.user.id,
        labelId,
      },
    })

    if (!userLabel) {
      return { success: false, message: 'Label not found' }
    }

    const label = await prisma.label.update({
      where: { id: labelId },
      data,
    })

    revalidatePath('/inbox')
    return { success: true, label }
  } catch (error) {
    console.error('Update label error:', error)
    return { success: false, message: 'Failed to update label' }
  }
}

export async function deleteLabel(labelId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    // Remove user's association with label
    await prisma.userLabel.deleteMany({
      where: {
        userId: session.user.id,
        labelId,
      },
    })

    // Check if any other users have this label
    const otherUsers = await prisma.userLabel.count({
      where: { labelId },
    })

    // If no other users have this label, delete it
    if (otherUsers === 0) {
      await prisma.label.delete({
        where: { id: labelId },
      })
    }

    revalidatePath('/inbox')
    return { success: true }
  } catch (error) {
    console.error('Delete label error:', error)
    return { success: false, message: 'Failed to delete label' }
  }
}

export async function addLabelToEmail(emailId: string, labelId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    // Check if user has access to this email
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

    // Check if label is already applied
    const existing = await prisma.emailLabel.findUnique({
      where: {
        emailId_labelId: {
          emailId,
          labelId,
        },
      },
    })

    if (existing) {
      return { success: false, message: 'Label already applied' }
    }

    await prisma.emailLabel.create({
      data: {
        emailId,
        labelId,
      },
    })

    revalidatePath('/inbox')
    return { success: true }
  } catch (error) {
    console.error('Add label to email error:', error)
    return { success: false, message: 'Failed to add label' }
  }
}

export async function removeLabelFromEmail(emailId: string, labelId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized' }
    }

    await prisma.emailLabel.delete({
      where: {
        emailId_labelId: {
          emailId,
          labelId,
        },
      },
    })

    revalidatePath('/inbox')
    return { success: true }
  } catch (error) {
    console.error('Remove label from email error:', error)
    return { success: false, message: 'Failed to remove label' }
  }
}

export async function getEmailsByLabel(labelId: string, page = 1, limit = 50) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, message: 'Unauthorized', emails: [] }
    }

    const emails = await prisma.email.findMany({
      where: {
        labels: {
          some: {
            labelId,
          },
        },
        OR: [
          { senderId: session.user.id },
          { recipients: { some: { userId: session.user.id } } },
        ],
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
    console.error('Get emails by label error:', error)
    return { success: false, message: 'Failed to fetch emails', emails: [] }
  }
}