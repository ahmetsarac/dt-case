'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/students');
    }, [router]);

    return null; // Yönlendirme yapıldığından dolayı bu sayfa boş döner.
}
