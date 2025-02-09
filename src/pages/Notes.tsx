import { PaperList } from '../components/PaperList';

const Notes = () => {
  const notes = [
    {
      title: "Introduction to Category Theory",
      subtitle: "A Gentle Guide to Abstract Mathematics",
      description: "These notes provide an accessible introduction to category theory, starting from basic definitions and building up to advanced concepts. Topics include functors, natural transformations, and universal properties.",
      date: "April 2024",
      link: "the"
    },
    {
      title: "The Riemann Hypothesis",
      subtitle: "Understanding the Distribution of Prime Numbers",
      description: "A comprehensive overview of the Riemann Hypothesis and its implications for number theory. Includes historical context, key concepts, and modern developments.",
      date: "March 2024",
      link: "https://example.com/riemann-notes"
    }
  ];

  return (
    <div className="container max-w-3xl px-4 py-8">
      <h1 className="text-2xl mb-6">Notes</h1>
      <PaperList papers={notes} />
    </div>
  );
};

export default Notes;
