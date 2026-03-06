import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  votesTo_Skip?: number;
  guestCan_Pause?: boolean;
  update?: boolean;
  roomCode?: string | null;
}

function CreateRoomPage({
  votesTo_Skip = 2,
  guestCan_Pause = true,
  update = false,
  roomCode = null,
}: Props) {
  const [guestCanPause, setGuestCanPause] = useState(guestCan_Pause);
  const [votesToSkip, setVotesToSkip] = useState(votesTo_Skip);
  const [errorMsg, setErrorMsg] = useState("");
  const [sucessMsg, setSucessMsg] = useState("");
  const navigate = useNavigate();

  const submitButtonClicked = async () => {
    const response = await fetch("/api/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    });

    const data = await response.json();
    navigate(`/room/${data.code}`);
  };

  const updateButtonClicked = async () => {
    const response = await fetch("/api/update-room", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
    });

    if (response.ok) {
      setSucessMsg("Room Updated Successfully");
    } else {
      setErrorMsg("Error Updating Room ...");
    }
  };

  function renderCreateButtons() {
    return (
      <div className="mt-4 text-center">
        <button className="btn btn-primary mb-3" onClick={submitButtonClicked}>
          Create A Room
        </button>
        <br />
        <Link to="/" className="btn btn-danger">
          Back
        </Link>
      </div>
    );
  }

  function renderUpdateButtons() {
    return (
      <div className="mt-4 text-center">
        <button className="btn btn-primary" onClick={updateButtonClicked}>
          Update Room
        </button>
      </div>
    );
  }

  const title = update ? "Update Room" : "Create a Room";

  return (
    <>
      {/* ALERT (layout-only fix) */}
      {(sucessMsg || errorMsg) && (
        <div className="container mt-3">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div
                className="alert alert-success alert-dismissible fade show text-center"
                role="alert"
              >
                {errorMsg === "" ? sucessMsg : errorMsg}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSucessMsg("")}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM */}
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 text-center">
            <h4>{title}</h4>

            <small className="text-muted d-block mb-3">
              Guest Control of Playback State
            </small>

            <div className="d-flex justify-content-center gap-4 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="guest_can_pause"
                  checked={guestCanPause === true}
                  onChange={() => setGuestCanPause(true)}
                />
                <label className="form-check-label">Play / Pause</label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="guest_can_pause"
                  checked={guestCanPause === false}
                  onChange={() => setGuestCanPause(false)}
                />
                <label className="form-check-label">No Control</label>
              </div>
            </div>

            <div className="row justify-content-center mt-3">
              <div className="col-6 col-md-4 col-lg-6 text-center">
                <input
                  type="number"
                  className="form-control text-center"
                  min={1}
                  value={votesToSkip}
                  onChange={(e) => setVotesToSkip(Number(e.target.value))}
                />

                <small className="text-muted d-block mt-1">
                  Votes Required To Skip Song
                </small>
              </div>
            </div>

            {update ? renderUpdateButtons() : renderCreateButtons()}
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateRoomPage;
