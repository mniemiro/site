export const HomePage = () => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p className="text-[13px]">
        Hi, my name is Matthew Niemiro. I am a PhD student at <a href="https://www.math.harvard.edu" className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">Harvard University</a> working in algebra and topology (shapes, spaces). This is my math blog(?)
      </p>
      <p>&nbsp;</p>
      <p className="text-[13px]">
        Here is my <a href="/vita.pdf" className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">CV</a>. My email is <a href="mailto:mniemiro@math.harvard.edu" className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">mniemiro@math.harvard.edu</a>. If you really want to scare me, I can be cornered in SC 425c.
      </p>
      <p>&nbsp;</p>
      <p className="text-[13px]">
        This spring, I am organizing the{' '}
        <span className="
          inline-block
          font-bold
          relative
          bg-gradient-to-r from-cyan-300 via-purple-500 to-pink-400
          text-transparent bg-clip-text
          hover:animate-pulse
          before:content-['Harvard-MIT_Babytop_Seminar']
          before:absolute before:left-0 before:top-0
          before:bg-gradient-to-r before:from-pink-500 before:via-cyan-400 before:to-purple-500
          before:text-transparent before:bg-clip-text
          before:animate-[hologram_4s_ease-in-out_infinite]
          after:content-['Harvard-MIT_Babytop_Seminar']
          after:absolute after:left-0 after:top-0
          after:bg-gradient-to-r after:from-purple-400 after:via-pink-500 after:to-cyan-400
          after:text-transparent after:bg-clip-text
          after:animate-[hologram_4s_ease-in-out_infinite_500ms]
        ">
          Harvard-MIT Babytop Seminar
        </span>.
      </p>
    </div>
  );
};

export default HomePage; 