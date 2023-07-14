import { useState, useEffect } from "react";
import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import Video from "./Video";
import Controls from "./Controls";

export default function VideoCall(props) {
  const { setInCall, appId,token , channelName} = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
   const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
   const useClient = createClient(config);
   const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      try {

        await client.join(config.appId, name, config.token, null);
      } catch (error) {
        console.log("error");
      }

      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      try {
        init(channelName);
      } catch (error) {
        console.log(error);
      }
    }
  
  }, [ready]);

  return (
    <div container direction="column" style={{ height: "100%" }}>
      <div items>
        {ready && tracks && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </div>
      <div item style={{ height: "100%" }}>
        {start && tracks && <Video tracks={tracks} users={users} />}
      </div>
    </div>
  );
}
