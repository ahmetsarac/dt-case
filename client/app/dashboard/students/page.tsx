'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Student } from '../../../types'; // Doğru yolu kullanarak import edin

const Students = () => {
    const { data: session, status } = useSession();
    const [students, setStudents] = useState<Student[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchStudents = async () => {
            if (session?.accessToken) {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/students`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });
                    setStudents(response.data);
                } catch (err) {
                    setError('Öğrenciler getirilirken bir hata oluştu.');
                    console.error('Error fetching students:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchStudents();
        } else if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [session, status]);

    const handleSearch = async () => {
        if (!session?.accessToken) return;

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/students/search`, {
                params: { query: searchQuery },
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });
            setStudents(response.data);
        } catch (err) {
            setError('Arama yapılırken bir hata oluştu.');
            console.error('Error searching students:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!session?.accessToken) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API}/students/${id}`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });
            setStudents(students.filter(student => student.id !== id));
        } catch (error) {
            console.error('Error deleting student:', error);
            setError('Öğrenci silinirken bir hata oluştu.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Öğrenci Listesi</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Arama yapın..."
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
                >
                    Ara
                </button>
            </div>
            <button
                onClick={() => router.push('/dashboard/students/add')}
                className="px-4 py-2 bg-green-500 text-white rounded mb-4"
            >
                Yeni Öğrenci Ekle
            </button>
            {students.length === 0 ? (
                <p>Henüz eklenmiş öğrenci yok.</p>
            ) : (
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Ad Soyad</th>
                            <th className="px-4 py-2">Öğrenci No</th>
                            <th className="px-4 py-2">Dersler</th>
                            <th className="px-4 py-2">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td className="border px-4 py-2">{student.name}</td>
                                <td className="border px-4 py-2">{student.user.student_number}</td>
                                <td className="border px-4 py-2">
                                    {student.enrollments.map((enrollment) => (
                                        <div key={enrollment.course.id}>
                                            {enrollment.course.course_name} - {enrollment.grade || 'N/A'}
                                        </div>
                                    ))}
                                </td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => router.push(`/dashboard/students/edit/${student.id}`)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student.id)}
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

export default Students;
