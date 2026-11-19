import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import HomePage from "./pages/HomePage";
import Notes from './pages/Notes';
import Miscellany from './pages/Miscellany';
import Seminars from './pages/Seminars';
import NotFound from "./pages/NotFound";
import { MathJaxContext } from 'better-react-mathjax';

const queryClient = new QueryClient();

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ]
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MathJaxContext config={config}>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <div className="frame-grid">
              <Link to="/" className="site-name">
                M.A. Niemiro
              </Link>
              <Navigation />
              <main className="site-main">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/miscellany" element={<Miscellany />} />
                  <Route path="/seminars" element={<Seminars />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </MathJaxContext>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
