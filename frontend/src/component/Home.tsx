import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRoom = async () => {
      try {
        const response = await fetch("/api/user-in-room");
        const data = await response.json();

        if (data.room_code) {
          navigate(`/room/${data.room_code}`);
        }
      } catch (error) {
        console.error("Failed to check user room", error);
      }
    };

    checkUserRoom();
  }, [navigate]);

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="mb-4">House Party</h1>

        <div className="d-flex gap-3 justify-content-center">
          <Link to="/join" className="btn btn-primary btn-lg">
            Join a Room
          </Link>

          <Link to="/create" className="btn btn-danger btn-lg">
            Create a Room
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
