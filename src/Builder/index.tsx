import React from 'react';
import Blocks from './Blocks';
import Leafs from './Leafs';


type ElementType = {
  children?: ElementType[];
  text?: string;
  id: string; 
};

const Builder: React.FC<{ element: ElementType }> = ({ element }) => {

  if (!element.children) {
    return <Leafs leaf={element}>{element.text}</Leafs>;
  }

  return (
    <Blocks element={element}>
      {element.children.map((childElement) => (
        <Builder key={childElement.id} element={childElement} />
      ))}
    </Blocks>
  );
};

export default Builder;
