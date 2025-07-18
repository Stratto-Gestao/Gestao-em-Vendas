import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useFirestoreCollection(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;

    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}

export function useFirestoreStats(collections = []) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (collections.length === 0) return;

    const unsubscribes = [];
    
    collections.forEach(collectionName => {
      const unsubscribe = onSnapshot(
        collection(db, collectionName),
        (snapshot) => {
          setStats(prev => ({
            ...prev,
            [collectionName]: snapshot.size
          }));
          setLoading(false);
        }
      );
      unsubscribes.push(unsubscribe);
    });

    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  }, [collections]);

  return { stats, loading };
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
