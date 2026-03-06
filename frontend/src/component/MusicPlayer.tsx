import React, { useEffect } from "react";

interface MusicPlayerProps {
  title?: string;
  artist?: string;
  image_url?: string;
  duration?: number;
  time?: number;
  is_playing?: boolean;
  votes?: number;
  votes_required?: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = (props) => {
  const pauseSong = async () => {
    await fetch("/spotify/pause", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const playSong = async () => {
    await fetch("/spotify/play", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const skipSong = async () => {
    console.log("votes = ", props.votes);
    await fetch("/spotify/skip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    console.log("Votes updated in UI:", props.votes);
  }, [props.votes]);

  // Calculate progress percentage for the bar
  const songProgress =
    props.time && props.duration ? (props.time / props.duration) * 100 : 0;

  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
      <div className="row g-0 align-items-center">
        {/* Album Art */}
        <div className="col-md-4 p-3">
          <img
            src={props.image_url || "https://via.placeholder.com/150"}
            className="img-fluid rounded-start shadow-sm"
            alt="Album Cover"
          />
        </div>

        {/* Song Info */}
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title mb-1 text-truncate">
              {props.title || "No Song Playing"}
            </h5>
            <p className="card-text text-muted mb-3">
              {props.artist || "Unknown Artist"}
            </p>

            {/* Controls */}
            <div className="d-flex justify-content-center align-items-center mb-3">
              <button
                className="btn btn-outline-secondary mx-2"
                onClick={() => (props.is_playing ? pauseSong() : playSong())}
              >
                <i
                  className={`bi ${props.is_playing ? "bi-pause-fill" : "bi-play-fill"}`}
                ></i>
              </button>
              <button
                className="btn btn-outline-secondary mx-2"
                onClick={() => skipSong()}
              >
                <i className="bi bi-skip-forward-fill"></i> {props.votes} /{" "}
                {props.votes_required}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card-footer bg-transparent border-0 px-3 pb-3">
        <div className="progress" style={{ height: "8px" }}>
          <div
            className={`progress-bar bg-primary ${
              props.is_playing
                ? "progress-bar-striped progress-bar-animated"
                : ""
            }`}
            role="progressbar"
            style={{ width: `${songProgress}%` }}
            aria-valuenow={songProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
