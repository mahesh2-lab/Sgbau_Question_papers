import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { rollNumber, courseType, course, semester, resultType, session } =
    await req.json();

  const payload = {
    session: session,
    COURSETYPE: courseType,
    COURSECD: course,
    RESULTTYPE: resultType,
    p1: "ROLLNO",
    ROLLNO: rollNumber,
    SEMCODE: semester,
  };

  const response = await fetch("https://pdfprocess.onrender.com/result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return NextResponse.json(data);
};
