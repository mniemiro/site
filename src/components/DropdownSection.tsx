import { useState, useRef, useEffect } from 'react';
import Confetti from 'react-confetti';

interface Publication {
  title: string;
  date?: string;  // Optional date
  link?: string;  // Optional link
}

interface DropdownSectionProps {
  title: string;
  content?: React.ReactNode;  // Made optional since we might only have publications
  publications?: Publication[];  // Optional array of publications
}

const DropdownSection = ({ title, content, publications }: DropdownSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width + 200,
        height: 200,
        x: rect.x,
        y: rect.y
      });
    }
  }, [isOpen]);

  const handleClick = () => {
    if (!isOpen) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4">
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={30}
          gravity={0.1}
          wind={0.005}
          friction={0.99}
          initialVelocityY={1}
          style={{
            position: 'fixed',
            left: dimensions.x,
            top: dimensions.y,
            pointerEvents: 'none'
          }}
          drawShape={ctx => {
            ctx.beginPath();
            ctx.arc(0, 0, 1.5, 0, 2 * Math.PI);
            ctx.fill();
          }}
        />
      )}
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="flex items-center gap-2 text-[13px] hover:text-link transition-colors"
      >
        <span>{isOpen ? '-' : '+'}</span>
        {title}
      </button>
      {isOpen && (
        <div className="pl-4 mt-2">
          {publications && publications.map((pub, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div className="text-[13px]">{pub.title}</div>
                {pub.link && (
                  <a 
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-link hover:text-link-hover hover:underline ml-4"
                  >
                    [link]
                  </a>
                )}
              </div>
              <div className="text-right text-[12px] text-muted-foreground">
                {pub.date}
              </div>
            </div>
          ))}
          {content && <div className="mt-2">{content}</div>}
        </div>
      )}
    </div>
  );
};

export default DropdownSection; 