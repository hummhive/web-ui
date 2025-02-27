import React from 'react';

const Video = (props) => {
  return (
    <div>
            <iframe
              src={props.element.url}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', aspectRatio: '16 / 9' }}
            />
      </div>
  );
};

export default Video;
