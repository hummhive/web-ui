import React from "react";
import { EmbedContianer, VideoContianer } from "./styled";

const Embed = ({ data, isFocused }) => {
  const { url } = data;

  return (
    <EmbedContianer contentEditable={false} isFocused={isFocused}>
      <VideoContianer>
        <iframe
          title="Embeded Youtube Video"
          src={url}
          width="100%"
          height="100%"
        />
      </VideoContianer>
    </EmbedContianer>
  );
};

export default Embed;
