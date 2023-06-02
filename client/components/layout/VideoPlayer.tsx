import ReactPlayer from "react-player";

type ProgrssProps = {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
};

type VideoPlayerProps = {
  url: string;
  onEnded?: () => void;
  onStart?: () => void;
  onProgress?: (progress: ProgrssProps) => void
  playing?: boolean,
  t?:any
};

function VideoPlayer({t, url, onEnded, onStart, onProgress, playing = true }:VideoPlayerProps) {
  const handleOnStart = () => {
    if (onStart) {
      onStart();
    } else {
    }
  };
  const handleOnEnded = () => {
    if (onEnded) {
      onEnded();
    } else {
    }
  };
  const handleOnProgress = (progress: ProgrssProps) => {
    if (onProgress) {
      onProgress(progress);
    } else {
    }
  };

  return (
    <div className="w-full h-full">
      <ReactPlayer
        playing={playing}
        onProgress={(progress) => handleOnProgress(progress)}
        onEnded={() => handleOnEnded()}
        height={"100%"}
        width={"100%"}
        onStart={() => handleOnStart()}
        url={url}
        volume={1}
        config={{
          vimeo: {
            playerOptions: {
              autoplay: true,
              title: false,
              playsinline: true,
              quality: "360p",
              texttrack: t?.("textTrack"),
            },
          },
        }}
      />
    </div>
  );
}

export default VideoPlayer;
