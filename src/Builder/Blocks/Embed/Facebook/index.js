import React from "react";
import { FacebookProvider, EmbeddedPost } from "react-facebook";
import { EmbedContianer } from "./styled";

const Embed = ({ data, isFocused }) => {
  const { url } = data;

  return (
    <EmbedContianer contentEditable={false} isFocused={isFocused}>
      <FacebookProvider appId="3019638951386555">
        <EmbeddedPost href={url} width="500" />
      </FacebookProvider>
    </EmbedContianer>
  );
};

export default Embed;
