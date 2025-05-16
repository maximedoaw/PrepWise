"use server"

import { auth, db } from "@/firebase/admin"
import { cookies } from "next/headers"

const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function SignUp(params : SignUpParams){
    const {uid, name, email} = params

    try {
        const userRecord = await db.collection('users').doc(uid).get()
        if(userRecord.exists){
            return {
                success : false,
                message : 'User already exists. Please sign in'
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })
    } catch (e : any) {
        if(e.code === 'auth/email-already-in-use'){
            return {
                success : false,
                error : 'Email already in use'
            }
        }

        return {
            success : false,
            message : 'Failed create account'
        }
    }


}

export async function SignIn(params: SignInParams) {
    const {email, idToken} = params

    try {
        const userRecord = await auth.getUserByEmail(email)

        if (!userRecord) {
            return {
                success : false,
                message : 'User not found'
            }
        }

        await setSessionCookie(idToken)

    } catch (e : any) {
        console.log(e);

        return {
            success : false,
            message : 'Failed to sign in'
        }
        
    }
}

export async function setSessionCookie(idToken : string){
    const cookieStore = await cookies()
    
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
   // const sessionCookie
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
  
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
  
      // get user info from db
      const userRecord = await db
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
      if (!userRecord.exists) return null;
  
      return {
        ...userRecord.data(),
        id: userRecord.id,
      } as User;
    } catch (error) {
      console.log(error);
  
      // Invalid or expired session
      return null;
    }
  }
  
export async function isAuthenticated() {
    const user = await getCurrentUser();
    
    return !!user;
  }