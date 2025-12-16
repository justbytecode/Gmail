A modern, production-ready Gmail clone featuring real-time notifications, threaded conversations, and a scalable architecture. Built with Next.js 14, TypeScript, Prisma ORM, and PostgreSQL to demonstrate enterprise-grade full-stack development practices.
Perfect for portfolios, learning advanced full-stack patterns, and showcasing real-world SaaS architecture.

✨ Key Features
📨 Core Email Functionality

Complete Email Management: Compose, send, reply, forward, and organize emails
Smart Organization: Inbox, Sent, Drafts, Starred, Snoozed, Trash, and Spam folders
Threaded Conversations: Gmail-style email threading for better context
Advanced Search: Full-text search with filters across all email fields
Labels & Categories: Custom labels for personalized email organization
Soft Delete & Restore: Safe deletion with 30-day recovery window

🔔 Real-Time Features

Live Read Receipts: Instant sender notifications when recipients open emails
Real-Time Inbox Updates: WebSocket-powered live email synchronization
Push Notifications: Browser notifications for new incoming emails
Typing Indicators: See when others are composing replies (optional)

🎨 User Experience

Gmail-Inspired UI: Familiar, intuitive interface design
Fully Responsive: Seamless experience across desktop, tablet, and mobile
Dark Mode Support: System-based or manual theme switching
Accessibility First: WCAG 2.1 AA compliant with keyboard navigation
Rich Text Editor: Format emails with bold, italic, lists, links, and more

🔒 Security & Authentication

Secure Authentication: Auth.js (NextAuth) with session management
OAuth Integration: Sign in with Google, GitHub, or email/password
Role-Based Access: User permissions and authorization checks
Rate Limiting: Protection against abuse and spam
CSRF Protection: Secure forms and API endpoints


🛠️ Tech Stack
Frontend

Next.js 14 - React framework with App Router
React 18 - UI component library
TypeScript - Type-safe development
Tailwind CSS - Utility-first styling
shadcn/ui - Accessible component system
Zod - Schema validation

Backend

Next.js API Routes - RESTful endpoints
Server Actions - Type-safe server mutations
Auth.js - Authentication & authorization
WebSockets / SSE - Real-time communication

Database & ORM

PostgreSQL - Relational database
Prisma ORM - Type-safe database client
Full-Text Search - Native PostgreSQL search capabilities

DevOps & Tools

ESLint & Prettier - Code quality and formatting
Husky - Git hooks for pre-commit checks
Docker - Containerization for local development



🚀 Getting Started
Prerequisites
Ensure you have the following installed:

Node.js 18.x or higher
npm or yarn or pnpm
PostgreSQL 14+ (or use Docker)
Git

Installation

Clone the repository

bash   git clone https://github.com/yourusername/gmail-clone.git
   cd gmail-clone

Install dependencies

bash   npm install

Set up environment variables

bash   cp .env.example .env
Update .env with your configuration:
env   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/gmail_clone"
   
   # Authentication (Auth.js)
   AUTH_SECRET="generate-with-openssl-rand-base64-32"
   AUTH_GOOGLE_ID="your-google-oauth-client-id"
   AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"
   
   # Real-time (Optional)
   WEBSOCKET_URL="ws://localhost:3001"

Set up the database

bash   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed database (optional)
   npx prisma db seed

Start the development server

bash   npm run dev

Open your browser
Navigate to http://localhost:3000

Docker Setup (Alternative)
Use Docker Compose for a containerized setup:
bash# Start all services
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate dev

# View logs
docker-compose logs -f

🔧 Configuration
Database Schema
The Prisma schema includes the following core models:

User: Authentication and profile
Email: Email messages with metadata
Thread: Conversation threading
Label: Custom labels and categories
Attachment: File uploads
Notification: Real-time notifications
ReadReceipt: Email read tracking

View the complete schema in prisma/schema.prisma.
Authentication Setup
This project uses Auth.js with multiple providers:

Google OAuth: Configure in Google Cloud Console
GitHub OAuth: Set up in GitHub Developer Settings
Email/Password: Built-in credential authentication


📖 Usage Examples
Sending an Email
typescriptimport { sendEmail } from '@/actions/email-actions';

await sendEmail({
  to: ['recipient@example.com'],
  subject: 'Hello World',
  body: '<p>This is a test email</p>',
  threadId: null, // or existing thread ID for replies
});
Real-Time Notifications
typescriptimport { useNotifications } from '@/hooks/use-notifications';

function NotificationBell() {
  const { notifications, markAsRead } = useNotifications();
  
  return (
    <div>
      {notifications.map(notif => (
        <div key={notif.id} onClick={() => markAsRead(notif.id)}>
          {notif.message}
        </div>
      ))}
    </div>
  );
}

🎯 Read Receipt System
The read receipt feature works as follows:

Sender composes and sends an email with read receipts enabled
Recipient opens the email in their inbox
System detects the email has been read and triggers a notification event
Real-time update sends a WebSocket message to the sender
Sender sees a "Read" or "Seen" indicator next to their sent email

Implementation Details:

Server-side tracking prevents client-side manipulation
Privacy-respecting: recipients can disable read receipts in settings
Batched updates reduce server load for high-volume users


🧪 Testing
bash# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage

🚢 Deployment
Vercel (Recommended)
Show Image

Push your code to GitHub
Import project in Vercel
Configure environment variables
Deploy

Self-Hosted
bash# Build for production
npm run build

# Start production server
npm start
Database Hosting Options:

Neon - Serverless Postgres
Supabase - Open-source Firebase alternative
Railway - Simple PostgreSQL hosting


🗺️ Roadmap

 Core email functionality
 Real-time read receipts
 Threaded conversations
 Full-text search
 File attachments with cloud storage
 Advanced spam filtering with ML
 Email scheduling
 Snooze emails
 Mobile PWA support
 Email templates
 Calendar integration
 Contact management


🤝 Contributing
Contributions are welcome and encouraged! Here's how to get involved:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

Please read CONTRIBUTING.md for our code of conduct and development guidelines.

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
You are free to use this project for:

Personal learning
Portfolio projects
Commercial applications
Educational purposes


🙏 Acknowledgments

Gmail for design inspiration
Vercel for Next.js and hosting
Prisma team for an excellent ORM
shadcn for beautiful UI components
Open-source community for continuous inspiration
