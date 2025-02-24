import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${props => props.height && `${props.height}px` || 'auto'};
  min-height: ${props => !props.height && `100px` || 'auto'};
  background: rgba(0, 0, 0, 0.06);
  margin: 16px 0;

  p {
    margin: 0;
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.3em;
  }
`;

export const Image = styled.img`
  width: 100%;
  height: auto;
  min-height: 100px;
  background: ${props => props.theme.rowDivider};
  cursor: default;
`;
