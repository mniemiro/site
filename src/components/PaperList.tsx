import { useState } from 'react';

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

  return (
    <div className="space-y-6">
      {papers.map((paper, index) => (
        <div key={index} className="paper-entry relative">
          <div className="absolute -left-4">
            <span className="text-[13px]">
              {openIndex === index ? '-' : '+'}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="text-left hover:text-orange-500 transition-colors w-full"
            >
              <div className="font-bold text-[13px]">
                [{index + 1}] {paper.title}
              </div>
              <div className="grid grid-cols-[1fr,auto] gap-4 items-center mt-0.5">
                <span className="font-light italic text-[13px]">
                  {paper.subtitle}
                </span>
                <span className="text-[12px] text-muted-foreground opacity-80">
                  {paper.date}
                </span>
              </div>
            </button>
            {paper.link && (
              <a 
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-orange-500 hover:text-orange-600 hover:underline ml-4"
              >
                [link]
              </a>
            )}
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