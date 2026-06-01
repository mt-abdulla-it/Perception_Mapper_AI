import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete("pm_admin_session_token");
  
  // also clean standard signed in cookie
  cookieStore.set("pm_mock_signed_in", "", {
    path: "/",
    expires: new Date(0)
  });

  return NextResponse.json({ success: true });
}
