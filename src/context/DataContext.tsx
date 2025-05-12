import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our data
export interface Note {
  id: string;
  text: string;
  date: string;
}

export interface Memory {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface CountdownEvent {
  id: string;
  title: string;
  date: string;
}

export interface Compliment {
  id: string;
  text: string;
  favorite: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answer: string;
}

interface DataContextType {
  notes: Note[];
  addNote: (text: string) => void;
  updateNote: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
  
  memories: Memory[];
  addMemory: (imageUrl: string, caption: string) => void;
  updateMemory: (id: string, caption: string) => void;
  deleteMemory: (id: string) => void;
  
  timelineEvents: TimelineEvent[];
  addTimelineEvent: (title: string, description: string, date: string) => void;
  updateTimelineEvent: (id: string, title: string, description: string, date: string) => void;
  deleteTimelineEvent: (id: string) => void;
  
  countdownEvents: CountdownEvent[];
  addCountdownEvent: (title: string, date: string) => void;
  updateCountdownEvent: (id: string, title: string, date: string) => void;
  deleteCountdownEvent: (id: string) => void;
  
  compliments: Compliment[];
  addCompliment: (text: string) => void;
  toggleFavoriteCompliment: (id: string) => void;
  deleteCompliment: (id: string) => void;
  
  quizQuestions: QuizQuestion[];
  addQuizQuestion: (question: string, answer: string) => void;
  updateQuizQuestion: (id: string, question: string, answer: string) => void;
  deleteQuizQuestion: (id: string) => void;
}

// Default sample data
const defaultData = {
  notes: [
    { id: '1', text: 'You make my heart smile every day.', date: new Date().toISOString() },
    { id: '2', text: 'I love the way your eyes light up when you laugh.', date: new Date(Date.now() - 86400000).toISOString() }
  ],
  memories: [
    { 
      id: '1', 
      imageUrl: 'https://images.pexels.com/photos/5358/sea-beach-holiday-vacation.jpg?auto=compress&cs=tinysrgb&w=600',
      caption: 'Our first beach trip together', 
      date: new Date(Date.now() - 7776000000).toISOString() // 90 days ago
    },
    { 
      id: '2', 
      imageUrl: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=600',
      caption: 'That amazing dinner at our favorite restaurant',
      date: new Date(Date.now() - 2592000000).toISOString() // 30 days ago
    }
  ],
  timelineEvents: [
    { id: '1', title: 'First Date', description: 'The day we first met for coffee', date: '2023-02-14' },
    { id: '2', title: 'First Kiss', description: 'Under the stars at the park', date: '2023-03-01' }
  ],
  countdownEvents: [
    { id: '1', title: 'Our Anniversary', date: '2024-12-31' }
  ],
  compliments: [
    { id: '1', text: 'Your smile brightens my darkest days', favorite: true },
    { id: '2', text: 'You have the most beautiful soul', favorite: false },
    { id: '3', text: 'Your kindness inspires me to be better', favorite: false }
  ],
  quizQuestions: [
    { id: '1', question: 'What was the restaurant where we had our first date?', answer: 'The Coffee Shop' },
    { id: '2', question: 'What\'s my favorite color?', answer: 'Purple' }
  ]
};

// Create context with default values
const DataContext = createContext<DataContextType>({} as DataContextType);

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or use default data
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('love-notes');
    return savedNotes ? JSON.parse(savedNotes) : defaultData.notes;
  });
  
  const [memories, setMemories] = useState<Memory[]>(() => {
    const savedMemories = localStorage.getItem('love-memories');
    return savedMemories ? JSON.parse(savedMemories) : defaultData.memories;
  });
  
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() => {
    const savedEvents = localStorage.getItem('love-timeline');
    return savedEvents ? JSON.parse(savedEvents) : defaultData.timelineEvents;
  });
  
  const [countdownEvents, setCountdownEvents] = useState<CountdownEvent[]>(() => {
    const savedEvents = localStorage.getItem('love-countdown');
    return savedEvents ? JSON.parse(savedEvents) : defaultData.countdownEvents;
  });
  
  const [compliments, setCompliments] = useState<Compliment[]>(() => {
    const savedCompliments = localStorage.getItem('love-compliments');
    return savedCompliments ? JSON.parse(savedCompliments) : defaultData.compliments;
  });
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    const savedQuestions = localStorage.getItem('love-quiz');
    return savedQuestions ? JSON.parse(savedQuestions) : defaultData.quizQuestions;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('love-notes', JSON.stringify(notes));
  }, [notes]);
  
  useEffect(() => {
    localStorage.setItem('love-memories', JSON.stringify(memories));
  }, [memories]);
  
  useEffect(() => {
    localStorage.setItem('love-timeline', JSON.stringify(timelineEvents));
  }, [timelineEvents]);
  
  useEffect(() => {
    localStorage.setItem('love-countdown', JSON.stringify(countdownEvents));
  }, [countdownEvents]);
  
  useEffect(() => {
    localStorage.setItem('love-compliments', JSON.stringify(compliments));
  }, [compliments]);
  
  useEffect(() => {
    localStorage.setItem('love-quiz', JSON.stringify(quizQuestions));
  }, [quizQuestions]);

  // Notes CRUD operations
  const addNote = (text: string) => {
    const newNote = {
      id: Date.now().toString(),
      text,
      date: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id: string, text: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, text, date: new Date().toISOString() } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Memories CRUD operations
  const addMemory = (imageUrl: string, caption: string) => {
    const newMemory = {
      id: Date.now().toString(),
      imageUrl,
      caption,
      date: new Date().toISOString()
    };
    setMemories([newMemory, ...memories]);
  };

  const updateMemory = (id: string, caption: string) => {
    setMemories(memories.map(memory => 
      memory.id === id ? { ...memory, caption } : memory
    ));
  };

  const deleteMemory = (id: string) => {
    setMemories(memories.filter(memory => memory.id !== id));
  };

  // Timeline CRUD operations
  const addTimelineEvent = (title: string, description: string, date: string) => {
    const newEvent = {
      id: Date.now().toString(),
      title,
      description,
      date
    };
    setTimelineEvents([...timelineEvents, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const updateTimelineEvent = (id: string, title: string, description: string, date: string) => {
    setTimelineEvents(timelineEvents.map(event => 
      event.id === id ? { ...event, title, description, date } : event
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const deleteTimelineEvent = (id: string) => {
    setTimelineEvents(timelineEvents.filter(event => event.id !== id));
  };

  // Countdown CRUD operations
  const addCountdownEvent = (title: string, date: string) => {
    const newEvent = {
      id: Date.now().toString(),
      title,
      date
    };
    setCountdownEvents([...countdownEvents, newEvent]);
  };

  const updateCountdownEvent = (id: string, title: string, date: string) => {
    setCountdownEvents(countdownEvents.map(event => 
      event.id === id ? { ...event, title, date } : event
    ));
  };

  const deleteCountdownEvent = (id: string) => {
    setCountdownEvents(countdownEvents.filter(event => event.id !== id));
  };

  // Compliments CRUD operations
  const addCompliment = (text: string) => {
    const newCompliment = {
      id: Date.now().toString(),
      text,
      favorite: false
    };
    setCompliments([...compliments, newCompliment]);
  };

  const toggleFavoriteCompliment = (id: string) => {
    setCompliments(compliments.map(compliment => 
      compliment.id === id ? { ...compliment, favorite: !compliment.favorite } : compliment
    ));
  };

  const deleteCompliment = (id: string) => {
    setCompliments(compliments.filter(compliment => compliment.id !== id));
  };

  // Quiz CRUD operations
  const addQuizQuestion = (question: string, answer: string) => {
    const newQuestion = {
      id: Date.now().toString(),
      question,
      answer
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
  };

  const updateQuizQuestion = (id: string, question: string, answer: string) => {
    setQuizQuestions(quizQuestions.map(q => 
      q.id === id ? { ...q, question, answer } : q
    ));
  };

  const deleteQuizQuestion = (id: string) => {
    setQuizQuestions(quizQuestions.filter(q => q.id !== id));
  };

  return (
    <DataContext.Provider value={{
      notes, addNote, updateNote, deleteNote,
      memories, addMemory, updateMemory, deleteMemory,
      timelineEvents, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent,
      countdownEvents, addCountdownEvent, updateCountdownEvent, deleteCountdownEvent,
      compliments, addCompliment, toggleFavoriteCompliment, deleteCompliment,
      quizQuestions, addQuizQuestion, updateQuizQuestion, deleteQuizQuestion
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => useContext(DataContext);