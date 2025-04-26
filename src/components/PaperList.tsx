import ReactConfetti from 'react-confetti';
import { useState, useCallback, useRef, useEffect } from 'react';
import Confetti from 'react-confetti';

interface Paper {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  link?: string;
}

interface PaperListProps {
  papers: Paper[];
}

export const PaperList = ({ papers }: PaperListProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
  }, [openIndex]);

  const handleClick = useCallback((index: number) => {
    // Only handle clicks for papers with descriptions
    if (!papers[index].description) return;
    
    if (openIndex !== index) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    setOpenIndex(openIndex === index ? null : index);
  }, [openIndex, papers]);

  return (
    <div className="space-y-6 relative">
      <div className="absolute" style={{ pointerEvents: 'none' }}>
        {showConfetti && (
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            recycle={false}
            numberOfPieces={40}
            gravity={0.1}
            wind={0.005}
            friction={0.99}
            initialVelocityY={1}
            style={{
              position: 'fixed',
              left: dimensions.x,
              top: dimensions.y,
              pointerEvents: 'none',
              zIndex: 50
            }}
            drawShape={ctx => {
              ctx.beginPath();
              ctx.arc(0, 0, 1.5, 0, 2 * Math.PI);
              ctx.fill();
            }}
          />
        )}
      </div>
      {papers.map((paper, index) => (
        <div key={index} className="paper-entry relative">
          {paper.description && (
            <div className="absolute -left-4 -top-0.5">
              <span className="text-[13px]">
                {openIndex === index ? '-' : '+'}
              </span>
            </div>
          )}
          <div className="grid grid-cols-[1fr,auto] gap-4 items-start">
            <div 
              className={paper.description ? "cursor-pointer" : ""}
              onClick={paper.description ? () => handleClick(index) : undefined}
            >
              <div className="font-bold text-[13px]">
                [{index + 1}] {paper.title}
              </div>
              <div className="font-light italic text-[11px] mt-[1px]">
                {paper.subtitle}
              </div>
            </div>
            <div className="flex flex-col items-end leading-tight">
              {paper.link && (
                <a 
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-orange-500 hover:text-orange-600 hover:underline"
                >
                  [link]
                </a>
              )}
              <span className="text-[12px] text-muted-foreground opacity-80 mt-[1px]">
                {paper.date}
              </span>
            </div>
          </div>
          {openIndex === index && paper.description && (
            <div className="pl-4 mt-2 text-[13px]">
              {paper.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 