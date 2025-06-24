import { useRef, useEffect } from "react";

function VideoBackground({ isPlaying }: { isPlaying: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  return (
    <video
      ref={videoRef}
      src="/voice-chatbot/speaking.mp4"
      loop
      muted
      playsInline
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 0,
      }}
    />
  );
}

export default VideoBackground;
