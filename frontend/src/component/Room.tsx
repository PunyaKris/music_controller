import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room() {
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});

  // --- HIGHLIGHT: Define this BEFORE the useEffect to fix the red line ---
  const getCurrentSong = useCallback(async () => {
    try {
      const response = await fetch("/spotify/current-song");

      if (!response.ok) {
        return {};
      }
      const data = await response.json();
      setSong(data);
    } catch (error) {
      console.error("Error fetching current song:", error);
    }
  }, []); // Dependencies are empty as it doesn't rely on other state

  const authenticateSpotify = useCallback(async () => {
    try {
      const response = await fetch("/spotify/is-authenticated");
      const data = await response.json();
      setSpotifyAuthenticated(data.status);

      if (!data.status) {
        const urlResponse = await fetch("/spotify/get-auth-url");
        const urlData = await urlResponse.json();
        window.location.replace(urlData.url);
      }
    } catch (error) {
      console.error("Error with Spotify Auth:", error);
    }
  }, []);

  console.log("spotifyAuthenticated = ", spotifyAuthenticated);

  const leaveRoom = async () => {
    await fetch("/api/leave-room", { method: "POST" });
    navigate("/");
  };

  useEffect(() => {
    if (!roomCode) return;

    const fetchRoomDetails = async () => {
      const response = await fetch(`/api/get-room/${roomCode}`);
      if (!response.ok) {
        navigate("/");
        return;
      }
      const data = await response.json();
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);

      if (data.is_host) {
        authenticateSpotify();
      }
    };

    fetchRoomDetails();

    // --- HIGHLIGHT: This should no longer have a red line ---
    const interval = setInterval(() => {
      getCurrentSong();
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount

    // HIGHLIGHT: Ensure getCurrentSong is in this array
  }, [roomCode, navigate, authenticateSpotify, getCurrentSong]);

  function renderSettingsButton() {
    return (
      <button className="btn btn-primary" onClick={() => setShowSettings(true)}>
        Settings
      </button>
    );
  }

  function renderSetting() {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-7 text-center">
            <CreateRoomPage
              update={true}
              votesTo_Skip={votesToSkip}
              guestCan_Pause={guestCanPause}
              roomCode={roomCode}
            />
            <div className="mt-1">
              <button
                className="btn btn-danger"
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSettings) return <>{renderSetting()} </>;

  return (
    <div className="text-center">
      <h3>Code: {roomCode}</h3>
      {/* <pre className="text-start bg-light p-3">
        {JSON.stringify(song, null, 2)}
      </pre> */}
      <MusicPlayer {...song} />
      <div className="d-grid gap-3 mt-4">
        {isHost ? renderSettingsButton() : null}
        <button className="btn btn-danger" onClick={leaveRoom}>
          Leave Room
        </button>
      </div>
    </div>
  );
}

export default Room;

// import { useEffect, useState, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import CreateRoomPage from "./CreateRoomPage";
// // import MusicPlayer from "./MusicPlayer"; // HIGHLIGHT: Import your player component

// function Room() {
//   const navigate = useNavigate();
//   const { roomCode } = useParams();

//   const [votesToSkip, setVotesToSkip] = useState(2);
//   const [guestCanPause, setGuestCanPause] = useState(false);
//   const [isHost, setIsHost] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);

//   // --- HIGHLIGHT: New State for Song Data ---
//   const [song, setSong] = useState({});

//   // --- HIGHLIGHT: Updated Async/Await getCurrentSong ---
//   const getCurrentSong = useCallback(async () => {
//     try {
//       const response = await fetch("/spotify/current-song");
//       if (!response.ok) {
//         return {};
//       }
//       const data = await response.json();
//       setSong(data);
//     } catch (error) {
//       console.error("Error fetching current song:", error);
//     }
//   }, []);

//   const authenticateSpotify = useCallback(async () => {
//     try {
//       const response = await fetch("/spotify/is-authenticated");
//       const data = await response.json();
//       setSpotifyAuthenticated(data.status);

//       if (!data.status) {
//         const urlResponse = await fetch("/spotify/get-auth-url");
//         const urlData = await urlResponse.json();
//         window.location.replace(urlData.url);
//       }
//     } catch (error) {
//       console.error("Error with Spotify Auth:", error);
//     }
//   }, []);

//   console.log(spotifyAuthenticated);

//   const leaveRoom = async () => {
//     await fetch("/api/leave-room", { method: "POST" });
//     navigate("/");
//   };

//   useEffect(() => {
//     if (!roomCode) return;

//     const fetchRoomDetails = async () => {
//       const response = await fetch(`/api/get-room/${roomCode}`);
//       if (!response.ok) {
//         navigate("/");
//         return;
//       }
//       const data = await response.json();
//       setVotesToSkip(data.votes_to_skip);
//       setGuestCanPause(data.guest_can_pause);
//       setIsHost(data.is_host);

//       if (data.is_host) {
//         authenticateSpotify();
//       }
//     };

//     fetchRoomDetails();

//     // --- HIGHLIGHT: Polling Setup ---
//     // Fetch immediately then poll every 1 second
//     getCurrentSong();
//     const interval = setInterval(getCurrentSong, 1000);

