import { PaperList } from '../components/PaperList';

const Notes = () => {
  const notes = [
    {
      title: "Ambidexterity and Semiadditivity",
      subtitle: "In preparation",
      description: "My paper for the University of Chicago 2023 REU. Thanks to Peter May for advising me.",
      date: "2023",
      link: "#"
    },
    {
      title: "The Adams Conjecture and the K-theory of finite fields",
      subtitle: <>Chicago REU 2022, Joint w/ <a href="https://zhongzhang-math.github.io/about/" className="no-underline" target="_blank" rel="noopener noreferrer">Zhong Zhang</a></>,
      description: "My paper written at the University of Chicago 2022 REU. Thanks to Peter May for advising us.",
      date: "2022",
      link: "/docs/reu_2022_paper.pdf"
    },
    {
      title: "The derived functor approach to sheaf cohomology",
      subtitle: "Chicago REU 2021",
      description: "My paper written at the University of Chicago 2021 REU. Thanks to Max Johnson for mentoring me.",
      date: "2021",
      link: "/docs/reu_2021_paper.pdf"
    },
    {
      title: "Introduction to de Rham cohomology",
      subtitle: "Old notes",
      description: "Notes on de Rham cohomology I wrote a long time ago.",
      date: "2021",
      link: "/docs/de_rham_cohomology.pdf"
    }
  ];

  const strayNotes = [
    {
      title: "BOOKMARKED Chromatic Homotopy Theory (252x) lecture notes by Jacob Lurie",
      subtitle: "Collated into one PDF, with bookmarks!!",
      description: "",
      date: "",
      link: "/docs/Lurie_252x_bookmarks.pdf"
    }
  ];

  return (
    <div className="max-w-3xl">
      <PaperList papers={notes} />
      
      <h3 className="mt-8 text-lg font-medium text-right mb-4">
        Stray notes and links
      </h3>
      <PaperList papers={strayNotes} />
    </div>
  );
};

export default Notes;
