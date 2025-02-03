import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme.text} transition-colors duration-200`}>
      <nav className="border-b border-stone-100/50 dark:border-stone-800/30">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-serif tracking-tight">
              HummHive
            </Link>
            <div className="flex items-center gap-8">
              <button
                onClick={() => setTheme(theme.name === 'light' ? 'dark' : 'light')}
                className="hover:text-stone-500 dark:hover:text-stone-300 transition-colors"
                aria-label="Toggle theme"
              >
                {theme.name === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-stone-500 dark:hover:text-stone-300 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-stone-500 dark:hover:text-stone-300 transition-colors"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {children}
      </main>

      <footer className="border-t border-stone-100/50 dark:border-stone-800/30 mt-24">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <p className="text-sm text-stone-400 dark:text-stone-500">
            © {new Date().getFullYear()} HummHive. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;