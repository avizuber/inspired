import React from "react";

type QuoteProps = {
  quote: {
    text: string;
    author: string;
  };
};

const QuoteDisplay: React.FC<QuoteProps> = ({ quote }) => {
  return (
    <div>
      <blockquote>
        <p>{quote.text}</p>
        <footer>
          <cite>{quote.author}</cite>
        </footer>
      </blockquote>
    </div>
  );
};

export default QuoteDisplay;
