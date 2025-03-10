import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Post from "./pages/Post";
import { useHoloConnection } from "./hooks/useHoloConnection";
import { useStories } from "./hooks/useStories";

function App() {
  const { holoClient, error: holoError, isConnected } = useHoloConnection();
  const { stories, isFetching, error: storiesError } = useStories(holoClient);

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
                    isConnected={isConnected}
                    isLoadingStories={isFetching}
                    error={storiesError || holoError}
                  />
                }
              />
              <Route
                path="/post/:id"
                element={
                  <Post
                    stories={stories}
                    isConnected={isConnected}
                    isLoadingStories={isFetching}
                    error={storiesError || holoError}
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
