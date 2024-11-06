import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { google } from "@/lib/server/oauth";
import { cookies } from "next/headers";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { globalGETRateLimit } from "@/lib/server/request";

import { decodeIdToken, type OAuth2Tokens } from "arctic";
import prisma from "@/lib/prisma";

export async function GET(request: Request): Promise<Response> {
  const cookiePromise = await cookies();
  if (!globalGETRateLimit()) {
    return new Response("Too many requests", {
      status: 429,
    });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookiePromise.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookiePromise.get("google_code_verifier")?.value ?? null;
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);

  const googleId = claimsParser.getString("sub");
  const name = claimsParser.getString("name");
  const picture = claimsParser.getString("picture");
  const email = claimsParser.getString("email");

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      session: true,
    },
  });

  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        providerUserId: googleId,
        providerId: "google",
        avatarUrl: [picture],
      },
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin",
      },
    });
  }

  const user = await prisma.user.create({
    data: {
      providerId: "google",
      providerUserId: googleId,
      email,
      name,
      avatarUrl: [picture],
    },
  });
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin",
    },
  });
}
