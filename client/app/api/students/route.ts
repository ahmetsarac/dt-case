import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const { name, studentNumber, courses } = await request.json();

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/students`, {
            name,
            studentNumber,
            courses,
        });
        console.log("response")
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.error();
    }
}
