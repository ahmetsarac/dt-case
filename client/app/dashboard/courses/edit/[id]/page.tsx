'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

const EditCourse = () => {
    const { data: session } = useSession();
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        const fetchCourse = async () => {
            if (!session?.accessToken) return;

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/courses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });
                const course = response.data;
                setCourseCode(course.course_code);
                setCourseName(course.course_name);
            } catch (error) {
                console.error('Ders getirilirken hata oluştu:', error);
                setError('Ders getirilirken hata oluştu');
            }
        };

        if (id) fetchCourse();
    }, [id, session]);

    const handleSubmit = async () => {
        if (!session?.accessToken) return;

        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API}/courses/${id}`,
                {
                    course_code: courseCode,
                    course_name: courseName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                },
            );
            router.push('/dashboard/courses');
        } catch (error) {
            console.error('Ders güncellenirken hata oluştu:', error);
            setError('Ders güncellenirken hata oluştu');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Ders Düzenle</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block mb-1">Ders Kodu</label>
                <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Ders Adı</label>
                <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
            >
                Dersi Güncelle
            </button>
        </div>
    );
};

export default EditCourse;
