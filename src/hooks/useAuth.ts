import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { UseFormSetError } from "react-hook-form";

export const login = async (
  loginDetails: { email: string; password: string },
  setError: UseFormSetError<any>
) => {
  try {
    const { email, password } = loginDetails;
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: unknown) {
    console.error("Login error:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const err = error as { code: string };

      switch (err.code) {
        case "auth/user-not-found":
          setError("email", {
            type: "manual",
            message: "No account found with this email",
          });
          break;

        case "auth/wrong-password":
        case "auth/invalid-email":
        case "auth/invalid-credential":
          setError("password", {
            type: "manual",
            message: "Incorrect email or password",
          });
          break;

        default:
          setError("root", {
            type: "server",
            message: "Login failed, please try again later",
          });
      }
    } else {
      setError("root", {
        type: "server",
        message: "Unexpected error. Please try again.",
      });
    }

    return null;
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
    return userCredential.user;
  } catch (error: unknown) {
    console.error("Error signing up:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const err = error as { code: string };

      switch (err.code) {
        case "auth/email-already-in-use":
          throw new Error("Email already in use. Please log in instead.");
        case "auth/invalid-email":
          throw new Error("Invalid email address.");
        case "auth/weak-password":
          throw new Error("Password should be at least 6 characters.");
        default:
          throw new Error("Account creation failed. Please try again later.");
      }
    } else {
      throw new Error("Unexpected error occurred during sign up.");
    }
  }
};
