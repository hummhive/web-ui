import React from "react";
import { LI } from "./styled";

const LIBlock = props => <LI {...props.attributes}>{props.children}</LI>;

export default LIBlock;
