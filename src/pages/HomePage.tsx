export const HomePage = () => {
  return (
    <div className="text-[14.88px] leading-[1.45]">
      <p>
        Hi, my name is Matthew Niemiro. I am a PhD student at{" "}
        <a
          href="https://www.math.harvard.edu"
          className="text-link hover:text-link-hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          Harvard University
        </a>{" "}
        working in algebra and topology (shapes, spaces), fortunate to be advised
        by Mike Hopkins and Tomer Schlank. This is my math (blog?)
      </p>
      <p className="mt-[1.45em]">
        Here is my{" "}
        <a href="/docs/cv.pdf" className="text-link hover:text-link-hover">CV</a>.
        You can email me at{" "}
        <a href="mailto:mniemiro@math.harvard.edu" className="text-link hover:text-link-hover">mniemiro@math.harvard.edu</a>.
        If you are really out to get me, I can be cornered in my office at Harvard SC 425c.
      </p>

      <figure className="my-[1.6em]">
        <figcaption className="mb-[0.75em]">Here is my favorite photo I've taken in Cambridge, MA:</figcaption>
        <img src="/photos/harvard.jpg" alt="" className="block w-full h-auto" />
      </figure>
      <figure className="my-[1.6em]">
        <figcaption className="mb-[0.75em]">Kongenshave, Denmark:</figcaption>
        <img src="/photos/kongenshave.jpg" alt="" className="block w-full h-auto" />
      </figure>
      <figure className="my-[1.6em]">
        <figcaption className="mb-[0.75em]">My shed:</figcaption>
        <img src="/photos/shed.jpg" alt="" className="block w-full h-auto" />
      </figure>
      <figure className="my-[1.6em]">
        <figcaption className="mb-[0.75em]">My city Chicago:</figcaption>
        <img src="/photos/chicago.jpg" alt="" className="block w-full h-auto" />
      </figure>
    </div>
  );
};

export default HomePage;
