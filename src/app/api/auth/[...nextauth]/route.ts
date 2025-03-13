import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Fake user data (Replace this with DB validation)
        const user = { id: "1", name: "John Doe", email: credentials?.email || "" };

        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Email and Password are required!");
        }

        // Normally, you'd check a database here
        if (credentials.email !== "user@example.com" || credentials.password !== "password123") {
          throw new Error("Invalid credentials");
        }

        return user; // Return user object if authentication is successful
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
