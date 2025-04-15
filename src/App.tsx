import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Post from "./pages/Post";
import { useHoloConnection } from "./hooks/useHoloConnection";

function App() {
  const { isLoading, error: holoError, stories } = useHoloConnection();

  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    stories={stories}
                    isLoading={isLoading}
                    error={holoError}
                  />
                }
              />
              <Route
                path="/post/:id"
                element={
                  <Post
                    stories={stories}
                    isLoading={isLoading}
                    error={holoError}
                  />
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
