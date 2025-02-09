import DropdownSection from '../components/DropdownSection';

const About = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-[19px] mb-1 font-bold">About</h1>
      <p className="text-[12px] mb-6">
        A collection of thoughts on mathematics.
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

export default About;
