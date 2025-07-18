import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { onSnapshot, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export function useAdminStats() {
  const [stats, setStats] = useState({
    usuarios: 0,
    modulos: 0,
    artigos: 0,
    scripts: 0,
    coldCalls: 0,
    whatsAppScripts: 0,
    objecoes: 0,
    emailTemplates: 0,
    courses: 0,
    campanhas: 0,
    metasSemana: 0
  });

  useEffect(() => {
    const unsubscribes = [];

    // Monitorar estatísticas em tempo real
    const collections = [
      { name: 'users', key: 'usuarios' },
      { name: 'modules', key: 'modulos' },
      { name: 'articles', key: 'artigos' },
      { name: 'scripts', key: 'scripts' },
      { name: 'coldCalls', key: 'coldCalls' },
      { name: 'whatsappScripts', key: 'whatsAppScripts' },
      { name: 'objecoes', key: 'objecoes' },
      { name: 'emailTemplates', key: 'emailTemplates' },
      { name: 'courses', key: 'courses' }
    ];

    collections.forEach(({ name, key }) => {
      const unsubscribe = onSnapshot(collection(db, name), (snapshot) => {
        setStats(prev => ({
          ...prev,
          [key]: snapshot.size
        }));
      });
      unsubscribes.push(unsubscribe);
    });

    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  }, []);

  return stats;
}

export function useAdminData() {
  const [data, setData] = useState({
    allModules: [],
    allArticles: [],
    allScripts: [],
    allColdCalls: [],
    allWhatsAppScripts: [],
    allObjecoes: [],
    allEmailTemplates: [],
    allCourses: []
  });

  useEffect(() => {
    const unsubscribes = [];

    // Monitorar dados em tempo real
    const collections = [
      { name: 'modules', key: 'allModules' },
      { name: 'articles', key: 'allArticles' },
      { name: 'scripts', key: 'allScripts' },
      { name: 'coldCalls', key: 'allColdCalls' },
      { name: 'whatsappScripts', key: 'allWhatsAppScripts' },
      { name: 'objecoes', key: 'allObjecoes' },
      { name: 'emailTemplates', key: 'allEmailTemplates' },
      { name: 'courses', key: 'allCourses' }
    ];

    collections.forEach(({ name, key }) => {
      const unsubscribe = onSnapshot(collection(db, name), (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(prev => ({
          ...prev,
          [key]: items
        }));
      });
      unsubscribes.push(unsubscribe);
    });

    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  }, []);

  return data;
}

export function useModalState() {
  const [modalState, setModalState] = useState({
    addUser: false,
    addModule: false,
    addArticle: false,
    addScript: false,
    addColdCall: false,
    addWhatsAppScript: false,
    addObjecoes: false,
    addEmailTemplate: false,
    addCourse: false,
    addCampanha: false,
    addMetaSemana: false,
    manageUsers: false,
    manageModules: false,
    manageArticles: false,
    manageScripts: false,
    manageColdCall: false,
    manageWhatsAppScript: false,
    manageObjecoes: false,
    manageEmailTemplate: false,
    manageCourse: false,
    manageCampanha: false,
    manageMetaSemana: false
  });

  const openModal = (modalName) => {
    setModalState(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalState(prev => ({ ...prev, [modalName]: false }));
  };

  const closeAllModals = () => {
    setModalState(prev => {
      const newState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = false;
      });
      return newState;
    });
  };

  return { modalState, openModal, closeModal, closeAllModals };
}

export async function resetAllBusinessData(currentUser, userRole) {
  if (!currentUser || userRole !== 'SUPER_ADMIN') {
    throw new Error(`Apenas SUPER_ADMIN pode executar esta ação. Seu role atual: ${userRole || 'undefined'}`);
  }

  const colecoes = [
    'leads', 'negocios', 'modules', 'articles', 'scripts', 'coldCalls', 'whatsappScripts', 'objecoes', 'emailTemplates', 'courses'
  ];

  for (const col of colecoes) {
    const snap = await getDocs(collection(db, col));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, col, d.id));
    }
  }
}
