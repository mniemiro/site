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
  const [confettiKey, setConfettiKey] = useState(0);
  const paperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const confettiTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    if (openIndex !== null && paperRefs.current[openIndex]) {
      const rect = paperRefs.current[openIndex]?.getBoundingClientRect();
      if (rect) {
        setDimensions({
          width: rect.width + 200,
          height: 200,
          x: rect.x,
          y: rect.y
        });
      }
    }
  }, [openIndex]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = useCallback((index: number) => {
    // Only handle clicks for papers with descriptions
    if (!papers[index].description) return;
    
    if (openIndex !== index) {
      // Clear any existing timeout
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
      
      // Force confetti to restart by updating the key
      setConfettiKey(prev => prev + 1);
      setShowConfetti(true);
      
      // Set new timeout
      confettiTimeoutRef.current = setTimeout(() => {
        setShowConfetti(false);
        confettiTimeoutRef.current = null;
      }, 4000);
    }
    setOpenIndex(openIndex === index ? null : index);
  }, [openIndex, papers]);

  return (
    <div className="relative">
      <div className="absolute" style={{ pointerEvents: 'none' }}>
        {showConfetti && (
          <Confetti
            key={confettiKey}
            width={dimensions.width}
            height={dimensions.height}
            recycle={false}
            numberOfPieces={40}
            gravity={0.3}
            wind={0.005}
            friction={0.99}
            initialVelocityY={1.2}
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
      <div className="space-y-6">
        {papers.map((paper, index) => (
          <div 
            key={index} 
            className="paper-entry relative"
            ref={el => paperRefs.current[index] = el}
          >
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
                <div className="font-bold text-[14px] tracking-[-1px]">
                  [{index + 1}] {paper.title}
                </div>
                <div className="font-light italic text-[12px] mt-[1px] tracking-wide">
                  {paper.subtitle}
                </div>
              </div>
              <div className="flex flex-col items-end leading-tight">
                {paper.link && (
                  <a 
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-link hover:text-link-hover hover:underline"
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
              <div className="pl-4 mt-2 text-[13px] max-w-[75%]">
                {paper.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 