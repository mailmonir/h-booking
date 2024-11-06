import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { github } from "@/lib/server/oauth";
import { cookies } from "next/headers";
import type { OAuth2Tokens } from "arctic";
import prisma from "@/lib/prisma";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null;
  if (code === null || state === null || storedState === null) {
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch (e) {
    console.log(e);
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const githubUser = await githubUserResponse.json();
  const githubUserId = githubUser.id;
  const githubUsername = githubUser.login;

  // TODO: Replace this with your own DB query.
  const existingUser = await prisma.user.findFirst({
    where: {
      providerUserId: githubUser.githubUserId,
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
        providerId: "github",
        providerUserId: githubUserId.toString(),
        name: githubUsername,
        avatarUrl: [githubUser.avatar_url],
      },
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin",
      },
    });
  }

  // TODO: Replace this with your own DB query.
  const user = await prisma.user.create({
    data: {
      providerId: "github",
      providerUserId: githubUserId.toString(),
      name: githubUsername,
      email: githubUser.email,
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
