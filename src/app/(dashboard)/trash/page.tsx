import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EmailList } from '@/components/email/email-list'
import { EmailToolbar } from '@/components/email/email-toolbar'

async function getTrashedEmails() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return []
  }

  const emails = await prisma.email.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { recipients: { some: { userId: session.user.id } } },
      ],
      isTrashed: true,
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
    take: 50,
  })

  return emails
}

export default async function TrashPage() {
  const emails = await getTrashedEmails()

  return (
    <div className="flex flex-col h-full">
      <EmailToolbar totalCount={emails.length} />
      <EmailList 
        emails={emails} 
        emptyMessage="No emails in trash. Deleted emails will appear here for 30 days."
      />
    </div>
  )
}