import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
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

const Chatbox = ({chatData}) => {
  console.log(chatData);
  //const [chatClient, setChatClient] = useState(null);
  //   const [showChatList, setShowChatList] = useState(true);
  //   const [channelId, setChannelId] = useState(null);
  const chatClient = StreamChat.getInstance("yubj5mxd7tx2");
  const userToken = chatData.chatToken;
    

  chatClient.connectUser(
    {
      id: chatData.user_id,
      name: "small",
      image: "https://getstream.io/random_png/?id=small-sound-9&name=small",
    },
    userToken
  );

  const channel = chatClient.channel("messaging", `${chatData.channel_id}`);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <div>
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
              <Chat client={chatClient} theme="messaging light">
                <Channel channel={channel}>
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                  </Window>
                  <Thread />
                </Channel>
              </Chat>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Chatbox;
