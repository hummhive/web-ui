import styled from "styled-components";

export const A = styled.a`
  text-decoration: none;
  border-bottom: 1px solid;
  border-bottom-color: ${props => {
    if (props.isActive)
      return props.isEditor
        ? props.theme.secondaryVivid
        : props.theme.primary400;

    return "#d9d9ce";
  }};
  cursor: pointer;
  :visited {
    color: #333;
  }
`;
