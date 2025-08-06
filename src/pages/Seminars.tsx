export const Seminars = () => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p className="text-[13px] mb-4">
        Here are some seminars I am organizing or have organized.
      </p>
      <ul className="text-[13px] space-y-2 list-none">
        <li className="before:content-['(Spring 2026)'] before:inline-block before:w-16 before:text-right before:mr-4 before:font-mono">
          (Spring 2025) Harvard/MIT Babytop Seminar --- Trace methods II, joint w/ Logan Hyslop
        </li>
        <li className="before:content-['(Fall 2025)'] before:inline-block before:w-16 before:text-right before:mr-4 before:font-mono">
          (Fall 2024) Harvard/MIT Babytop Seminar --- <a href="https://math.mit.edu/topology/babytop/" className="text-link hover:text-link-hover" target="_blank" rel="noopener noreferrer">Trace methods I</a>, joint w/ Logan Hyslop
        </li>
        <li className="before:content-['(Spring 2024)'] before:inline-block before:w-16 before:text-right before:mr-4 before:font-mono">
          (Spring 2024) Harvard/MIT Babytop Seminar --- <a href="https://math.mit.edu/topology/babytop/" className="text-link hover:text-link-hover" target="_blank" rel="noopener noreferrer">Chromatic homotopy theory</a>
        </li>
        <li className="before:content-['(Summer 2022)'] before:inline-block before:w-16 before:text-right before:mr-4 before:font-mono">
          (Summer 2022) Condensed Seminar @UChicago, joint w/ Michael Barz
        </li>
      </ul>
    </div>
  );
};

export default Seminars; 