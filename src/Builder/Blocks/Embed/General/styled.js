import styled from "styled-components";

export const EmbedContianer = styled.div`
  margin: 16px 0;
  display: flex;
  outline: solid 0px ${props => props.theme.secondaryVivid};
  outline-width: ${props => (props.isFocused ? "4px" : "0px")};
  background: ${props => props.theme.readerAppSurface};
  border: 4px solid #ffffff;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0px 8px 10px rgba(88, 74, 47, 0.04),
    0px 4px 24px rgba(88, 74, 47, 0.07);
  transition: background 500ms ease-in-out;
  overflow: hidden;
  :hover {
    background: #fff;
  }
`;

export const EmbedTextContainer = styled.div`
  flex: 1;
`;

export const EmbedTitle = styled.div`
  font-family: Muli;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 24px;
  height: 24px;
  overflow: hidden;
  color: ${props => props.theme.app900};
  margin: 24px 32px 8px 32px;
  transition: color 500ms ease-out;
  transform-origin: top left;
  ${EmbedContianer}:hover & {
    color: #000;
  }
`;

export const EmbedDescription = styled.p`
  font-family: Libre Baskerville;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  height: 72px;
  overflow: hidden;
  color: ${props => props.theme.app600};
  margin: 0 32px;
  transition: color 500ms ease-out;
  transform-origin: top left;
  ${EmbedContianer}:hover & {
    color: #000;
  }
`;

export const EmbedUrlContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 32px 24px 32px;
  height: 16px;
  overflow: hidden;
  transition: color 500ms ease-out;
  transform-origin: top left;
  ${EmbedContianer}:hover & {
    color: #000;
  }
`;

export const EmbedFavicon = styled.img`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-right: 4px;
`;

export const EmbedUrl = styled.p`
  align-self: flex-start;
  font-family: Libre Baskerville;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 16px;
  color: ${props => props.theme.primary400};
  margin: 0;
`;

export const EmbedImage = styled.img`
  flex-basis: 176px;
  width: 176px;
  height: 176px;
  object-fit: cover;
  transition: transform 500ms ease-in-out;
  ${EmbedContianer}:hover & {
    transform: scale(1.1);
  }
`;
