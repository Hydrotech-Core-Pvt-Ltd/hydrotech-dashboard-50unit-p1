import { useEffect, useState } from "react";
import { ref as dbRef, onValue } from "firebase/database";
import { realtimeDb } from "../config/firebase";

export default function useUser(uid) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setUser(null);
      setLoading(false);
      return;
    }

    const userRef = dbRef(realtimeDb, `users/${uid}`);
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setUser({ uid: snapshot.key, ...snapshot.val() });
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching user:", error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  return { user, loading, error };
}
