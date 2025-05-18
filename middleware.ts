import { NextResponse } from "next/server";

export function middleware(res: NextResponse) {
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Embedder-Policy", "same-origin");

  return res;
}
