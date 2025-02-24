import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0;
  box-sizing: content-box;
  background: ${(props) => (props.isBlockSelected ? '#D9EAFF' : 'transparent')};
  *::selection {
    background: ${(props) =>
      props.isBlockSelected ? 'transparent' : '#D9EAFF'};
  }

  * {
    font-family: 'Noto Serif JP';
  }
`;

export const BlockContainer = styled.div`
  flex: 1;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 0;
  cursor: text;
`;
