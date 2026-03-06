import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import Home from "./Home";
import Room from "./Room";
import ErrorPage from "./ErrorPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function HomePage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/join" element={<RoomJoinPage />} />

        <Route path="/create" element={<CreateRoomPage />} />

        <Route path="/room/:roomCode" element={<Room />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default HomePage;
