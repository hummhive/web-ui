import React from "react";
import { Code } from "./styled";

function CodeBlock(props) {
  return <Code>{props.children}</Code>;
}

export default CodeBlock;
