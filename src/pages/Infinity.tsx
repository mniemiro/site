const Infinity = () => {
  return (
    <div className="space-y-4">
      
      <p className="text-[12px] mb-6">
      It's a basic, cool, and important fact that spaces and categories have a common generalization in ∞-categories. This is a first step toward realizing an important relationship between space and algebra that opens for "homotopy theory" and "higher algebra." These are complicated subjects, but are also the decided language for a sizeable chunk of algebraic topology, geometry, K-theory, ... So, in my undergraduate, I started a journal to record my ∞-category learning throes. I have learned a lot since then, and a lot about learning. 
      </p>

      <p className="text-[12px] mb-6">
        For accountability and pedagogical purposes, I'll share my notes here:
      </p>

      <div className="text-[12px]">
        <h3 className="font-semibold mb-2">Notebooks:</h3>
        <ul className="pl-8 space-y-1">
          <li className="flex items-start">
            <span className="mr-2 inline-block w-4">∞</span>
            <a 
              href="/docs/nb2023.pdf" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Notebook 2023
            </a>
          </li>
          <li className="flex items-start">
            <span className="mr-2 inline-block w-4">∞</span>
            <a 
              href="/docs/nb2024.pdf" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Notebook 2024
            </a>
          </li>
          <div className="pl-6 my-1">Hello world!</div>
          <li className="flex items-start">
            <span className="mr-2 inline-block w-4">∞</span>
            <a 
              href="/docs/nb2025.pdf" 
              className="text-blue-600 hover:text-blue-800 hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Notebook 2025
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Infinity; 