import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Notes from './pages/Notes';
import Memories from './pages/Memories';
import Timeline from './pages/Timeline';
import Countdown from './pages/Countdown';
import Compliments from './pages/Compliments';
import Quiz from './pages/Quiz';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-white flex">
        <Sidebar />
        <main className="flex-grow p-5 lg:px-8 lg:py-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Notes />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/countdown" element={<Countdown />} />
            <Route path="/compliments" element={<Compliments />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>
      </div>
    </DataProvider>
  );
}

export default App;