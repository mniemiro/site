export const Seminars = () => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p className="text-[13px] mb-4">
        Here are some seminars I am organizing or have organized.
      </p>
      <ul className="text-[13px] pl-6">
        <li className="mb-2">(Spring 2025) Harvard/MIT Babytop Seminar --- Trace methods II</li>
        <li className="mb-2">(Fall 2024) Harvard/MIT Babytop Seminar --- <a href="https://math.mit.edu/topology/babytop/" className="text-link hover:text-link-hover" target="_blank" rel="noopener noreferrer">Trace methods I</a></li>
        <li className="mb-2">(Spring 2024) Harvard/MIT Babytop Seminar --- <a href="https://math.mit.edu/topology/babytop/" className="text-link hover:text-link-hover" target="_blank" rel="noopener noreferrer">Chromatic homotopy theory</a></li>
        <li className="mb-2">(Summer 2022) Condensed Seminar @UChicago</li>
      </ul>
    </div>
  );
};

export default Seminars; 