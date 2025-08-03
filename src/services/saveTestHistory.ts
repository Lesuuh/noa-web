import { doc, collection, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/firebase";

export const saveTestHistory = async (score, timeUsed) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const date = now.toLocaleDateString("en-US", options);
  //   const time = now.toLocaleTimeString("en-GB", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });

  const testHistoryRef = collection(db, "users", user.uid, "testHistory");

  await addDoc(testHistoryRef, {
    date,
    time: timeUsed,
    score: score,
    createdAt: Timestamp.fromDate(now), // for sorting
  });
};
