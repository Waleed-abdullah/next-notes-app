import { getAuth, signInWithCustomToken } from 'firebase/auth';
export default async function signInWithToken({ token }) {
  const auth = getAuth();
  console.log(auth.currentUser);
  if (auth.currentUser) {
    return auth.currentUser;
  } else {
    try {
      const userCredentials = await signInWithCustomToken(auth, token);
      return userCredentials.user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
