// import { db } from "@/firebase";
// import { collection, getDocs } from "firebase/firestore";

// type Question = {
//   id: string;
//   question: string;
//   options: string[];
//   correctAnswer: number;
// };

// export const fetchQuestions = async (): Promise<Question[]> => {
//   const querySnapShot = await getDocs(collection(db, "questions"));
//   return querySnapShot.docs.map((doc) => ({
//     id: doc.id,
//     ...(doc.data() as Omit<Question, "id">),
//   }));
// };
