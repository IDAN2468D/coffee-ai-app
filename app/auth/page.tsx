import { redirect } from 'next/navigation';

type AuthPageProps = {
    searchParams: Promise<{ mode?: string }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
    const { mode } = await searchParams;

    // Handle mode parameter for backward compatibility
    if (mode === 'register') {
        redirect('/auth/register');
    }

    // Default to login
    redirect('/auth/login');
}
