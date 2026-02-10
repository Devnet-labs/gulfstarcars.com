'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        // Explicitly extract credentials to ensure they are strings
        const credentials = Object.fromEntries(formData);
        console.log('Authenticating user:', credentials.email);

        await signIn('credentials', {
            email: credentials.email,
            password: credentials.password,
            redirect: true,
            redirectTo: '/admin',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            console.error('AuthError type:', error.type);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid email or password.';
                default:
                    return 'Authentication failed. Please try again.';
            }
        }

        // Next.js redirection works by throwing a specific error. 
        // We must re-throw it so Next.js can handle the redirect.
        throw error;
    }
}
