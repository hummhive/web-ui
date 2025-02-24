import React from "react";
import { Pre, Code } from "./styled";

const CodeBlock = props => (
  <Pre>
    <Code>{props.children}</Code>
  </Pre>
);

export default CodeBlock;
