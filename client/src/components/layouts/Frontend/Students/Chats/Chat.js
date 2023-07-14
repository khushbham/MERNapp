import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import StudentNavbar from "../StudentNavbar";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  LoadingIndicator,
  VirtualizedMessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import { useDispatch } from "react-redux";
import {
  getChatToken,
  getFrontUserDetail,
  blockUnblockChannelStatus,
  blockUnblockChannel,
} from "../../../../../actions/frontent";

const MyChat = () => {
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(window.location.search);
  var channelIdFromUrl = urlParams.get("channel_id");
  const [chatClient, setChatClient] = useState(null);
  const [individualChannels, setIndividualChannels] = useState([]);
  const [channelId, setChannelId] = useState(null);
  const [channelIdForBlock, setChannelIdForBlock] = useState(null);
  const [channelTitle, setChannelTitle] = useState(null);
  const [channelImage, setChannelImage] = useState(null);
  const [showBlockButton, setShowBlockButton] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [channelBlockingDetails, setChannelBlockingDetails] = useState(null);

  useEffect(() => {
    dispatch(getChatToken())
      .then((res) => {
        console.log(res.data, "data");
        if (res && res.data) {
          const client = StreamChat.getInstance("yubj5mxd7tx2");
          client.connectUser(
            {
              id: res.data.user?._id,
              name: res.data.user?.first_name,
              image: res.data.user?.profile_image,
            },
            res.data.chatToken
          );
          setChatClient(client);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    dispatch(getFrontUserDetail()).then((res) => {
      if (res && res.success) {
        setIndividualChannels(res.data);
      }
    });
  }, []);
  useEffect(() => {
    if (channelIdFromUrl && chatClient) {
      var newArrayFirst = individualChannels.filter(function (el) {
        return el._id == channelIdFromUrl;
      });
      if (newArrayFirst.length > 0) {
        console.log(newArrayFirst);
        selectChannel(
          channelIdFromUrl,
          newArrayFirst[0]?.teacher_id?.first_name,
          newArrayFirst[0]?.teacher_id?.profile_image,
          true,
          newArrayFirst[0]?.teacher_id?._id
        );
      }
    }
  }, [channelIdFromUrl, individualChannels, chatClient]);
  const filters = {
    type: "messaging",
    members: { $in: [chatClient?.user?.id] },
  };
  const options = { state: true, presence: true, limit: 10 };
  const sort = { last_message_at: -1 };
  const messageActions = !chatClient?.user?.id
    ? ["edit", "delete", "quote"]
    : ["flag", "react", "reply", "mute"];
  if (!chatClient) {
    return <LoadingIndicator />;
  }
  const CustomChannelPreview = ({ channel, latestMessage }) => {
    // "lastMessage" property is for the last
    // message that has been interacted with (pinned/edited/deleted)

    // to display last message of the channel use "latestMessage"
    if (channel?.data?.mycustomfield?.channel_name) {
      return (
        <button
          aria-label="Select Channel: Fitness class"
          aria-selected="false"
          className="str-chat__channel-preview-messenger  "
          data-testid="channel-preview-button"
          role="option"
          onClick={() =>
            selectChannel(
              channel.id,
              channel?.data?.mycustomfield?.channel_name,
              channel?.data?.mycustomfield?.cover_image,
              false,
              null
            )
          }
        >
          <div className="str-chat__channel-preview-messenger--left">
            <div
              className="str-chat__avatar str-chat__avatar--circle"
              data-testid="avatar"
              title="Fitness class"
              style={{
                flexBasis: "40px",
                fontSize: "20px",
                height: "40px",
                lineHeight: "40px",
                width: "40px",
              }}
            >
              <img
                alt="F"
                className="str-chat__avatar-image str-chat__avatar-image--loaded"
                data-testid="avatar-img"
                src={channel?.data?.mycustomfield?.cover_image}
                style={{
                  flexBasis: "40px",
                  height: "40px",
                  objectFit: "cover",
                  width: "40px",
                }}
              />
            </div>
          </div>
          <div className="str-chat__channel-preview-messenger--right">
            <div className="str-chat__channel-preview-messenger--name">
              <span>{channel?.data?.mycustomfield?.channel_name}</span>
            </div>
            <div className="str-chat__channel-preview-messenger--last-message">
              <p>{latestMessage}</p>
            </div>
          </div>
        </button>
      );
    } else {
      var newArray = individualChannels.filter(function (el) {
        return el._id == channel.id;
      });
      if (newArray.length > 0) {
        return (
          <button
            aria-label="Select Channel: Fitness class"
            aria-selected="false"
            className="str-chat__channel-preview-messenger  "
            data-testid="channel-preview-button"
            role="option"
            onClick={() =>
              selectChannel(
                channel.id,
                newArray[0]?.teacher_id?.first_name,
                newArray[0]?.teacher_id?.profile_image,
                true,
                newArray[0]?.teacher_id?._id
              )
            }
          >
            <div className="str-chat__channel-preview-messenger--left">
              <div
                className="str-chat__avatar str-chat__avatar--circle"
                data-testid="avatar"
                title="Fitness class"
                style={{
                  flexBasis: "40px",
                  fontSize: "20px",
                  height: "40px",
                  lineHeight: "40px",
                  width: "40px",
                }}
              >
                <img
                  alt="F"
                  className="str-chat__avatar-image str-chat__avatar-image--loaded"
                  data-testid="avatar-img"
                  src={newArray[0]?.teacher_id?.profile_image}
                  style={{
                    flexBasis: "40px",
                    height: "40px",
                    objectFit: "cover",
                    width: "40px",
                  }}
                />
              </div>
            </div>
            <div className="str-chat__channel-preview-messenger--right">
              <div className="str-chat__channel-preview-messenger--name">
                <span>{newArray[0]?.teacher_id?.first_name}</span>
              </div>
              <div className="str-chat__channel-preview-messenger--last-message">
                <p>{latestMessage}</p>
              </div>
            </div>
          </button>
        );
      } else {
        return <p></p>;
      }

      //return <p>{e?.activeChannel?._client?.userID}</p>;
    }
  };
  const selectChannel = (
    channelID,
    title,
    image,
    blockButtonCondition,
    accountID
  ) => {
    var channelData = chatClient.channel("messaging", channelID);
    setChannelId(channelData);
    setChannelTitle(title);
    setChannelImage(image);
    setShowBlockButton(blockButtonCondition);
    setTeacherId(accountID);
    if (blockButtonCondition) {
      dispatch(blockUnblockChannelStatus(channelID)).then((res) => {
        if (res && res.success) {
          setChannelBlockingDetails(res.data);
          setChannelIdForBlock(channelID);
        }
      });
    }
  };
  const blockUnblockUser = (blockingStatus) => {
    var blockData = {};
    blockData.teacher_id = teacherId;
    blockData.frozen_channel = blockingStatus;
    dispatch(blockUnblockChannel(blockData)).then((res) => {
      if (res && res.success) {
        dispatch(blockUnblockChannelStatus(channelIdForBlock)).then((res) => {
          if (res && res.success) {
            setChannelBlockingDetails(res.data);
          }
        });
      }
    });
  };
  return (
    <Box>
      <StudentNavbar />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n.chat_start_screen {\n    height: 100vh;\n    vertical-align: middle;\n    padding-top: 200px;\n    text-align: center;\n    }\n .str-chat__header-livestream-left--members{\n    display: none;\n    }\n",
        }}
      />
      <Chat
        client={chatClient}
        style={{ width: "20%" }}
        theme="messaging light"
      >
        <ChannelList
          options={options}
          sort={sort}
          filters={filters}
          Preview={CustomChannelPreview}
        />
        {!channelId && <ChannelHeader />}
        {/* <ChannelList filters={filters} sort={sort} options={options} /> */}
        {channelId ? (
          <Channel channel={channelId}>
            <Window>
              <Grid container className="student-chat-area-teacher">
                <Grid item xs={7} sm={6} md={6} lg={8} className="px-3">
                  <ChannelHeader
                    className="student-chat-header"
                    title={channelTitle}
                    image={channelImage}
                  />
                </Grid>
                <Grid
                  item
                  xs={5}
                  sm={6}
                  md={6}
                  lg={4}
                  className="text-right-student px-3"
                >
                  {showBlockButton && channelBlockingDetails?.showInputField && (
                    <Button
                      variant="contained"
                      onClick={() =>
                        blockUnblockUser(
                          !channelBlockingDetails?.blockStatusForStudent
                        )
                      }
                    >
                      {!channelBlockingDetails?.blockStatusForStudent
                        ? "Block"
                        : "Unblock"}
                    </Button>
                  )}
                </Grid>
              </Grid>

              <VirtualizedMessageList
                messageActions={messageActions}
                name={"name"}
              />
              {channelBlockingDetails?.showInputField && <MessageInput focus />}
            </Window>
            <Thread />
          </Channel>
        ) : (
          <div className="bg-light chat_start_screen">
            Please click on chat list to review messages
          </div>
        )}
      </Chat>
    </Box>
  );
};

export default MyChat;
