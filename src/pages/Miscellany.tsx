import DropdownSection from '../components/DropdownSection';

const Miscellany = () => {
  return (
    <div className="max-w-3xl">

      <h3 className="mt-0 text-lg font-medium text-right mb-4">
        Various things
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-[13px]">
        <li>
          <a
            href="https://www.youtube.com/watch?v=cysvEtrxNck&list=LL&index=1"
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Clutching TS^3
          </a>
          , Mohammad Javad Azavi. An animation of a clutching construction for the tangent bundle of the 3-sphere.
        </li>
        <li>
          <a
            href="https://www.cameronsworld.net"
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cameron's world
          </a>
          .
        </li>
        <li>
          <a 
            href="https://arxiv.org/abs/2212.09835v4" 
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            A non-constructive proof of the four-color theorem
          </a>
          , D.M. Jackson and L.B. Richmond.
        </li>
        <li>
          <a 
            href="https://arxiv.org/abs/2009.06735" 
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gödel diffeomorphisms
          </a>
          , Matthew Foreman.
        </li>
        <li>
          <a 
            href="https://play.math.illinois.edu/PathForms/" 
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            PathForms
          </a>
          .
        </li>
        <li>
          <a 
            href="https://davidshrigley.com" 
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            David Shrigley
          </a>
          .
        </li>
        <li>
          Pavel Dobryakov's WebGL{' '}
          <a
            href="https://paveldogreat.github.io/WebGL-Fluid-Simulation/"
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            fluid simulator
          </a>
          .
        </li>
        <li>
          A{' '}
          <a
            href="https://www.smashingmagazine.com/2021/09/deep-dive-wonderful-world-svg-displacement-filtering/"
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            deep dive
          </a>{' '}
          into SVG displacement filtering.
        </li>
        <li>
          <a
            href="https://chronologia.org/en/math_impressions/images.html"
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            MATHEMATICAL IMPRESSIONS
          </a>{' '}
          by Anatoly Fomenko.
        </li>
      </ul>
      
      <h3 className="mt-8 text-lg font-medium text-right mb-4">
        Biographical writing
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-[13px]">
        <li>
          <a 
            href="/postnikov_memorial.pdf" 
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mikhail Postnikov: his life, work, and legacy
          </a>
          , Y. Rudyak. Kind of hard to find.
        </li>
        <li>
          <a 
            href="https://www.ams.org/notices/201210/rtx121001392p.pdf" 
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Daniel Quillen
          </a>
          .
        </li>
        <li>
        <a 
            href="https://people.mpim-bonn.mpg.de/zagier/files/doi/10.1365/s13291-015-0114-1/dmv-FH.pdf" 
            className="text-link hover:text-link-hover hover:border-b-2 hover:border-link-hover transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Life and work of Friedrich Hirzebruch
          </a>
          , D. Zagier.
        </li>
      </ul>
    </div>
  );
};

export default Miscellany;