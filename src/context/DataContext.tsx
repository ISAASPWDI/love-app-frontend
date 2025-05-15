import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Interfaces
export interface Note {
  id?: number;
  content: string;
  created_at?: string | Date;
}

export interface Memory {
  id?: number;
  image_url: string;
  caption?: string;
  created_at?: string | Date;
}

export interface TimelineEvent {
  id?: number;
  title: string;
  description?: string;
  event_date: Date | string;
  created_at?: Date;
}
export interface Compliment {
  id?: number;
  content: string;
  is_favorite?: boolean;
  created_at?: Date;
}
export interface QuizQuestion {
  id?: number;
  question: string;
  answer: string;
  created_at?: Date;
}

// Quiz Result Interface
export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: {
    questionId: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}
// Definimos la interfaz para el contexto
interface DataContextType {
  // Notes
  notes: Note[];
  addNote: (text: string) => Promise<void>;
  updateNote: (id: string, text: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  refreshNotes: () => Promise<void>;
  
  // Memories
  memories: Memory[];
  addMemory: (imageUrl: string, caption: string) => Promise<void>;
  updateMemory: (id: string, image_url: string, caption: string) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  refreshMemories: () => Promise<void>;
  
  // Timeline
  timelineEvents: TimelineEvent[];
  addTimelineEvent: (title: string, description: string, event_date: string) => Promise<void>;
  updateTimelineEvent: (id: string, title: string, description: string, event_date: string) => Promise<void>;
  deleteTimelineEvent: (id: string) => Promise<void>;
  refreshTimelineEvents: () => Promise<void>;
  
  // Compliments
  compliments: Compliment[];
  addCompliment: (content: string, is_favorite: boolean) => Promise<void>;
  updateCompliment: (id: string, content: string, is_favorite: boolean) => Promise<void>;
  deleteCompliment: (id: string) => Promise<void>;
  refreshCompliments: () => Promise<void>;

  // Quiz
  quizQuestions: QuizQuestion[];
  addQuizQuestion: (question: string, answer: string) => Promise<void>;
  updateQuizQuestion: (id: number, question: string, answer: string) => Promise<void>;
  deleteQuizQuestion: (id: number) => Promise<void>;
  refreshQuizQuestions: () => Promise<void>;
  evaluateQuizAnswers: (answers: {
    questionId: number;
    userAnswer: string;
    question: string;
    correctAnswer: string;
  }[]) => Promise<QuizResult>;

  // Estado compartido
  loading: boolean;
  error: string | null;
}

// Creamos el contexto con un valor inicial
const DataContext = createContext<DataContextType | undefined>(undefined);

// URLs base para conectar con el backend
const NOTES_API_URL = 'https://love-app-backend-kq3d.onrender.com/api/notes';
const MEMORIES_API_URL = 'https://love-app-backend-kq3d.onrender.com/api/memories';
const TIMELINE_API_URL = 'https://love-app-backend-kq3d.onrender.com/api/timeline';
const COMPLIMENTS_API_URL = 'https://love-app-backend-kq3d.onrender.com/api/compliments';
const QUIZ_API_URL = 'https://love-app-backend-kq3d.onrender.com/api/quiz';

// Props para el proveedor de contexto
interface DataProviderProps {
  children: ReactNode;
}

// Componente proveedor del contexto
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Estado para notes
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Estado para memories
  const [memories, setMemories] = useState<Memory[]>([]);
  
  // Estado para timeline events
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  
  // Estado para compliments
  const [compliments, setCompliments] = useState<Compliment[]>([])

  // Estado para quiz
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Estado compartido
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al iniciar
  useEffect(() => {
    Promise.all([refreshNotes(), refreshMemories(), refreshTimelineEvents(), refreshCompliments(), refreshQuizQuestions])
      .finally(() => setLoading(false));
  }, []);

