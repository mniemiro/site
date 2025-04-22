import HolographicLink from '../components/HolographicLink';

export const HomePage = () => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p className="text-[13px]">
        Hi, my name is Matthew Niemiro. I am a PhD student at <a href="https://www.math.harvard.edu" className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300" target="_blank" rel="noopener noreferrer">Harvard University</a> working in algebra and topology (shapes, spaces). This is my math blog(?)
      </p>
      <p>&nbsp;</p>
      <p className="text-[13px]">
        Here is my <a href="/docs/cv.pdf" className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">CV</a>. You can email me at <a href="mailto:mniemiro@math.harvard.edu" className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">mniemiro@math.harvard.edu</a>. If you really want to scare me, I can be cornered in SC 425c.
      </p>
      <p>&nbsp;</p>
      <p className="text-[13px]">
        This spring, I am organizing the <HolographicLink href="https://math.mit.edu/topology/babytop/">Harvard-MIT Babytop seminar</HolographicLink>.
      </p>
    </div>
  );
};

export default HomePage; 