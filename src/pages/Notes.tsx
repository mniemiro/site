import DropdownSection from '../components/DropdownSection';

const Notes = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-[19px] mb-1 font-bold">Notes</h1>
      <p className="text-[12px] mb-6">
        Mathematical notes and observations.
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

export default Notes; 