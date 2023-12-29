import { useState } from "react";
import { Text, Flex, Button, useToast } from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { handleRoomJoin } from "../../pages";
import { useCookies } from "react-cookie";

interface Props {
  id: string;
  name: string;
  isProtected: boolean;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  onRoomJoinModalOpen: () => void;
}

function RoomCard(props: Props) {
  const { id, name, isProtected, onRoomJoinModalOpen, setSelectedRoomId } =
    props;
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const toast = useToast();
  const [cookies, setCookie, removeCookie] = useCookies(["playerId"]);

  return (
    <Flex
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Text>{name}</Text>
      <LockIcon />
      <Button
        size="xs"
        display={isHovering ? "inherit" : "none"}
        onClick={
          isProtected
            ? () => {
                setSelectedRoomId(id);
                onRoomJoinModalOpen();
              }
            : () =>
                handleRoomJoin(
                  id,
                  navigate,
                  toast,
                  cookies,
                  setCookie,
                  removeCookie
                )
        }
      >
        Join
      </Button>
    </Flex>
  );
}

export default RoomCard;
