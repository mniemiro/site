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
      subtitle: <>Chicago REU 2022, Joint w/ <a href="https://zhongzhang-math.github.io/about/" className="no-underline">Zhong Zhang</a></>,
      description: "My paper written at the University of Chicago 2022 REU. Thanks to Peter May for advising us.",
      date: "2022",
      link: "#"
    },
    {
      title: "The derived functor approach to sheaf cohomology",
      subtitle: "Chicago REU 2021",
      description: "My paper written at the University of Chicago 2021 REU. Thanks to Max Johnson for mentoring me.",
      date: "2021",
      link: "#"
    },
    {
      title: "Introduction to de Rham cohomology",
      subtitle: "Old notes",
      description: "Notes on de Rham cohomology I wrote a long time ago.",
      date: "2021",
      link: "#"
    }
  ];

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold pt-8 pb-4">Unsorted</h2>
      <PaperList papers={notes} />
    </div>
  );
};

export default Notes;
