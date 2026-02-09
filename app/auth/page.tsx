import { redirect } from 'next/navigation';

type AuthPageProps = {
    searchParams: { mode?: string };
};

export default function AuthPage({ searchParams }: AuthPageProps) {
    // Handle mode parameter for backward compatibility
    if (searchParams.mode === 'register') {
        redirect('/auth/register');
    }

    // Default to login
    redirect('/auth/login');
}
