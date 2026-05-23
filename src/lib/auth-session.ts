import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export const getAuthSession = () => getServerSession(authOptions);
