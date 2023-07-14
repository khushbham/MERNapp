import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "2147948d77dd4f0cb6fc4729cb0a5521";
const token =
  "007eJxTYOCVY6k8WFI8+aXYbO8tbBdaL33/1n+j4aFQ6AwhC0UBfxEFhpQUU7Nky6S0VHNDMxMTczMLM8s0w8RUizRzAyOzxESzk5z8yZ7RAsntl/UYGKEQxGdnKEktLsnMS2dgAAA+yR9X";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "testing";
