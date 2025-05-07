import DropdownSection from '../components/DropdownSection';

const Miscellany = () => {
  return (
    <div className="max-w-3xl">
      <p className="text-[12px] mb-6">
        A collection of mathematical notes and observations.
      </p>

      <h3 className="mt-8 text-lg font-medium text-right mb-4">
        Various things
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-[13px]">
        <li>
          <a 
            href="https://arxiv.org/abs/2212.09835v4" 
            className="text-orange-500 hover:text-orange-600 hover:border-b-2 hover:border-orange-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            A non-constructive proof of the four-color theorem
          </a>
          , D.M. Jackson and L.B. Richmond.
        </li>
        <li>
          <a 
            href="https://arxiv.org/abs/2009.06735" 
            className="text-orange-500 hover:text-orange-600 hover:border-b-2 hover:border-orange-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gödel diffeomorphisms
          </a>
          , Matthew Foreman.
        </li>
      </ul>
      
      <h3 className="mt-8 text-lg font-medium text-right mb-4">
        Biographies
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-[13px]">
        <li>Biography 1</li>
        <li>Biography 2</li>
        <li>Biography 3</li>
      </ul>
    </div>
  );
};

export default Miscellany;