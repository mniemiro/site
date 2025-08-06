export const Seminars = () => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p className="text-[13px]">
        Here are some seminars I am organizing or have organized.
      </p>
      <ul className="text-[13px]">
        <li>(Spring 2025) Harvard/MIT Babytop Seminar --- Trace methods II</li>
        <li>(Fall 2024) Harvard/MIT Babytop Seminar --- <a href="https://math.mit.edu/topology/babytop/" className="text-link hover:text-link-hover" target="_blank" rel="noopener noreferrer">Trace methods I</a></li>
        <li>(Spring 2024) Harvard/MIT Babytop Seminar --- <a href="https://math.mit.edu/topology/babytop/" className="text-link hover:text-link-hover" target="_blank" rel="noopener noreferrer">chromatic homotopy theory</a></li>
        <li>(Summer 2022) Condensed Seminar @UChicago</li>
      </ul>
    </div>
  );
};

export default Seminars; 