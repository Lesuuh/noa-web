import { auth, db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export const fetchTestHistory = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const testHistoryRef = collection(db, "users", user.uid, "testHistory");

  const q = query(testHistoryRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
