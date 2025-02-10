import { PaperList } from '../components/PaperList';

const Notes = () => {
  const notes = [
    {
      title: "Ambidexterity and Semiadditivity",
      subtitle: "Coming soon?",
      description: "My paper for the University of Chicago 2023 REU. Thanks to Peter May for advising me.",
      date: "2023",
      link: "#"
    },
    {
      title: "The Adams Conjecture and the K-theory of finite fields",
      subtitle: "jt with Zhong Zhang",
      description: "My paper written at the University of Chicago 2022 REU. Thanks to Peter May for advising me.",
      date: "2022",
      link: "#"
    },
    {
      title: "The derived functor approach to sheaf cohomology",
      subtitle: "",
      description: "My paper written at the University of Chicago 2021 REU. Thanks to Max Johnson for mentoring me.",
      date: "2021",
      link: "#"
    },
    {
      title: "Introduction to de Rham cohomology",
      subtitle: "",
      description: "Notes on de Rham cohomology a long time ago.",
      date: "2021",
      link: "#"
    }
  ];

  return (
    <div className="container max-w-3xl px-4 py-8">
      <h1 className="text-2xl mb-6">Notes</h1>
      <h2 className="text-xl font-bold mb-4">Unsorted</h2>
      <PaperList papers={notes} />
    </div>
  );
};

export default Notes;
