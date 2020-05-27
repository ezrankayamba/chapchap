import React, { useEffect } from "react";

function VideoBox({ id, stream }) {
  useEffect(() => {
    let video = document.getElementById(id);
    video.srcObject = stream;
    video.play();
  }, []);
  return (
    <div className="video-box">
      <video id={id}></video>
    </div>
  );
}

export default VideoBox;
