import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

async function getFieldCount() {
  const docRef = doc(db, "users", "user123"); // 🔁 your path here
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    const fieldCount = Object.keys(data).length;
    console.log(`Field count: ${fieldCount}`);
    return fieldCount;
  } else {
    console.log("Document does not exist");
    return 0;
  }
}
