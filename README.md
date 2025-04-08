# Basic Social App

A simple social media application built with Next.js, Prisma, and NextAuth.js. Users can create posts, like them, and add comments.

## Features

- 👤 User authentication
- ✍️ Create posts
- ❤️ Like posts
- 💬 Comment on posts
- 💻 Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd basic-social-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables by creating a `.env.local` file in the root directory:
```
NEXTAUTH_SECRET=your-super-secret-key-at-least-32-chars
NEXTAUTH_URL=http://localhost:3000
```

4. Initialize and generate the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Create an account or log in
2. Create new posts from the "Create Post" button
3. Like and comment on posts
4. View your and others' posts on the home page

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [SQLite](https://www.sqlite.org/) - Database

## Development

To run tests:
```bash
npm run test
```

To lint your code:
```bash
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
