// import { useState } from "react";
// import { Button } from "@material-ui/core";

// import VideoCall from "./VideoCall";
// import { useLocation } from "react-router-dom";

// function VideoClass() {
//   const location = useLocation()
//   const [inCall, setInCall] = useState(false);
//  const token = location.state.token;
//  const appId = location.state.appId;
//  const channelName = location.state.channelName;
//   return (
//     <div className="App" style={{ height: "100%" }}>
//       {inCall ? (
//         <VideoCall 
//         setInCall={setInCall} 
//         token={token}
//         appId={appId} 
//         channelName={channelName}
//         />
//       ) : (
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setInCall(true)}
//         >
//           Join Call
//         </Button>
//       )}
//     </div>
//   );
// }

// export default VideoClass;
