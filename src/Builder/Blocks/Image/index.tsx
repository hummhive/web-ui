import React from 'react';
// import useMetadata from '../../../../hooks/useMetadata';
// import Loader from '../../../../Components/Loader';
import { Image, Container } from './styled';
// import useBlob from '../../../../hooks/useBlob';

const ImageBlock = (props) => {
  /*
  const { metadata, isLoading, error } = useMetadata(
    props.element.variantMetadataIds.large
  );
  */
  // const blob = useBlob(metadata?.content.hash, metadata?.content.secretKey);

  const [height, setHeight] = React.useState(null);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleResize = () => {
      if (!props.element.aspectRatio) return;
      setHeight(ref.current.offsetWidth / props.element.aspectRatio);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [ref.current]);

  const src = props.element.src;

  return (
    <Container ref={ref} height={height}>
    <Image src={src} />
    </Container>
  );
};

export default ImageBlock;
