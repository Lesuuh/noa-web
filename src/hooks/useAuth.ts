import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
  createAccountDetails: {
    email: string;
    password: string;
    name: string;
  },
  setError: UseFormSetError<any>
) => {
  try {
    const { email, password, name } = createAccountDetails;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 📝 Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(), // or use serverTimestamp()
    });

    return user;
  } catch (error: unknown) {
    console.error("Error signing up:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const err = error as { code: string };

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("email", {
            type: "manual",
            message: "Email already in use. Please log in instead.",
          });
          break;

        case "auth/invalid-email":
          setError("email", {
            type: "manual",
            message: "Invalid email address.",
          });
          break;

        case "auth/weak-password":
          setError("password", {
            type: "manual",
            message: "Password should be at least 6 characters.",
          });
          break;

        default:
          setError("root", {
            type: "server",
            message: "Account creation failed. Please try again later.",
          });
      }
    } else {
      setError("root", {
        type: "server",
        message: "Unexpected error occurred during sign up.",
      });
    }
  }
};
