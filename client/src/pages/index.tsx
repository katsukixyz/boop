import {
  Box,
  Button,
  CreateToastFnReturn,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Room } from "@backend/node_modules/@prisma/client";
import CreateRoomModal from "../components/Modals/CreateRoomModal";
import RoomCard from "../components/Room/RoomCard";
import JoinRoomModal from "../components/Modals/JoinRoomModal";
import { NavigateFunction } from "react-router";
import { useCookies } from "react-cookie";

export async function handleRoomJoin(
  roomId: string,
  navigate: NavigateFunction,
  toast: CreateToastFnReturn,
  cookies: ReturnType<typeof useCookies<"playerId">>[0],
  setCookie: ReturnType<typeof useCookies<"playerId">>[1],
  removeCookie: ReturnType<typeof useCookies<"playerId">>[2],
  password?: string
) {
  const input: { id: string; password?: string } = { id: roomId };
  if (password) input.password = password;
  const req = await fetch("http://localhost:4673/room/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: roomId,
      password,
      playerId: cookies.playerId,
    }),
  });
  const data = await req.json();
  if (!req.ok) {
    toast({
      title: "An error has occurred",
      description: data.message,
      status: "error",
      position: "top",
    });
    return;
  }
  removeCookie("playerId");
  setCookie("playerId", data.playerId);
  navigate(`/room/${roomId}`);
}

function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isJoinModalOpen,
    onOpen: onJoinModalOpen,
    onClose: onJoinModalClose,
  } = useDisclosure();
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:4673/room/").then((data) => {
      data.json().then((rooms) => setRooms(rooms));
    });
  }, []);

  return (
    <>
      <Box w="100%" h="100%">
        <Heading size="3xl">boop.</Heading>
        <Text fontSize="2xl" fontWeight="semibold">
          Rooms
        </Text>
        <Button size="sm" onClick={onOpen}>
          Create room
        </Button>
        <Stack direction="column">
          {rooms?.map((room) => {
            return (
              <RoomCard
                key={room.id}
                name={room.name}
                id={room.id}
                isProtected={room.protected}
                onRoomJoinModalOpen={onJoinModalOpen}
                setSelectedRoomId={setSelectedRoomId}
              />
            );
          })}
        </Stack>
      </Box>
      <CreateRoomModal isOpen={isOpen} onClose={onClose} />
      {selectedRoomId ? (
        <JoinRoomModal
          roomId={selectedRoomId}
          isOpen={isJoinModalOpen}
          onClose={onJoinModalClose}
        />
      ) : null}
    </>
  );
}

export default Home;
