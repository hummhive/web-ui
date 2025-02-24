import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

import { TweetContianer } from "./styled";

const Tweet = ({ data, isFocused }) => {
  const { tweetId } = data;

  return (
    <TweetContianer contentEditable={false} isFocused={isFocused}>
      <TwitterTweetEmbed tweetId={tweetId} />
    </TweetContianer>
  );
};

export default Tweet;
