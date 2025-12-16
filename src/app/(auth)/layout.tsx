import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // If user is already authenticated, redirect to inbox
  if (session) {
    redirect('/inbox')
  }

  return (
    <>
      {children}
    </>
  )
}