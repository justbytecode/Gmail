export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/inbox/:path*',
    '/sent/:path*',
    '/drafts/:path*',
    '/starred/:path*',
    '/snoozed/:path*',
    '/trash/:path*',
    '/spam/:path*',
    '/label/:path*',
    '/thread/:path*',
    '/compose/:path*',
  ],
}