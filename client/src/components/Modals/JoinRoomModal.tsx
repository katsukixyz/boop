import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { handleRoomJoin } from "../../pages";
import { useCookies } from "react-cookie";

interface Props {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
}

function JoinRoomModal(props: Props) {
  const { roomId, isOpen, onClose } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [cookies, setCookie, removeCookie] = useCookies(["playerId"]);

  async function onSubmit() {
    handleRoomJoin(
      roomId,
      navigate,
      toast,
      cookies,
      setCookie,
      removeCookie,
      inputRef.current?.value ?? ""
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input ref={inputRef} />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onSubmit}>
            Join
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default JoinRoomModal;
