import { useState } from 'react';
import confetti from 'canvas-confetti';

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

  const handleClick = (event: React.MouseEvent, index: number) => {
    if (openIndex !== index) {
      // const button = event.currentTarget;
      // const rect = button.getBoundingClientRect();
      
      // // Create multiple confetti bursts across the width
      // const burstCount = 5; // Number of confetti bursts
      // for (let i = 0; i < burstCount; i++) {
      //   const x = (rect.left + (rect.width * (i / (burstCount - 1)))) / window.innerWidth;
      //   const y = rect.top / window.innerHeight;
        
      //   confetti({
      //     particleCount: 1,
      //     spread: 100,
      //     startVelocity: 5,
      //     gravity: 0.8,
      //     drift: 2,  // Adds horizontal movement
      //     origin: { x, y },
      //     scalar: 0.7,
      //     ticks: 150,
      //     angle: 90,
      //     colors: ['#FFB6B9', '#FAE3D9', '#BBDED6', '#61C0BF']  // Optional: pastel colors
      //   });
      // }
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {papers.map((paper, index) => (
        <div key={index} className="paper-entry relative">
          <div className="absolute -left-4 -top-0.5">
            <span className="text-[13px]">
              {openIndex === index ? '-' : '+'}
            </span>
          </div>
          <div className="grid grid-cols-[1fr,auto] gap-4 items-start">
            <button 
              onClick={(e) => handleClick(e, index)}
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