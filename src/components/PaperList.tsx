import { useState, useRef, useEffect } from 'react';
import Confetti from 'react-confetti';
import { MathJax } from 'better-react-mathjax';

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
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const paperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const handleClick = (index: number) => {
    setOpenIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        const paperElement = paperRefs.current[index];
        if (paperElement) {
          const rect = paperElement.getBoundingClientRect();
          setDimensions({
            width: rect.width,
            height: 200,
            x: rect.x,
            y: rect.y
          });
        }
        newSet.add(index);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={50}
          gravity={0.07}
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
      {papers.map((paper, index) => (
        <div 
          key={index} 
          className="paper-entry relative min-h-[2.5rem]"
          ref={el => paperRefs.current[index] = el}
        >
          <div className="absolute -left-4 top-1">
            <span className="text-[13px]">
              {openIndices.has(index) ? '-' : '+'}
            </span>
          </div>
          <div className="grid grid-cols-[1fr,auto] gap-4 items-start">
            <button 
              onClick={() => handleClick(index)}
              className="text-left hover:text-orange-500 transition-colors leading-tight w-full focus:outline-none"
            >
              <div className="font-bold text-[13px]" title={paper.title}>
                <MathJax>{`[${index + 1}] ${paper.title}`}</MathJax>
              </div>
              <div className="font-light italic text-[11px] mt-[1px]" title={paper.subtitle}>
                {paper.subtitle}
              </div>
            </button>
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
          {openIndices.has(index) && (
            <div className="pl-4 mt-2 text-[13px]">
              <MathJax>{paper.description}</MathJax>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 