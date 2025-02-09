import DropdownSection from '../components/DropdownSection';

const Miscellany = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-[19px] mb-1 font-bold">Miscellany</h1>
      <p className="text-[12px] mb-6">
        A collection of mathematical notes and observations.
      </p>
      <p className="text-[12px] mb-6">
        <a href="https://mathscinet.ams.org/" className="text-orange-500 hover:text-orange-600">MathSciNet Profile</a>
      </p>

      <DropdownSection 
        title="Course Notes" 
        content={
          <div className="space-y-2 text-[8px]">
            <p>Advanced Algebra</p>
            <p>Category Theory</p>
            <p>Algebraic Geometry</p>
          </div>
        }
      />
    </div>
  );
};

export default Miscellany; 