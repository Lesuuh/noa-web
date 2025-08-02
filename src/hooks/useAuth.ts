import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const login = async (loginEmail: string, loginPassword: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error login", error);
  }
};

export const createAccount = async (
  createAccountEmail: string,
  createAccountPassword: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      createAccountEmail,
      createAccountPassword
    );
    const user = userCredential.user;
    console.log(user);
    return user;
  } catch (error) {
    console.error("Error signing Up:", error);
  }
};
