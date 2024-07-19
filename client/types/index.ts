export interface Enrollment {
    course: {
        id: number;
        course_name: string;
    };
    grade: string | null;
}

export interface Student {
    id: number;
    name: string;
    user: {
        student_number: string;
    };
    enrollments: Enrollment[];
}
