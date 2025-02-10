import { MathJax } from 'better-react-mathjax';

export const InfinityPage = () => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Infinity</h1>
      <MathJax>
        {`Here's an example of inline math: $\\aleph_0$ is the cardinality of the natural numbers.

        And here's a displayed equation:
        $$
        \\begin{align*}
        \\aleph_0 &= |\\mathbb{N}| \\\\
        &< |\\mathbb{R}| = 2^{\\aleph_0} = \\mathfrak{c}
        \\end{align*}
        $$`}
      </MathJax>
    </div>
  );
}; 