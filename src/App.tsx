import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Post from './pages/Post';
import { useHoloConnection } from "./hooks/useHoloConnection";

function App() {
  const holoConnectionData = useHoloConnection();
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home {...holoConnectionData} />} />
              <Route path="/post/:id" element={<Post {...holoConnectionData} />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;