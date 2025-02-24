import styled from "styled-components";

export const Quote = styled.blockquote`
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 40px;
  letter-spacing: 0.15px;
  color: #89897e;
  padding: 0 24px;
  margin: 16px 0;
  border-left: 4px solid ${props => props.theme.app300};
`;
