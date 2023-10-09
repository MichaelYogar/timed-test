import { JwtPayload, verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const AUTH_CHECK = "/api/check";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("asdf");

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { value } = token;
  const secret = process.env.JWT_SECRET || "";

  try {
    const res = verify(value, secret) as JwtPayload;

    const response = {
      user: res.username,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Bad request",
      },
      {
        status: 400,
      }
    );
  }
}
