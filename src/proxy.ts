import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STABLE_ID_COOKIE_NAME = "s_stableID";

const generateNewStableID = (): string => {
  return crypto.randomUUID();
};

const getCategories = (cookieValue: string) => {
  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue));

    if (Array.isArray(parsed.categories)) {
      return parsed.categories;
    }
    return [];
  } catch {
    return [];
  }
};

export default function proxy(request: NextRequest) {
  const ccCookie = request.cookies.get("cc_cookie");

  if (!ccCookie) {
    return NextResponse.next();
  }

  const categories = getCategories(ccCookie.value);

  if (!categories.includes("analytics")) {
    return NextResponse.next();
  }

  const stableID =
    request.cookies.get(STABLE_ID_COOKIE_NAME)?.value ?? generateNewStableID();
  const response = NextResponse.next();

  response.cookies.set({
    name: STABLE_ID_COOKIE_NAME,
    value: stableID,
  });

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
      locale: false,
      has: [{ type: "cookie", key: "cc_cookie" }],
    },
  ],
};
