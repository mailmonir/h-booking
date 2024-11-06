// "use server";

// import { lucia, validateRequest } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import { cookies } from "next/headers";
// import { generateState, generateCodeVerifier } from "arctic";
// import { google } from "@/lib/auth";

// export async function signout() {
//   const { session } = await validateRequest();
//   if (!session) {
//     return {
//       error: "Unauthorized",
//     };
//   }

//   await lucia.invalidateSession(session.id);

//   const sessionCookie = lucia.createBlankSessionCookie();
//   cookies().set(
//     sessionCookie.name,
//     sessionCookie.value,
//     sessionCookie.attributes
//   );
//   return redirect("/signin");
// }

// export async function createGoogleAuthorizationURL() {
//   try {
//     const state = generateState();
//     const codeVerifier = generateCodeVerifier();

//     const url = await google.createAuthorizationURL(state, codeVerifier);

//     cookies().set("google_oauth_state", state, {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       sameSite: "strict",
//     });

//     cookies().set("code_verifier", codeVerifier, {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       sameSite: "strict",
//     });

//     // console.log(url);

//     // return Response.redirect(url);

//     return {
//       success: true,
//       data: url.toString(),
//     };
//   } catch (error: any) {
//     console.log(error);
//     return {
//       error: error?.message,
//     };
//   }
// }
