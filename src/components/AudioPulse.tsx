import "./AudioPulse.css";

export default function AudioPulse({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className={`audio-pulse${isPlaying ? " pulse" : ""}`}>
    </div>
  );
}