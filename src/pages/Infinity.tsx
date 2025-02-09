import DropdownSection from '../components/DropdownSection';

const Infinity = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-[19px] mb-1 font-bold">∞</h1>
      <p className="text-[12px] mb-6">
        A collection of thoughts on infinity.
      </p>

      <DropdownSection 
        title="Course Notes" 
        content={
          <div className="space-y-2 text-[8px]">
            <p>Set Theory</p>
            <p>Ordinals and Cardinals</p>
            <p>Transfinite Induction</p>
          </div>
        }
      />
    </div>
  );
};

export default Infinity; 