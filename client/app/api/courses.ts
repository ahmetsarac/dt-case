import axios from 'axios';

export const fetchCourses = async (token: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/courses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
