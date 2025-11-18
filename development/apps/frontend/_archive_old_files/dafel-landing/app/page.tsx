import { redirect } from 'next/navigation';

// Redirect from root to /new landing
export default function HomePage() {
  redirect('/new');
}