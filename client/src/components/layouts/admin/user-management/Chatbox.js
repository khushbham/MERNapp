import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { FiSearch } from "react-icons/fi";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";

const sort = { last_message_at: -1 };
// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 1),
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.common.white, 0.8),
//   },
//   marginRight: theme.spacing(2),
//   marginTop: 0,
//   height: 36,
//   marginLeft: 0,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: {
//     width: "100%",
//     borderRadius: "4px",
//     border: "solid 1px #ced4da",
//     FontSize: "12px",
//   },
// }));
// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   top: "0",
//   right: "0",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1, 5, 1, 1),
//     transition: theme.transitions.create("width"),
//     width: "100%",
//     [theme.breakpoints.up("md")]: {
//       width: "100%",
//     },
//   },
// }));
const Chatbox = ({ chatDetails }) => {
  const [chatClient, setChatClient] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const [channelId, setChannelId] = useState(null);
  const userToken = chatDetails.chatToken;

  const filters = {
    type: "messaging",
    members: { $in: [chatDetails.user._id] },
  };
  const CustomPreviewTitle = ({ channel }) => {
    return (
      <div
        className="userProfile d-flex w-100"
        onClick={() => {
          var channelSelected = chatClient.channel(
            "messaging",
            channel.data.id
          );
          setChannelId(channelSelected);

          setShowChatList(false);
        }}
      >
        <div className="d-flex">
          <Avatar
            alt="profileIcon"
            src={channel?.data?.mycustomfield?.cover_image}
          />
          <div className="ms-2">
            <Typography variant="h5" component="h5" className="UserName">
              {channel?.data?.mycustomfield?.channel_name}
            </Typography>
            <Typography paragraph={true} component="p" className="SubHeading">
              Members - {channel?.data?.member_count}
            </Typography>
          </div>
        </div>
        <div>
          <Typography paragraph={true} component="p" className="mb-0 chatTime">
            {channel.data.last_message_at
              ? channel.data.last_message_at.split("T")[0]
              : ""}
          </Typography>
        </div>
      </div>
    );
    // var username = (chatClient.activeChannels[`messaging:${channel.data.name}`].data.mycustomfield[myId]);
    //setChatName(username);
  };
  useEffect(() => {
    setChatClient(null);
    const initChat = async () => {
      
      const client = StreamChat.getInstance("yubj5mxd7tx2");
      //await client.disconnectUser();
      
      await client.connectUser(
        {
          id: chatDetails.user._id,
          name: chatDetails.user._id,
          image:
            "https://getstream.io/random_png/?id=61a638c3fdc80bf63a881b2d&name=61a638c3fdc80bf63a881b2d",
        },
        userToken
      );

      setChatClient(client);
      // const channel = client.channel('messaging', 'custom_channel_id', {
      //   // add as many custom fields as you'd like
      //   image: 'https://www.drupal.org/files/project-images/react.png',
      //   name: 'Talk about React',
      //   members: ['61a638c3fdc80bf63a881b2d'],
      // });
      // const update = await channel.update(
      //   { frozen: true },
      //   { text: 'Thierry has frozen the channel', user_id: "Thierry" }
      // )
    };

    initChat();
  }, [chatDetails]);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      {/* <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h6" component="h6">
            Search
          </Typography>
          <FormControl variant="standard">
            <Search>
              <StyledInputBase
                placeholder="By user or keyword"
                inputProps={{ "aria-label": "search" }}
              />
              <SearchIconWrapper>
                <FiSearch />
              </SearchIconWrapper>
            </Search>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" component="h6">
            Filter by Flagged
          </Typography>
          <FormControl component="fieldset" className="d-flex radioBtn">
            <RadioGroup
              aria-label="gender"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value=""
                control={<Radio />}
                label="Show Flagged Only"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid> */}
      <div className="chatWrap">
        <Grid container className="ChatHistoryWrap">
          <Grid item xs={12} sm={12}>
            <style
              dangerouslySetInnerHTML={{
                __html:
                  "\n.str-chat__channel-list-messenger{\nmin-width: 275px !important;\n    background: #ffffff !important;\n}\n.str-chat.messaging, .str-chat.commerce {\n    background-color: transparent !important;\n}\n",
              }}
            />
            <div className="userProfile d-flex w-100 clint-chtnt">
              <Chat client={chatClient} className="clint-cht">
                {showChatList && (
                  <ChannelList
                    //showChannelSearch
                    filters={filters}
                    sort={sort}
                    Preview={(previewProps) => (
                      <CustomPreviewTitle {...previewProps} />
                    )}
                    //onSelect={(e) => console.log(e)}
                  />
                )}
                {!showChatList && (
                  <>
                    <Channel channel={channelId}>
                      <Window>
                        <p onClick={() => setShowChatList(true)} className="go-bck-opt">Go Back</p>

                        <ChannelHeader />
                        <MessageList />
                      </Window>
                      <Thread />
                    </Channel>
                  </>
                )}
              </Chat>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Chatbox;
