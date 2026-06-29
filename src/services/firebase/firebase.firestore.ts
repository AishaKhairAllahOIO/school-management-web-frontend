import { getFirestore } from "firebase/firestore";

import { firebaseApp } from "./firebase.app";

export const firestoreDb = getFirestore(firebaseApp);