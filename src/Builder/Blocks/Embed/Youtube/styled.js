import styled from "styled-components";

export const EmbedContianer = styled.div`
  position: relative;
  margin: 16px 0;
  outline: solid 0px ${props => props.theme.secondaryVivid};
  outline-width: ${props => (props.isFocused ? "4px" : "0px")};
  width: 100%;
  padding-bottom: calc(100% / 1.7778); /* 16:9 */
`;

export const VideoContianer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
