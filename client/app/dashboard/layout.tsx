'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../globals.css';

interface Course {
    course_code: string;
    course_name: string;
    grade: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchStudentCourses = async () => {
            if (session?.user.role === 'student') {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/students/me/courses`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });
                    setCourses(response.data);
                } catch (error) {
                    console.error('Dersler getirilirken bir hata oluştu:', error);
                }
            }
        };

        if (status === 'authenticated') {
            fetchStudentCourses();
        } else if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [session, status]);

    if (!session) {
        return null; // veya yükleniyor gösterebilirsiniz
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="flex items-center justify-between p-4 bg-indigo-600 text-white">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <div>
                    {session && (
                        <>
                            <span className="mr-4">Hosgeldiniz {session.user.username}</span>
                            <button
                                onClick={() => signOut()}
                                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
                            >
                                Cikis Yap
                            </button>
                        </>
                    )}
                </div>
            </header>
            <main className="flex flex-1 p-4">
                {session.user.role === 'admin' ? (
                    <>
                        <nav className="w-1/4 p-4 bg-white rounded shadow-lg">
                            <ul className="space-y-4">
                                <li>
                                    <Link href="/dashboard/students" className={`block px-4 py-2 rounded ${pathname === '/dashboard/students' ? 'bg-gray-300 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
                                        Öğrenciler
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/courses" className={`block px-4 py-2 rounded ${pathname === '/dashboard/courses' ? 'bg-gray-300 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>
                                        Dersler
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="flex-1 p-4 ml-4 bg-white rounded shadow-lg">
                            {children}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 p-4 bg-white rounded shadow-lg">
                        <h2 className="text-xl mb-4">Aldığınız Dersler ve Notlar</h2>
                        <table className="w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Ders Kodu</th>
                                    <th className="px-4 py-2">Ders Adı</th>
                                    <th className="px-4 py-2">Not</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.course_code}>
                                        <td className="border px-4 py-2">{course.course_code}</td>
                                        <td className="border px-4 py-2">{course.course_name}</td>
                                        <td className="border px-4 py-2">{course.grade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
