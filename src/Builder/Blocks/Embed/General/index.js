import React from "react";
import {
  EmbedContianer,
  EmbedTextContainer,
  EmbedTitle,
  EmbedDescription,
  EmbedUrlContainer,
  EmbedFavicon,
  EmbedUrl,
  EmbedImage,
} from "./styled";

const Embed = ({ data, isFocused }) => {
  const { url, meta } = data;
  const title = meta["og:title"] || meta.title;
  const description = meta["og:description"] || meta.description;
  const image = meta["og:image"] || meta["twitter:image"] || meta.image;
  const { favicon } = meta;

  const open = () => {
    window.open(url, "_blank");
  };

  return (
    <EmbedContianer
      contentEditable={false}
      isFocused={isFocused}
      onClick={open}
    >
      <EmbedTextContainer>
        <EmbedTitle>{title}</EmbedTitle>
        <EmbedDescription>
          {description.trim().split("\n").join(" ")}
        </EmbedDescription>
        <EmbedUrlContainer>
          <EmbedFavicon src={favicon} />
          <EmbedUrl>{url}</EmbedUrl>
        </EmbedUrlContainer>
      </EmbedTextContainer>
      <EmbedImage src={image} />
    </EmbedContianer>
  );
};

export default Embed;
