import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Centered container with a maximum width */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Your Site Title
        </h1>
        <p className="text-foreground mb-4">
          Here is some introductory content that explains what your site is
          about.
        </p>
        <p className="text-foreground">
          And here is the seminar announcement:&nbsp;
          <span className="font-bold">Harvard-MIT Babytop Seminar</span>.
        </p>
      </div>
    </div>
  );
}

export default App;
