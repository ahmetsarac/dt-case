'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AddStudent = () => {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [password, setPassword] = useState('');
    const [courses, setCourses] = useState<{ courseId: number; courseName: string; grade?: string }[]>([]);
    const [allCourses, setAllCourses] = useState<{ id: number; course_code: string; course_name: string }[]>([]);
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
                    setAllCourses(response.data);
                } catch (error) {
                    console.error('Dersler getirilirken hata oluştu:', error);
                }
            }
        };

        fetchCourses();
    }, [session]);

    const handleAddCourse = () => {
        setCourses([...courses, { courseId: 0, courseName: '', grade: '' }]);
    };

    const handleRemoveCourse = (index: number) => {
        const newCourses = courses.filter((_, i) => i !== index);
        setCourses(newCourses);
    };

    const handleCourseChange = (index: number, field: string, value: string) => {
        const newCourses = courses.map((course, i) =>
            i === index ? { ...course, [field]: value } : course
        );
        setCourses(newCourses);
    };

    const handleCourseSelect = (index: number, value: string) => {
        const selectedCourse = allCourses.find(course => course.course_name === value);
        if (selectedCourse) {
            const newCourses = courses.map((courseItem, i) =>
                i === index ? { ...courseItem, courseId: selectedCourse.id, courseName: selectedCourse.course_name } : courseItem
            );
            setCourses(newCourses);
        }
    };

    const handleSubmit = async () => {
        if (!session?.accessToken) return;

        const user = {
            name,
            enrollment_year: new Date().getFullYear(),
            student_number: studentNumber,
            password,
            courses: courses.map(course => ({
                course_id: course.courseId,
                grade: course.grade || null, // Optional grade field
            })),
        }

        console.log(user)

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API}/students/`,
                {
                    ...user
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                },
            );
            router.push('/dashboard/students');
        } catch (error) {
            console.error('Öğrenci eklenirken hata oluştu:', error);
            setError('Öğrenci eklenirken hata oluştu');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Öğrenci Ekle</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block mb-1">Ad Soyad</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Öğrenci No</label>
                <input
                    type="text"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Şifre</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Dersler</label>
                {courses.map((course, index) => (
                    <div key={index} className="mb-2 flex items-center">
                        <select
                            value={course.courseName}
                            onChange={(e) => handleCourseSelect(index, e.target.value)}
                            className="mr-2 p-2 border border-gray-300 rounded"
                        >
                            <option value="">Ders Seç</option>
                            {allCourses.map((course) => (
                                <option key={course.id} value={course.course_name}>
                                    {course.course_name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Not"
                            value={course.grade}
                            onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
                            className="mr-2 p-2 border border-gray-300 rounded"
                        />
                        <button
                            onClick={() => handleRemoveCourse(index)}
                            className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                            Sil
                        </button>
                    </div>
                ))}
                <button
                    onClick={handleAddCourse}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Ders Ekle
                </button>
            </div>
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
            >
                Öğrenciyi Kaydet
            </button>
        </div>
    );
};

export default AddStudent;
