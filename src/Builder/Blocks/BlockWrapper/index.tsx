import React from 'react';
import { Container, BlockContainer } from './styled';

function BlockWrapper({ attributes, element, children }) {
  const blockLayout = element.layout || 'inset';

  return (
    <Container {...attributes} blockLayout={blockLayout}>
      <BlockContainer id="block-container">{children}</BlockContainer>
    </Container>
  );
}

export default BlockWrapper;
