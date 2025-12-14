import { NextResponse } from "next/server";

// 🔥 Success / Error Response Handler
export const response = (
  success: boolean,
  statusCode: number,
  message: string,
  data: any = {}
) => {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      data,
    },
    { status: statusCode }
  );
};

// 🔥 Global Error Handler
export const catchError = (error: any) => {
  console.error("SERVER ERROR:", error);

  return NextResponse.json(
    {
      success: false,
      statusCode: 500,
      message: error?.message || "Internal Server Error",
    },
    { status: 500 }
  );
};
