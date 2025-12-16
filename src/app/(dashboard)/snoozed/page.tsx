import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EmailList } from '@/components/email/email-list'
import { EmailToolbar } from '@/components/email/email-toolbar'

async function getSnoozedEmails() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return []
  }

  const emails = await prisma.email.findMany({
    where: {
      recipients: {
        some: {
          userId: session.user.id,
        },
      },
      scheduledAt: {
        not: null,
        gt: new Date(),
      },
      isTrashed: false,
      isSpam: false,
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
      scheduledAt: 'asc',
    },
    take: 50,
  })

  return emails
}

export default async function SnoozedPage() {
  const emails = await getSnoozedEmails()

  return (
    <div className="flex flex-col h-full">
      <EmailToolbar totalCount={emails.length} />
      <EmailList 
        emails={emails} 
        emptyMessage="No snoozed emails. Snoozed emails will reappear at the scheduled time."
      />
    </div>
  )
}
