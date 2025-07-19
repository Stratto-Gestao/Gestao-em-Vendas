import { useState, useEffect, useContext } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from '../contexts/AuthContextDef';

export const useMrRepresentacoes = () => {
  const { currentUser: user, userRole } = useContext(AuthContext);
  
  // Estados
  const [delegatedTasks, setDelegatedTasks] = useState([]);
  const [biddings, setBiddings] = useState([]);
  const [weekHistory, setWeekHistory] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [routineTasks, setRoutineTasks] = useState([]);
  const [wonBiddings, setWonBiddings] = useState([]);
  const [lostBiddings, setLostBiddings] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // === TAREFAS DELEGADAS ===
  
  // Carregar tarefas delegadas
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const tasksRef = collection(db, 'mr_delegated_tasks');
    const unsubscribe = onSnapshot(
      query(tasksRef, orderBy('createdAt', 'desc')),
      (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
          completedAt: doc.data().completedAt?.toDate?.()?.toISOString()
        }));
        setDelegatedTasks(tasks);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao carregar tarefas:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Adicionar nova tarefa delegada
  const addDelegatedTask = async (taskData) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    try {
      const docRef = await addDoc(collection(db, 'mr_delegated_tasks'), {
        ...taskData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        completed: false,
        problems: []
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      throw error;
    }
  };

  // Atualizar tarefa delegada
  const updateDelegatedTask = async (taskId, updates) => {
    try {
      const taskRef = doc(db, 'mr_delegated_tasks', taskId);
      
      // Remover campos que podem causar problemas e garantir que createdAt não seja sobrescrito
      const { createdAt, updatedAt, ...cleanUpdates } = updates;
      
      await updateDoc(taskRef, {
        ...cleanUpdates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  };

  // Concluir tarefa e adicionar ao histórico
  const completeDelegatedTask = async (taskId) => {
    try {
      const task = delegatedTasks.find(t => t.id === taskId);
      if (!task) return;

      // Criar objeto limpo para evitar problemas com timestamps
      const { createdAt, updatedAt, completedAt, ...cleanTask } = task;

      const completedTask = {
        ...cleanTask,
        completed: true,
        completedAt: serverTimestamp(),
        finishedAt: new Date().toLocaleString('pt-BR'),
        type: 'delegada',
        timeToComplete: task.createdAt ? 
          Math.round((new Date() - new Date(task.createdAt)) / (1000 * 60 * 60 * 24) * 10) / 10 : 0,
        createdAt: serverTimestamp() // Usar novo timestamp para histórico
      };

      // Só adicionar originalCreatedAt se ele existir e não for undefined
      if (createdAt && createdAt !== undefined) {
        completedTask.originalCreatedAt = createdAt;
      }

      // Atualizar tarefa
      await updateDelegatedTask(taskId, { 
        completed: true, 
        completedAt: serverTimestamp() 
      });

      // Adicionar ao histórico
      await addDoc(collection(db, 'mr_weekly_history'), completedTask);

    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
      throw error;
    }
  };

  // Reportar problema na tarefa
  const reportTaskProblem = async (taskId, problemDescription) => {
    try {
      const problem = {
        taskId,
        description: problemDescription,
        reportedAt: serverTimestamp(),
        reportedBy: user.uid,
        userId: user.uid
      };

      await addDoc(collection(db, 'mr_task_problems'), problem);
      
      // Atualizar array de problemas na tarefa
      const task = delegatedTasks.find(t => t.id === taskId);
      const updatedProblems = [...(task.problems || []), {
        id: Date.now(),
        description: problemDescription,
        reportedAt: new Date().toISOString(),
        reportedBy: user.displayName || 'Usuário'
      }];

      await updateDelegatedTask(taskId, { problems: updatedProblems });

    } catch (error) {
      console.error('Erro ao reportar problema:', error);
      throw error;
    }
  };

  // === LICITAÇÕES ===

  // Carregar licitações
  useEffect(() => {
    if (!user) return;

    const biddingsRef = collection(db, 'mr_biddings');
    const unsubscribe = onSnapshot(
      query(biddingsRef, orderBy('createdAt', 'desc')),
      (snapshot) => {
        const bids = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString()
        }));
        setBiddings(bids);
      },
      (error) => {
        console.error('Erro ao carregar licitações:', error);
        setError(error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Adicionar nova licitação
  const addBidding = async (biddingData) => {
    try {
      const docRef = await addDoc(collection(db, 'mr_biddings'), {
        ...biddingData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        progress: 10,
        status: 'active',
        documents: [
          { name: 'Proposta Comercial', status: 'pendente', required: true },
          { name: 'Proposta Técnica', status: 'pendente', required: true },
          { name: 'Documentação de Habilitação', status: 'pendente', required: true },
          { name: 'Certidões Negativas', status: 'pendente', required: true },
          { name: 'Atestados de Capacidade Técnica', status: 'pendente', required: false },
          { name: 'Declarações', status: 'pendente', required: false },
          { name: 'Garantia de Proposta', status: 'pendente', required: false },
          { name: 'Catálogo de Produtos', status: 'pendente', required: false }
        ],
        timeline: [
          { stage: 'Edital Publicado', date: new Date().toISOString().split('T')[0], status: 'completed' },
          { stage: 'Proposta Enviada', date: biddingData.openingDate, status: 'pending' },
          { stage: 'Habilitação', date: '', status: 'pending' },
          { stage: 'Análise de Propostas', date: '', status: 'pending' },
          { stage: 'Resultado Final', date: '', status: 'pending' }
        ]
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar licitação:', error);
      throw error;
    }
  };

  // Atualizar licitação
  const updateBidding = async (biddingId, updates) => {
    try {
      const biddingRef = doc(db, 'mr_biddings', biddingId);
      
      // Remover campos que podem causar problemas e garantir que createdAt não seja sobrescrito
      const { createdAt, updatedAt, ...cleanUpdates } = updates;
      
      await updateDoc(biddingRef, {
        ...cleanUpdates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar licitação:', error);
      throw error;
    }
  };

  // Marcar licitação como ganha
  const markBiddingAsWon = async (biddingId, wonReason = '') => {
    try {
      const bidding = biddings.find(b => b.id === biddingId);
      if (!bidding) return;

      // Criar objeto limpo para evitar problemas com timestamps
      const { createdAt, updatedAt, ...cleanBidding } = bidding;
      
      const wonBidding = {
        ...cleanBidding,
        status: 'won',
        wonReason,
        wonDate: serverTimestamp(),
        wonBy: user.uid,
        createdAt: serverTimestamp() // Usar novo timestamp para evitar conflitos
      };

      // Só adicionar originalCreatedAt se ele existir e não for undefined
      if (createdAt && createdAt !== undefined) {
        wonBidding.originalCreatedAt = createdAt;
      }

      // Mover para licitações ganhas
      await addDoc(collection(db, 'mr_won_biddings'), wonBidding);
      
      // Remover da lista ativa
      await deleteDoc(doc(db, 'mr_biddings', biddingId));

    } catch (error) {
      console.error('Erro ao marcar licitação como ganha:', error);
      throw error;
    }
  };

  // Marcar licitação como perdida
  const markBiddingAsLost = async (biddingId, lostReason) => {
    try {
      const bidding = biddings.find(b => b.id === biddingId);
      if (!bidding) return;

      // Criar objeto limpo para evitar problemas com timestamps
      const { createdAt, updatedAt, ...cleanBidding } = bidding;

      const lostBidding = {
        ...cleanBidding,
        status: 'lost',
        lostReason,
        lostDate: serverTimestamp(),
        lostBy: user.uid,
        createdAt: serverTimestamp() // Usar novo timestamp para evitar conflitos
      };

      // Só adicionar originalCreatedAt se ele existir e não for undefined
      if (createdAt && createdAt !== undefined) {
        lostBidding.originalCreatedAt = createdAt;
      }

      // Mover para licitações perdidas
      await addDoc(collection(db, 'mr_lost_biddings'), lostBidding);
      
      // Remover da lista ativa
      await deleteDoc(doc(db, 'mr_biddings', biddingId));

    } catch (error) {
      console.error('Erro ao marcar licitação como perdida:', error);
      throw error;
    }
  };

  // Excluir licitação
  const deleteBidding = async (biddingId) => {
    try {
      await deleteDoc(doc(db, 'mr_biddings', biddingId));
    } catch (error) {
      console.error('Erro ao excluir licitação:', error);
      throw error;
    }
  };

  // Atualizar status do documento
  const updateDocumentStatus = async (biddingId, documentName, newStatus) => {
    try {
      const bidding = biddings.find(b => b.id === biddingId);
      if (!bidding) return;

      let updatedDocuments = [...(bidding.documents || [])];
      const existingDocIndex = updatedDocuments.findIndex(doc => doc.name === documentName);

      if (existingDocIndex >= 0) {
        updatedDocuments[existingDocIndex] = { 
          ...updatedDocuments[existingDocIndex], 
          status: newStatus 
        };
      } else {
        updatedDocuments.push({
          name: documentName,
          status: newStatus,
          required: true
        });
      }

      const totalDocs = updatedDocuments.filter(d => d.required).length;
      const completedDocs = updatedDocuments.filter(d => d.required && d.status === 'enviado').length;
      const newProgress = Math.round((completedDocs / totalDocs) * 100);

      await updateBidding(biddingId, {
        documents: updatedDocuments,
        progress: newProgress
      });

    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw error;
    }
  };

  // === PROPOSTAS ===

  // Carregar propostas
  useEffect(() => {
    if (!user) return;

    const proposalsRef = collection(db, 'mr_proposals');
    const unsubscribe = onSnapshot(
      query(proposalsRef, orderBy('createdAt', 'desc')),
      (snapshot) => {
        const props = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString()
        }));
        setProposals(props);
      },
      (error) => {
        console.error('Erro ao carregar propostas:', error);
        setError(error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Adicionar nova proposta
  const addProposal = async (proposalData) => {
    try {
      const docRef = await addDoc(collection(db, 'mr_proposals'), {
        ...proposalData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        completed: false
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar proposta:', error);
      throw error;
    }
  };

  // Atualizar proposta
  const updateProposal = async (proposalId, updates) => {
    try {
      const proposalRef = doc(db, 'mr_proposals', proposalId);
      
      // Remover campos que podem causar problemas e garantir que createdAt não seja sobrescrito
      const { createdAt, updatedAt, ...cleanUpdates } = updates;
      
      await updateDoc(proposalRef, {
        ...cleanUpdates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error);
      throw error;
    }
  };

  // Concluir proposta
  const completeProposal = async (proposalId) => {
    try {
      const proposal = proposals.find(p => p.id === proposalId);
      if (!proposal) return;

      // Criar objeto limpo para evitar problemas com timestamps
      const { createdAt, updatedAt, completedAt, ...cleanProposal } = proposal;

      const completedProposal = {
        ...cleanProposal,
        completed: true,
        completedAt: serverTimestamp(),
        finishedAt: new Date().toLocaleString('pt-BR'),
        type: 'proposta',
        timeToComplete: proposal.createdAt ? 
          Math.round((new Date() - new Date(proposal.createdAt)) / (1000 * 60 * 60 * 24) * 10) / 10 : 0,
        createdAt: serverTimestamp() // Usar novo timestamp para histórico
      };

      // Só adicionar originalCreatedAt se ele existir e não for undefined
      if (createdAt && createdAt !== undefined) {
        completedProposal.originalCreatedAt = createdAt;
      }

      // Atualizar proposta
      await updateProposal(proposalId, { 
        completed: true, 
        completedAt: serverTimestamp() 
      });

      // Adicionar ao histórico
      await addDoc(collection(db, 'mr_weekly_history'), completedProposal);

    } catch (error) {
      console.error('Erro ao concluir proposta:', error);
      throw error;
    }
  };

  // === HISTÓRICO SEMANAL ===

  // Carregar histórico semanal
  useEffect(() => {
    if (!user) return;

    const historyRef = collection(db, 'mr_weekly_history');
    const unsubscribe = onSnapshot(
      query(historyRef, orderBy('finishedAt', 'desc')),
      (snapshot) => {
        const history = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          finishedAt: doc.data().finishedAt?.toDate?.()?.toLocaleString?.('pt-BR') || doc.data().finishedAt
        }));
        setWeekHistory(history);
      },
      (error) => {
        console.error('Erro ao carregar histórico:', error);
        setError(error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Arquivar todas as tarefas concluídas (função para "Concluir dia")
  const archiveCompletedTasks = async () => {
    try {
      const completedDelegatedTasks = delegatedTasks.filter(t => t.completed);
      const completedProposals = proposals.filter(p => p.completed);
      
      // Criar array de promessas para adicionar ao histórico
      const historyPromises = [];
      
      // Processar tarefas delegadas concluídas
      completedDelegatedTasks.forEach(task => {
        if (!weekHistory.find(h => h.id === task.id)) { // Evitar duplicatas
          // Criar objeto limpo para evitar problemas com timestamps
          const { createdAt, updatedAt, completedAt, ...cleanTask } = task;
          
          const historyTask = {
            ...cleanTask,
            type: 'delegada',
            finishedAt: task.finishedAt || new Date().toLocaleString('pt-BR'),
            timeToComplete: task.createdAt ? 
              Math.round((new Date() - new Date(task.createdAt)) / (1000 * 60 * 60 * 24) * 10) / 10 : 0,
            createdAt: serverTimestamp() // Usar novo timestamp para histórico
          };

          // Só adicionar originalCreatedAt se ele existir e não for undefined
          if (createdAt && createdAt !== undefined) {
            historyTask.originalCreatedAt = createdAt;
          }
          
          historyPromises.push(
            addDoc(collection(db, 'mr_weekly_history'), historyTask)
          );
        }
      });
      
      // Processar propostas concluídas
      completedProposals.forEach(proposal => {
        if (!weekHistory.find(h => h.id === proposal.id)) { // Evitar duplicatas
          // Criar objeto limpo para evitar problemas com timestamps
          const { createdAt, updatedAt, completedAt, ...cleanProposal } = proposal;
          
          const historyProposal = {
            ...cleanProposal,
            type: 'proposta',
            finishedAt: proposal.finishedAt || new Date().toLocaleString('pt-BR'),
            timeToComplete: proposal.createdAt ? 
              Math.round((new Date() - new Date(proposal.createdAt)) / (1000 * 60 * 60 * 24) * 10) / 10 : 0,
            createdAt: serverTimestamp() // Usar novo timestamp para histórico
          };

          // Só adicionar originalCreatedAt se ele existir e não for undefined
          if (createdAt && createdAt !== undefined) {
            historyProposal.originalCreatedAt = createdAt;
          }
          
          historyPromises.push(
            addDoc(collection(db, 'mr_weekly_history'), historyProposal)
          );
        }
      });
      
      // Executar todas as operações de histórico
      await Promise.all(historyPromises);
      
      // Remover tarefas concluídas das listas ativas
      const deletePromises = [];
      
      completedDelegatedTasks.forEach(task => {
        deletePromises.push(deleteDoc(doc(db, 'mr_delegated_tasks', task.id)));
      });
      
      completedProposals.forEach(proposal => {
        deletePromises.push(deleteDoc(doc(db, 'mr_proposals', proposal.id)));
      });
      
      // Executar todas as operações de exclusão
      await Promise.all(deletePromises);
      
    } catch (error) {
      console.error('Erro ao arquivar tarefas concluídas:', error);
      throw error;
    }
  };

  // Limpar histórico semanal
  const clearWeeklyHistory = async () => {
    try {
      const historyRef = collection(db, 'mr_weekly_history');
      const snapshot = await getDocs(historyRef);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      throw error;
    }
  };

  // === LICITAÇÕES GANHAS E PERDIDAS ===

  // Carregar licitações ganhas
  useEffect(() => {
    if (!user) return;

    const wonBiddingsRef = collection(db, 'mr_won_biddings');
    const unsubscribe = onSnapshot(
      query(wonBiddingsRef, orderBy('wonDate', 'desc')),
      (snapshot) => {
        const won = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          wonDate: doc.data().wonDate?.toDate?.()?.toISOString()
        }));
        setWonBiddings(won);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Carregar licitações perdidas
  useEffect(() => {
    if (!user) return;

    const lostBiddingsRef = collection(db, 'mr_lost_biddings');
    const unsubscribe = onSnapshot(
      query(lostBiddingsRef, orderBy('lostDate', 'desc')),
      (snapshot) => {
        const lost = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lostDate: doc.data().lostDate?.toDate?.()?.toISOString()
        }));
        setLostBiddings(lost);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return {
    // Estados
    delegatedTasks,
    biddings,
    weekHistory,
    proposals,
    routineTasks,
    wonBiddings,
    lostBiddings,
    loading,
    error,

    // Funções de Tarefas Delegadas
    addDelegatedTask,
    updateDelegatedTask,
    completeDelegatedTask,
    reportTaskProblem,

    // Funções de Propostas
    addProposal,
    updateProposal,
    completeProposal,

    // Funções de Licitações
    addBidding,
    updateBidding,
    markBiddingAsWon,
    markBiddingAsLost,
    deleteBidding,
    updateDocumentStatus,

    // Funções de Histórico
    archiveCompletedTasks,
    clearWeeklyHistory
  };
};

export default useMrRepresentacoes;
