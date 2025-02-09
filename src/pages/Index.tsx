import DropdownSection from '../components/DropdownSection';

const Index = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-[19px] mb-1 font-bold">Welcome</h1>
      <p className="text-[12px] mb-6">
        A collection of mathematical thoughts and observations.
      </p>

      <DropdownSection 
        title="Recent Notes" 
        content={
          <div className="space-y-2 text-[8px]">
            <p>Category Theory</p>
            <p>Set Theory</p>
            <p>Algebraic Geometry</p>
          </div>
        }
      />
    </div>
  );
};

export default Index;
