import { MathJax } from 'better-react-mathjax';
import { PaperList } from '../components/PaperList';

export const NotesPage = () => {
  const papers = [
    {
      title: "Example with Math",
      subtitle: "Using $\\LaTeX$ notation",
      description: `Here's a mathematical description:
        $$
        \\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
        $$
        This is known as the Gaussian integral.`,
      date: "2024",
    },
    // ... other papers
  ];

  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Notes</h1>
      <PaperList papers={papers} />
    </div>
  );
}; 