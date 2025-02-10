import ReactConfetti from 'react-confetti';
import { useState, useCallback } from 'react';

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
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 });

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setConfettiPosition({ x, y });
    setIsConfettiActive(true);
    setTimeout(() => setIsConfettiActive(false), 3000); // Stop after 3 seconds
  }, []);

  return (
    <div className="space-y-6">
      {isConfettiActive && (
        <ReactConfetti
          numberOfPieces={200}
          recycle={false}
          confettiSource={{
            x: confettiPosition.x,
            y: confettiPosition.y,
            w: 10,
            h: 10
          }}
          style={{ position: 'fixed', pointerEvents: 'none', zIndex: 999999 }}
          colors={['#FFB6B9', '#FAE3D9', '#BBDED6', '#61C0BF']}
        />
      )}
      {papers.map((paper, index) => (
        <div key={index} className="paper-entry relative">
          <div className="absolute -left-4 -top-0.5">
            <span className="text-[13px]">
              {openIndex === index ? '-' : '+'}
            </span>
          </div>
          <div className="grid grid-cols-[1fr,auto] gap-4 items-start">
            <button 
              onClick={(e) => handleClick(e)}
              className="text-left hover:text-orange-500 transition-colors leading-tight"
            >
              <div className="font-bold text-[13px]">
                [{index + 1}] {paper.title}
              </div>
              <div className="font-light italic text-[11px] mt-[1px]">
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
          {openIndex === index && (
            <div className="pl-4 mt-2 text-[13px]">
              {paper.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 