'use client';

import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AddCourse = () => {
    const { data: session } = useSession();
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        if (!session?.accessToken) return;

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API}/courses`,
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
            console.error('Ders eklenirken hata oluştu:', error);
            setError('Ders eklenirken hata oluştu');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Ders Ekle</h1>
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
                Dersi Kaydet
            </button>
        </div>
    );
};

export default AddCourse;
