# Twitter-like feed with Next.js and Supabase

The following project implements a Twitter-like feed of posts using Next.js and Supabase (and Tailwind CSS for styling), with the following notable features:

- **Authentication with OAuth** using GitHub as provider
- **Route protection** for authenticated users using middleware
- **Real-time feed** using Supabase real-time listener to detect changes to posts or likes tables
- **"useOptimistic" React hook (experimental)** to make the likes feature more responsive
