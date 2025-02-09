import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Index from "./pages/Index";
import About from "./pages/About";
import Notes from './pages/Notes';
import Infinity from './pages/Infinity';
import Miscellany from './pages/Miscellany';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container max-w-3xl px-4 py-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/infinity" element={<Infinity />} />
              <Route path="/miscellany" element={<Miscellany />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
