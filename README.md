📧 Gmail Clone – Full-Stack Email Platform

A modern, production-ready Gmail clone built with Next.js, TypeScript, Prisma, and PostgreSQL.
This project replicates core Gmail functionality while demonstrating real-world system design, authentication, real-time notifications, and scalable architecture.

Built for learning, portfolio showcase, and SaaS-grade reference.

🚀 Features
Core Email Features

User authentication (secure sign-in & sessions)

Inbox, Sent, Drafts & Trash

Compose, send, reply & forward emails

Read / unread status

Email search & filtering

Threaded conversations

Soft delete & restore

🔔 Real-Time Capabilities

Read receipt notifications (sender is notified when recipient opens an email)

Live inbox updates using WebSockets / Server Events

🎨 UI & UX

Gmail-inspired clean UI

Fully responsive layout

Accessible components

Optimized performance with App Router

🛠 Tech Stack
Frontend

Next.js (App Router)

React

TypeScript

Tailwind CSS

shadcn/ui

Backend

Next.js Server Actions / API Routes

Auth.js (NextAuth)

WebSockets / SSE for real-time events

Database

PostgreSQL

Prisma ORM

gmail-clone/
├── prisma/
│   ├── schema.prisma                 # Complete database schema
│   ├── migrations/                   # Database migrations
│   └── seed.ts                       # Seed data for development
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Main application routes
│   │   │   ├── inbox/                # Inbox view
│   │   │   ├── sent/                 # Sent emails
│   │   │   ├── drafts/               # Draft emails
│   │   │   ├── starred/              # Starred emails
│   │   │   ├── snoozed/              # Snoozed emails
│   │   │   ├── trash/                # Trash
│   │   │   ├── spam/                 # Spam folder
│   │   │   ├── label/[labelId]/      # Emails by label
│   │   │   ├── thread/[threadId]/    # Email thread view
│   │   │   ├── compose/              # Compose email
│   │   │   └── layout.tsx            # Dashboard layout (sidebar + header)
│   │   │
│   │   ├── api/                      # API Route Handlers
│   │   │   ├── auth/                 # Auth.js routes
│   │   │   ├── emails/               # Email APIs
│   │   │   ├── threads/              # Thread APIs
│   │   │   ├── labels/               # Label management
│   │   │   ├── attachments/          # File uploads & downloads
│   │   │   ├── notifications/        # Notifications
│   │   │   ├── read-receipts/         # Read receipt tracking
│   │   │   └── search/               # Search API
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing / redirect page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # Reusable React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── email/                    # Email-related components
│   │   ├── editor/                   # Rich text editor
│   │   ├── sidebar/                  # Sidebar navigation
│   │   ├── notifications/            # Notification system
│   │   ├── search/                   # Search UI
│   │   └── common/                   # Shared components
│   │
│   ├── lib/                          # Core utilities & configs
│   │   ├── auth.ts                   # Auth.js configuration
│   │   ├── prisma.ts                 # Prisma client
│   │   ├── utils.ts                  # Utility helpers
│   │   ├── validators.ts             # Zod schemas
│   │   └── email-parser.ts           # Email parsing logic
│   │
│   ├── actions/                      # Server Actions
│   │   ├── email-actions.ts
│   │   ├── thread-actions.ts
│   │   ├── label-actions.ts
│   │   ├── attachment-actions.ts
│   │   ├── notification-actions.ts
│   │   └── read-receipt-actions.ts
│   │
│   ├── services/                     # Business logic layer
│   │   ├── email-service.ts
│   │   ├── thread-service.ts
│   │   ├── notification-service.ts
│   │   ├── read-receipt-service.ts
│   │   ├── label-service.ts
│   │   └── spam-service.ts
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-emails.ts
│   │   ├── use-thread.ts
│   │   ├── use-notifications.ts
│   │   ├── use-read-receipts.ts
│   │   ├── use-labels.ts
│   │   └── use-search.ts
│   │
│   ├── types/                        # TypeScript types
│   │   ├── email.ts
│   │   ├── thread.ts
│   │   ├── user.ts
│   │   ├── notification.ts
│   │   └── label.ts
│   │
│   ├── workers/                      # Background jobs
│   │   ├── email-sender.ts
│   │   ├── notification-dispatcher.ts
│   │   └── cleanup-jobs.ts
│   │
│   └── middleware.ts                 # Auth middleware
│
├── public/                           # Static assets
│   ├── icons/
│   └── images/
│
├── .env                              # Environment variables
├── .env.example                      # Env template
├── next.config.js                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
└── README.md                         # Documentation



⚙️ Environment Variables

Create a .env file using .env.example:

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gmail_clone"

# Auth.js
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Optional (Real-time)
WEBSOCKET_URL="ws://localhost:3001"

🧪 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/gmail-clone.git
cd gmail-clone

2️⃣ Install Dependencies
npm install

3️⃣ Setup Database
npx prisma generate
npx prisma migrate dev

4️⃣ Run the App
npm run dev


Visit: http://localhost:3000

📬 Read Receipt Feature (How It Works)

Sender sends an email

Recipient opens the email

Backend marks email as read

A real-time event is emitted

Sender instantly receives a “Seen” notification

Designed similar to Gmail / WhatsApp read receipts.

🔒 Security Considerations

Secure session handling via Auth.js

Server-side authorization checks

Rate-limited sensitive endpoints

Prepared for production deployment

🧠 Learning Outcomes

Full-stack SaaS architecture

Real-time systems with WebSockets

Database schema design for messaging systems

Modern authentication flows

Scalable frontend & backend patterns

🚧 Roadmap

 Email attachments

 Spam filtering

 Labels & categories

 Email scheduling

 Full-text search (Postgres FTS)

 Mobile PWA support

🤝 Contributing

Contributions are welcome!

Fork the repo

Create a feature branch

Commit your changes

Open a Pull Request

📄 License

MIT License
Feel free to use this project for learning, portfolio, or commercial inspiration.

⭐ Support

If you find this project useful:

⭐ Star the repo

🐛 Report issues

💡 Suggest improvements

If you want, I can also:

Add screenshots section

Write API documentation

Create Prisma schema for emails

Optimize this README for FAANG / OpenAI-style portfolios