//     // Cleanup interval on unmount
//     return () => clearInterval(interval);
//   }, [roomCode, navigate, authenticateSpotify, getCurrentSong]);

//   function renderSettingsButton() {
//     return (
//       <button className="btn btn-primary" onClick={() => setShowSettings(true)}>
//         Settings
//       </button>
//     );
//   }

//   function renderSetting() {
//     return (
//       <div className="container mt-4">
//         <div className="row justify-content-center">
//           <div className="col-md-7 text-center">
//             <CreateRoomPage
//               update={true}
//               votesTo_Skip={votesToSkip}
//               guestCan_Pause={guestCanPause}
//               roomCode={roomCode}
//             />
//             <div className="mt-1">
//               <button
//                 className="btn btn-danger"
//                 onClick={() => setShowSettings(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (showSettings) return <>{renderSetting()} </>;

//   return (
//     <div className="text-center">
//       <h3>Code: {roomCode}</h3>

//       {/* --- HIGHLIGHT: Render the Music Player --- */}
//       {/* <MusicPlayer {...song} /> */}
//       <pre className="text-start bg-light p-3">
//         {JSON.stringify(song, null, 2)}
//       </pre>

//       <div className="d-grid gap-3 mt-4">
//         {isHost ? renderSettingsButton() : null}
//         <button className="btn btn-danger" onClick={leaveRoom}>
//           Leave Room
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Room;

// import { useEffect, useState, useCallback } from "react"; // Added useCallback
// import { useParams, useNavigate } from "react-router-dom";
// import CreateRoomPage from "./CreateRoomPage";

// function Room() {
//   const navigate = useNavigate();
//   const { roomCode } = useParams();

//   const [votesToSkip, setVotesToSkip] = useState(2);
//   const [guestCanPause, setGuestCanPause] = useState(false);
//   const [isHost, setIsHost] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const [song, setSong] = useState({})

//   // NEW: State to track if Spotify is authenticated [00:49:52]
//   const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);

//   // NEW: Modern implementation of authenticateSpotify using async/await [00:50:55]

//   const getCurrentSong = async () => {
//     currentSong = fetch()
//   }

//   const authenticateSpotify = useCallback(async () => {
//     try {
//       const response = await fetch("/spotify/is-authenticated");
//       const data = await response.json();
//       setSpotifyAuthenticated(data.status); // data.status is the boolean from backend [00:51:50]

//       if (!data.status) {
//         // If not authenticated, get the URL and redirect the whole browser [00:52:15]
//         const urlResponse = await fetch("/spotify/get-auth-url");
//         const urlData = await urlResponse.json();

//         // Native JS redirect to Spotify's login page [00:53:35]
//         window.location.replace(urlData.url);
//       }
//     } catch (error) {
//       console.error("Error with Spotify Auth:", error);
//     }
//   }, []);

//   const leaveRoom = async () => {
//     await fetch("/api/leave-room", {
//       method: "POST",
//     });
//     navigate("/");
//   };

//   useEffect(() => {
//     if (!roomCode) return;

//     const fetchRoomDetails = async () => {
//       const response = await fetch(`/api/get-room/${roomCode}`);

//       if (!response.ok) {
//         navigate("/");
//         return;
//       }
//       const data = await response.json();

//       setVotesToSkip(data.votes_to_skip);
//       setGuestCanPause(data.guest_can_pause);
//       setIsHost(data.is_host);

//       // NEW: If user is the host, trigger the Spotify authentication flow [00:50:32]
//       if (data.is_host) {
//         authenticateSpotify();
//       }
//     };

//     fetchRoomDetails();
//     // Added authenticateSpotify to dependency array for best practice
//   }, [roomCode, navigate, authenticateSpotify]);

//   function renderSettingsButton() {
//     return (
//       <button className="btn btn-primary" onClick={() => setShowSettings(true)}>
//         Settings
//       </button>
//     );
//   }

//   function renderSetting() {
//     return (
//       <div className="container mt-4">
//         <div className="row justify-content-center">
//           <div className="col-md-7 text-center">
//             <CreateRoomPage
//               update={true}
//               votesTo_Skip={votesToSkip}
//               guestCan_Pause={guestCanPause}
//               roomCode={roomCode}
//             />
//             <div className="mt-1">
//               <button
//                 className="btn btn-danger"
//                 onClick={() => setShowSettings(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (showSettings) return <>{renderSetting()} </>;

//   return (
//     <div>
//       <h3>Code: {roomCode}</h3>
//       {/* <p>Votes: {votesToSkip}</p>
//       <p>Guest can pause: {guestCanPause ? "Yes" : "No"}</p>
//       <p>Host: {isHost ? "Yes" : "No"}</p>

//       {/* Optional: Visual indicator for Spotify status */}
//       {/* {isHost && <p>Spotify Connected: {spotifyAuthenticated ? "✅" : "❌"}</p>} */} */}

//       <div className="d-grid gap-3 mt-4">
//         <>{isHost ? renderSettingsButton() : null}</>
//         <button className="btn btn-danger" onClick={leaveRoom}>
//           Leave Room
//         </button>
//       </div>
//     </div>
//   );
// }
// export default Room;
