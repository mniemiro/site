import React from 'react';

interface HolographicLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const HolographicLink: React.FC<HolographicLinkProps> = ({ 
  href, 
  children, 
  className = "",
  target = "_blank",
  rel = "noopener noreferrer"
}) => {
  // Check if the link is external
  const isExternal = href && !href.startsWith('/') && !href.startsWith('#');
  
  return (
    <a
      href={href}
      target={isExternal ? target : undefined}
      rel={isExternal ? rel : undefined}
      className={`
        relative inline-block
        bg-gradient-to-r from-cyan-300 via-purple-500 to-pink-400
        text-transparent bg-clip-text hover:animate-pulse
        before:content-[attr(data-content)]
        before:absolute before:left-0 before:top-0
        before:bg-gradient-to-r before:from-pink-500 before:via-cyan-400 before:to-purple-500
        before:text-transparent before:bg-clip-text
        before:animate-hologram
        after:content-[attr(data-content)]
        after:absolute after:left-0 after:top-0
        after:bg-gradient-to-r after:from-purple-400 after:via-pink-500 after:to-cyan-400
        after:text-transparent after:bg-clip-text
        after:animate-hologram after:animation-delay-400
        ${className}
      `}
      data-content={typeof children === 'string' ? children : ''}
    >
      {children}
    </a>
  );
};

export default HolographicLink; 