  // === Notes functions ===
  const refreshNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(NOTES_API_URL);
      setNotes(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading notes:', err);
      setError('Failed to load notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (content: string) => {
    try {
      setLoading(true);
      const response = await axios.post(NOTES_API_URL, { content });
      await refreshNotes();
      return response.data;
    } catch (err) {
      console.error('Error adding note:', err);
      setError('Failed to add note. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (id: string, content: string) => {
    try {
      setLoading(true);
      await axios.put(`${NOTES_API_URL}/${id}`, { content });
      await refreshNotes();
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update note. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${NOTES_API_URL}/${id}`);
      await refreshNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === Memories functions ===
  const refreshMemories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(MEMORIES_API_URL);
      setMemories(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading memories:', err);
      setError('Failed to load memories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addMemory = async (image_url: string, caption: string) => {
    try {
      setLoading(true);
      await axios.post(MEMORIES_API_URL, { image_url, caption });
      await refreshMemories();
    } catch (err) {
      console.error('Error adding memory:', err);
      setError('Failed to add memory. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMemory = async (id: string, image_url: string, caption: string) => {
    try {
      setLoading(true);
      await axios.put(`${MEMORIES_API_URL}/${id}`, { image_url, caption });
      await refreshMemories();
    } catch (err) {
      console.error('Error updating memory:', err);
      setError('Failed to update memory. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${MEMORIES_API_URL}/${id}`);
      await refreshMemories();
    } catch (err) {
      console.error('Error deleting memory:', err);
      setError('Failed to delete memory. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === Timeline functions ===
  const refreshTimelineEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(TIMELINE_API_URL);
      setTimelineEvents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading timeline events:', err);
      setError('Failed to load timeline events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addTimelineEvent = async (title: string, description: string, event_date: string) => {
    try {
      setLoading(true);
      await axios.post(TIMELINE_API_URL, { title, description, event_date });
      await refreshTimelineEvents();
    } catch (err) {
      console.error('Error adding timeline event:', err);
      setError('Failed to add timeline event. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTimelineEvent = async (id: string, title: string, description: string, event_date: string) => {
    try {
      setLoading(true);
      await axios.put(`${TIMELINE_API_URL}/${id}`, { title, description, event_date });
      await refreshTimelineEvents();
    } catch (err) {
      console.error('Error updating timeline event:', err);
      setError('Failed to update timeline event. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTimelineEvent = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${TIMELINE_API_URL}/${id}`);
      await refreshTimelineEvents();
    } catch (err) {
      console.error('Error deleting timeline event:', err);
      setError('Failed to delete timeline event. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshCompliments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(COMPLIMENTS_API_URL);
      setCompliments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading notes:', err);
      setError('Failed to load notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addCompliment = async (content: string, is_favorite: boolean) => {
    try {
      setLoading(true);
      await axios.post(COMPLIMENTS_API_URL, { content, is_favorite });
      await refreshCompliments();
    } catch (err) {
      console.error('Error adding timeline event:', err);
      setError('Failed to add timeline event. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCompliment = async (id: string, content: string, is_favorite: boolean) => {
    try {
      setLoading(true);
      await axios.put(`${COMPLIMENTS_API_URL}/${id}`, { content, is_favorite });
      await refreshCompliments();
    } catch (err) {
      console.error('Error updating timeline event:', err);
      setError('Failed to update timeline event. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCompliment = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${COMPLIMENTS_API_URL}/${id}`);
      await refreshTimelineEvents();
    } catch (err) {
      console.error('Error deleting timeline event:', err);
      setError('Failed to delete timeline event. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // === Quiz functions ===
  const refreshQuizQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(QUIZ_API_URL);
      setQuizQuestions(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading quiz questions:', err);
      setError('Failed to load quiz questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addQuizQuestion = async (question: string, answer: string) => {
    try {
      setLoading(true);
      const response = await axios.post(QUIZ_API_URL, { question, answer });
      await refreshQuizQuestions();
      return response.data;
    } catch (err) {
      console.error('Error adding quiz question:', err);
      setError('Failed to add quiz question. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuizQuestion = async (id: number, question: string, answer: string) => {
    try {
      setLoading(true);
      await axios.put(`${QUIZ_API_URL}/${id}`, { question, answer });
      await refreshQuizQuestions();
    } catch (err) {
      console.error('Error updating quiz question:', err);
      setError('Failed to update quiz question. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuizQuestion = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`${QUIZ_API_URL}/${id}`);
      await refreshQuizQuestions();
    } catch (err) {
      console.error('Error deleting quiz question:', err);
      setError('Failed to delete quiz question. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const evaluateQuizAnswers = async (answers: {
    questionId: number;
    userAnswer: string;
    question: string;
    correctAnswer: string;
  }[]) => {
    try {
      setLoading(true);
      const response = await axios.post(`${QUIZ_API_URL}/evaluate`, { answers });
      return response.data as QuizResult;
    } catch (err) {
      console.error('Error evaluating quiz answers:', err);
      setError('Failed to evaluate quiz answers. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Proveemos el contexto
  return (
    <DataContext.Provider
      value={{
        // Notes
        notes,
        addNote,
        updateNote,
        deleteNote,
        refreshNotes,
        
        // Memories
        memories,
        addMemory,
        updateMemory,
        deleteMemory,
        refreshMemories,
        
        // Timeline
        timelineEvents,
        addTimelineEvent,
        updateTimelineEvent,
        deleteTimelineEvent,
        refreshTimelineEvents,
        
        // Compliment
        compliments,
        addCompliment,
        updateCompliment,
        deleteCompliment,
        refreshCompliments,

        // Quiz
        quizQuestions,
        addQuizQuestion,
        updateQuizQuestion,
        deleteQuizQuestion,
        refreshQuizQuestions,
        evaluateQuizAnswers,

        // Estado compartido
        loading,
        error
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Hook para usar el contexto
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;