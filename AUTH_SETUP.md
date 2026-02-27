# Authentication System Setup Guide

This project uses **Supabase** for authentication with support for email/password and Google OAuth.

## 🚀 Quick Start

### 1. Install Dependencies

The required Supabase package is already installed:

```bash
pnpm install
```

### 2. Set Up Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings** → **API**
3. Copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Configure Google OAuth (Optional)

To enable Google Sign-In:

1. Go to your Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Follow Supabase instructions to create Google OAuth credentials
4. Add authorized redirect URL: `https://your-project.supabase.co/auth/v1/callback`

## 📁 Project Structure

```
app/
├── (auth)/
│   ├── login/
│   │   ├── page.tsx                    # Login page
│   │   └── components/
│   │       ├── LoginForm.tsx           # Login form with email/password
│   │       └── SignInWithGoogleButton.tsx  # Google OAuth button
│   ├── signup/
│   │   ├── page.tsx                    # Signup page
│   │   └── components/
│   │       └── SignUpForm.tsx          # Registration form
│   ├── logout/
│   │   └── page.tsx                    # Logout confirmation page
│   └── auth/
│       ├── callback/
│       │   └── route.ts                # OAuth callback handler
│       └── confirm/
│           └── route.ts                # Email confirmation handler
lib/
└── auth-actions.ts                     # Server actions for authentication
utils/
└── supabase/
    ├── client.ts                       # Browser Supabase client
    ├── server.ts                       # Server Supabase client
    └── middleware.ts                   # Session management
middleware.ts                           # Route protection & auth checks
```

## 🔐 Features Implemented

### ✅ Email/Password Authentication

- User registration with first name and last name
- Login with email and password
- Error handling and validation
- Success/error messages

### ✅ Google OAuth

- One-click Google sign-in
- Automatic account creation
- Secure callback handling

### ✅ Route Protection

- Middleware automatically protects all routes
- Public routes: `/login`, `/signup`, `/auth/*`
- Redirects unauthenticated users to login
- Preserves intended destination with `?next=` parameter

### ✅ Session Management

- Automatic session refresh
- Secure cookie-based sessions
- Server-side user verification

### ✅ User Experience

- Loading states on all forms
- Error and success message display
- Redirect after login/signup
- Email confirmation flow

## 🛠️ Usage

### Get Current User (Server Component)

```typescript
import { getUser } from "@/lib/auth-actions";

export default async function MyPage() {
  const user = await getUser();

  if (!user) {
    // User not authenticated
    return <div>Please login</div>;
  }

  return <div>Welcome {user.email}</div>;
}
```

### Get Current User (Client Component)

```typescript
"use client";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function MyComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return <div>{user?.email}</div>;
}
```

### Sign Out

```typescript
"use client";
import { supabase } from "@/utils/supabase/client";

const handleSignOut = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};
```

## 🔄 Authentication Flow

### Registration Flow

1. User fills signup form at `/signup`
2. Form submits to `signup()` server action
3. Supabase sends confirmation email
4. User clicks email link → redirected to `/auth/confirm`
5. Account confirmed → redirected to `/login`

### Login Flow

1. User enters credentials at `/login`
2. Client-side validation and submission
3. Supabase authenticates user
4. Session created with secure cookies
5. Redirected to dashboard or intended page

### OAuth Flow

1. User clicks "Continue with Google"
2. Redirected to Google for authentication
3. Google redirects to `/auth/callback`
4. Session created and user redirected to dashboard

## 🛡️ Security Features

- ✅ Server-side session validation
- ✅ HTTP-only cookies for session tokens
- ✅ Automatic CSRF protection
- ✅ Secure password hashing (handled by Supabase)
- ✅ Rate limiting (handled by Supabase)
- ✅ Email verification option

## 📝 Next Steps

1. **Customize Email Templates**: Go to Supabase Dashboard → Authentication → Email Templates
2. **Add Password Reset**: Implement forgot password flow
3. **Add Profile Page**: Let users update their information
4. **Add Role-Based Access**: Create admin/user roles in Supabase
5. **Add Social Providers**: Add more OAuth providers (GitHub, Facebook, etc.)

## 🐛 Troubleshooting

### "Invalid login credentials"

- Verify email/password are correct
- Check if email is confirmed (if email confirmation is enabled)

### Google Sign-In Not Working

- Verify Google OAuth is enabled in Supabase
- Check redirect URLs are correctly configured
- Ensure environment variables are set

### Redirecting to Login on Protected Routes

- Clear browser cookies and try again
- Check if Supabase URL and key are correct
- Verify middleware.ts is in the root directory

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
