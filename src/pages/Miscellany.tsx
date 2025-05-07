import DropdownSection from '../components/DropdownSection';

const Miscellany = () => {
  return (
    <div className="max-w-3xl">
      <h1 className="text-[19px] mb-1 font-bold">Miscellany</h1>
      <p className="text-[12px] mb-6">
        A collection of mathematical notes and observations.
      </p>

      <h3 className="mt-8 text-lg font-medium text-right mb-4">
        Various things
      </h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      
      <h3 className="mt-8 text-lg font-medium text-right mb-4">
        Biographies
      </h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>Biography 1</li>
        <li>Biography 2</li>
        <li>Biography 3</li>
      </ul>
    </div>
  );
};

export default Miscellany;