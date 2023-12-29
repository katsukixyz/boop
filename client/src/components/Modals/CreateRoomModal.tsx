import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  Input,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function CreateRoomModal(props: Props) {
  const { isOpen, onClose } = props;
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [_cookies, setCookie, removeCookie] = useCookies(["playerId"]);

  async function onSubmit() {
    const inputs = formRef.current?.elements as HTMLFormControlsCollection & {
      name: HTMLInputElement;
      password: HTMLInputElement;
    };
    const name = inputs.name.value;

    const input: { name: string; password?: string } = {
      name,
    };

    if (inputs.password.value) {
      input.password = inputs.password.value;
    }

    const res = await fetch("http://localhost:4673/room/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      toast({
        title: "An error has occurred",
        description: "Unable to complete your request at this time.",
        position: "top",
      });
      return;
    }

    const data = await res.json();
    removeCookie("playerId");
    setCookie("playerId", data.playerId);
    navigate(`/room/${data.roomId}`);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form ref={formRef}>
            <FormControl isRequired pb={3}>
              <FormLabel>Name</FormLabel>
              <Input name="name" />
            </FormControl>
            <FormControl>
              <FormLabel>Room Password</FormLabel>
              <Input name="password" />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onSubmit}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CreateRoomModal;
