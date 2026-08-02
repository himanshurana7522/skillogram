import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "nexus@skillogram.io" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await dbConnect();
        const existingUser = await User.findOne({ email: credentials.email });

        // If action is signup
        if (credentials.action === 'signup') {
           if (existingUser) {
             throw new Error("User already exists with this email.");
           }
           const hashedPassword = await bcrypt.hash(credentials.password, 12);
           const username = credentials.email.split('@')[0] + Math.floor(Math.random() * 1000);
           const user = await User.create({
             email: credentials.email,
             password: hashedPassword,
             name: credentials.email.split('@')[0],
             username: username,
             initials: credentials.email.charAt(0).toUpperCase()
           });
           return { id: user._id.toString(), name: user.name, email: user.email, image: user.username };
        }

        // Action is login
        if (!existingUser) {
          throw new Error("No user found with this email.");
        }
        
        const isValid = await bcrypt.compare(credentials.password, existingUser.password);
        if (!isValid) {
          throw new Error("Invalid password.");
        }

        return { id: existingUser._id.toString(), name: existingUser.name, email: existingUser.email, image: existingUser.username };
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === 'google') {
        if (!user.email) return false;
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const username = user.email.split('@')[0] + Math.floor(Math.random() * 10000);
            await User.create({
              email: user.email,
              name: user.name || user.email.split('@')[0],
              username: username,
              initials: user.name?.[0]?.toUpperCase() || user.email.charAt(0).toUpperCase(),
              avatarUrl: user.image
            });
          }
          return true;
        } catch (error) {
          console.error("Error during Google sign-in user creation:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      // 'user' is only present on initial sign-in
      if (user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.username = dbUser.username;
        } else {
          token.id = user.id;
          token.username = user.image; // fallback
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        session.user.image = token.username as string; // Storing username in image field
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
