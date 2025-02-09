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
              className="text-left hover:text-orange-500 transition-colors"
            >
              <div className="font-bold text-[13px]">
                [{index + 1}] {paper.title}
              </div>
              <div className="font-light italic text-[13px] mt-1">
                {paper.subtitle}
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
          <div className="text-right text-[12px] text-muted-foreground mt-1">
            {paper.date}
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