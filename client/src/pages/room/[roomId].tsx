import { Box, Button, Text } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router";
import { ChevronLeftIcon } from "@chakra-ui/icons";

function onBeforeUnload(event: BeforeUnloadEvent) {
  event.returnValue = true;
}

function RoomPage() {
  const { roomId } = useParams();
  const [cookies, _setCookie, _removeCookie] = useCookies(["playerId"]);

  const onUnload = useCallback(async () => {
    await fetch("http://localhost:4673/room/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId,
        playerId: cookies.playerId,
      }),
      keepalive: true,
    });
  }, [roomId]);

  useEffect(() => {
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("unload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("unload", onUnload);
    };
  });

  return (
    <Box>
      <Button
        leftIcon={<ChevronLeftIcon />}
        onClick={() => (window.location.href = "/")}
      >
        Leave room
      </Button>
      <Text>{roomId}</Text>
    </Box>
  );
}

export default RoomPage;
