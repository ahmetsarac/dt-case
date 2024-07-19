'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Courses = () => {
    const { data: session, status } = useSession();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            if (session?.accessToken) {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/courses`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });
                    setCourses(response.data);
                } catch (err) {
                    setError('Dersler getirilirken bir hata oluştu.');
                    console.error('Error fetching courses:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchCourses();
        } else if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [session, status]);

    const handleDelete = async (id: number) => {
        if (!session?.accessToken) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API}/courses/${id}`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });
            // @ts-ignore
            setCourses(courses.filter(course => course.id !== id));
        } catch (error) {
            console.error('Error deleting course:', error);
            setError('Ders silinirken bir hata oluştu.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Ders Listesi</h1>
            <button
                onClick={() => router.push('/dashboard/courses/add')}
                className="px-4 py-2 bg-green-500 text-white rounded mb-4"
            >
                Yeni Ders Ekle
            </button>
            {courses.length === 0 ? (
                <p>Henüz eklenmiş ders yok.</p>
            ) : (
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Ders Kodu</th>
                            <th className="px-4 py-2">Ders Adı</th>
                            <th className="px-4 py-2">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course: any) => (
                            <tr key={course.id}>
                                <td className="border px-4 py-2">{course.course_code}</td>
                                <td className="border px-4 py-2">{course.course_name}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => router.push(`/dashboard/courses/edit/${course.id}`)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Courses;
