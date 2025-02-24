import React from "react";
import { A } from "./styled";

type ABlockProps = {
  href: string;
  target?: string;
  editor?: boolean;
  children: React.ReactNode;
};

const ABlock: React.FC<ABlockProps> = ({ href, target, editor, children }) => {
  return (
    <A
      href={href}
      target={target}
      isEditor={!!editor}
      aria-label="Link"
      className="text-blue-500 hover:underline"
    >
      {children}
    </A>
  );
};

export default ABlock;
