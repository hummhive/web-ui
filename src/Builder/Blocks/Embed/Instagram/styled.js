import styled from "styled-components";

export const EmbedContianer = styled.div`
  position: relative;
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: solid 0px ${props => props.theme.secondaryVivid};
  outline-width: ${props => (props.isFocused ? "4px" : "0px")};
`;
