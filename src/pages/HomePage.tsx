import HolographicLink from '../components/HolographicLink';

export const HomePage = () => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p className="text-[13px]">
        Hi, my name is Matthew Niemiro. I am a PhD student at <a href="https://www.math.harvard.edu" className="text-link hover:text-link-hover" target="_blank" rel="noopener noreferrer">Harvard University</a> working in algebra and topology (shapes, spaces). This is my math blog(?)
      </p>
      <p>&nbsp;</p>
      <p className="text-[13px]">
        Here is my <a href="/docs/cv.pdf" className="text-link hover:text-link-hover">CV</a>. You can email me at <a href="mailto:mniemiro@math.harvard.edu" className="text-link hover:text-link-hover">mniemiro@math.harvard.edu</a>. If you really want to scare me, I can be cornered in SC 425c.
      </p>
      <p>&nbsp;</p>
      <p className="text-[13px]">
        This spring, I am organizing the <HolographicLink href="https://freeloop.space/babytop/" className="text-[17px]">Harvard-MIT Babytop seminar</HolographicLink> with Logan Hyslop.
      </p>
      <p>&nbsp;</p>
      <p className="text-[13px]">
        Eventually, my site will migrate to a new link: <a href="https://freeloop.space" className="text-link hover:text-link-hover" target="_blank" rel="noopener noreferrer">www.freeloop.space</a>.
      </p>
    </div>
  );
};

export default HomePage; 