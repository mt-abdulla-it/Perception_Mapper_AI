import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const VALID_ADMINS = [
  { email: "admin1@perception.ai", password: "Admin@123", name: "Admin One" },
  { email: "admin2@perception.ai", password: "Admin@456", name: "Admin Two" }
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const adminUser = VALID_ADMINS.find(
      (admin) => admin.email === cleanEmail && admin.password === password
    );

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Set secure cookie to identify the administrative session
    const cookieStore = cookies();
    cookieStore.set("pm_admin_session_token", `secure-admin-token-${cleanEmail}-${Date.now()}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    // Also set the sync signed-in cookie for middleware alignment
    cookieStore.set("pm_mock_signed_in", "true", {
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    return NextResponse.json({
      success: true,
      user: {
        email: adminUser.email,
        role: "ADMIN",
        name: adminUser.name,
        adminSession: true
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
