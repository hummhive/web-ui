import React from "react";
import General from "./General";
import Youtube from "./Youtube";
import Tweet from "./Tweet";
import Facebook from "./Facebook";
import Instagram from "./Instagram";

const Embed = ({ data, isFocused }) => {
  switch (data.type) {
    case "tweet":
      return <Tweet data={data} isFocused={isFocused} />;
    case "youtube":
      return <Youtube data={data} isFocused={isFocused} />;
    case "facebook":
      return <Facebook data={data} isFocused={isFocused} />;
    case "instagram":
      return <Instagram data={data} isFocused={isFocused} />;
    default:
      return <General data={data} isFocused={isFocused} />;
  }
};

export default Embed;
