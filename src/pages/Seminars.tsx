export const Seminars = () => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p className="text-[13px] mb-4">
        Here are some seminars I am organizing or have organized.
      </p>
      <ul className="text-[13px] space-y-2 pl-6">
        <li>(Spring 2026) Harvard/MIT Babytop --- Trace methods II, joint w/ Logan Hyslop</li>
        <li>(Fall 2025) Harvard/MIT Babytop --- <a href="https://math.mit.edu/topology/babytop/" className="text-link hover:text-link-hover" target="_blank" rel="noopener noreferrer">Trace methods I</a>, joint w/ Logan Hyslop</li>
        <li>(Spring 2025) Harvard/MIT Babytop --- <a href="https://math.mit.edu/topology/babytop/" className="text-link hover:text-link-hover" target="_blank" rel="noopener noreferrer">Chromatic homotopy theory</a></li>
        <li>(Summer 2022) Condensed Seminar @UChicago, joint w/ Michael Barz</li>
      </ul>
    </div>
  );
};

export default Seminars; 