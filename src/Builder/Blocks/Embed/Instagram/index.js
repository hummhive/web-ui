import React from "react";
import InstagramEmbed from "react-instagram-embed";
import { EmbedContianer } from "./styled";

const Embed = ({ data, isFocused }) => {
  const { url } = data;

  return (
    <EmbedContianer contentEditable={false} isFocused={isFocused}>
      <InstagramEmbed url={url} />
    </EmbedContianer>
  );
};

export default Embed;
