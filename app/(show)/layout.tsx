import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session) {
    return redirect("/api/auth/signin");
  }

  return (
    <html lang="en">
      <body>
        {children}
        {/* {session === undefined ? "Loading..." : session ? {children} : "Please sign in to view this page"} */}
      </body>
    </html>
  );
}
