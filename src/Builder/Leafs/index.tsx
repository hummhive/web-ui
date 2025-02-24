/* eslint-disable no-param-reassign */
import React from "react";
import A from "./A";
import Code from "./Code";
import U from "./U";
import EM from "./EM";
import Strong from "./Strong";

interface LeafProps {
  attributes: React.HTMLAttributes<HTMLSpanElement>;
  children: React.ReactNode;
  leaf: {
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    code?: boolean;
    link?: boolean;
    [key: string]: any; 
  };
}

const Leafs: React.FC<LeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <Strong>{children}</Strong>;
  }
  if (leaf.italic) {
    children = <EM>{children}</EM>;
  }
  if (leaf.underlined) {
    children = <U>{children}</U>;
  }
  if (leaf.code) {
    children = <Code>{children}</Code>;
  }
  if (leaf.link) {
    children = <A {...leaf}>{children}</A>;
  }

  return <span {...attributes}>{children}</span>;
};

export default Leafs;
