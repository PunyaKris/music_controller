import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError("Room code cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/join-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: roomCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        // backend tells us exactly what went wrong
        setError(data.error || "Something went wrong");
        return;
      }

      navigate(`/room/${roomCode}`);
    } catch {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div style={{ width: "420px" }}>
        <h2 className="text-center mb-4">Join a Room</h2>

        <div className="mb-3">
          <label className="form-label">Code</label>

          <input
            type="text"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Enter a Room Code"
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value);
              if (error) setError(null);
            }}
          />

          {error && <div className="invalid-feedback">{error}</div>}
        </div>

        <div className="d-grid gap-3 mt-4">
          <button className="btn btn-primary" onClick={handleJoinRoom}>
            Join Room
          </button>

          <Link to="/" className="btn btn-danger">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomJoinPage;
