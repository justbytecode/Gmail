import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EmailList } from '@/components/email/email-list'
import { EmailToolbar } from '@/components/email/email-toolbar'

async function getArchivedEmails() {
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
      isArchived: true,
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
    take: 50,
  })

  return emails
}

export default async function ArchivePage() {
  const emails = await getArchivedEmails()

  return (
    <div className="flex flex-col h-full">
      <EmailToolbar totalCount={emails.length} />
      <EmailList 
        emails={emails} 
        emptyMessage="No archived emails. Archived emails will appear here."
      />
    </div>
  )
}