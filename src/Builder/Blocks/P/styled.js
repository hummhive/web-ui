import styled from 'styled-components';

export const P = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 32px;
  letter-spacing: 0.15px;
  padding: 0;
  margin: ${(props) => (props.dense ? '0' : '16px')} 0;

  @media only screen and (min-width: 480px) and (max-width: 720px) {
    font-size: 18px;
  }

  @media only screen and (max-width: 480px) {
    font-size: 16px;
  }
`;

export const Placeholder = styled(P)`
  position: absolute;
  top: 0;
  pointer-events: none;
  color: ${(props) => props.theme.app300};
`;
