"use client";

import { useParams } from "next/navigation";

export default function StudentFolderModule() {
    const params = useParams();
    const studentId = Number(params.studentId);

    return <div>student id la : {studentId}</div>;
}
