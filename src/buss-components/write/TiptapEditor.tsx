import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Blockquote from "@tiptap/extension-blockquote";
import {
  Box,
  IconButton,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaLink,
  FaQuoteLeft,
  FaSmile,
} from "react-icons/fa";

const emojiList = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😋",
  "😎",
  "😍",
  "😘",
  "🥰",
  "😗",
  "😙",
  "😚",
  "🙂",
  "🤗",
  "🤩",
  "🤔",
  "🤨",
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",
  "😣",
  "😥",
  "😮",
  "🤐",
  "😯",
  "😪",
  "😫",
  "🥱",
  "😴",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤥",
  "😶",
  "😬",
  "🙄",
  "🤨",
  "😐",
  "😑",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "🥵",
  "🥶",
  "😳",
  "🤯",
  "🥴",
  "😵",
  "😡",
  "😠",
  "🤬",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "😇",
  "🥳",
  "🥺",
  "🤠",
  "🤡",
  "🥸",
  "😈",
  "👿",
  "👹",
  "👺",
  "💀",
  "☠️",
  "👻",
  "👽",
  "🤖",
  "🎃",
  "😺",
];

const TiptapEditor = ({
  content,
  setContent,
}: {
  content: string;
  setContent: (value: string) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Blockquote,
      Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
    ],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
  });

  if (!editor) {
    return (
      <Box p={3} borderRadius="md" bg="gray.800" color="white">
        Yükleniyor...
      </Box>
    );
  }

  const addLink = () => {
    const selectedText = editor.state.selection.empty ? null : editor.getText();

    if (!selectedText) {
      alert("Bağlantı eklemek için bir metin seçmelisiniz!");
      return;
    }

    if (linkUrl.trim()) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      onClose();
    }
  };

  const insertEmoji = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run();
  };

  return (
    <Box
      border="1px solid #444"
      borderRadius="md"
      p={3}
      bg="#171717"
      color="white">
      <Flex gap={2} mb={2}>
        <IconButton
          aria-label="Kalın"
          variant={"ghost"}
          icon={<FaBold />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          size="sm"
        />
        <IconButton
          aria-label="İtalik"
          variant={"ghost"}
          icon={<FaItalic />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          size="sm"
        />
        <IconButton
          aria-label="Altı Çizili"
          variant={"ghost"}
          icon={<FaUnderline />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          size="sm"
        />
        <IconButton
          aria-label="Liste"
          variant={"ghost"}
          icon={<FaListUl />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          size="sm"
        />
        <IconButton
          aria-label="Alıntı"
          variant={"ghost"}
          icon={<FaQuoteLeft />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          size="sm"
        />
        <IconButton
          aria-label="Bağlantı"
          variant={"ghost"}
          icon={<FaLink />}
          onClick={onOpen}
          size="sm"
        />

        <Popover>
          <PopoverTrigger>
            <IconButton
              as="button"
              aria-label="Emoji"
              icon={<FaSmile />}
              size="sm"
            />
          </PopoverTrigger>
          <PopoverContent bg="#171717" p={2} borderRadius="md">
            <Grid templateColumns="repeat(10, 1fr)" gap={1}>
              {emojiList.map((emoji) => (
                <GridItem
                  key={emoji}
                  cursor="pointer"
                  onClick={() => insertEmoji(emoji)}
                  fontSize="lg"
                  p={1}
                  textAlign="center">
                  {emoji}
                </GridItem>
              ))}
            </Grid>
          </PopoverContent>
        </Popover>
      </Flex>

      <Box as={EditorContent} editor={editor} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#171717" color="white">
          <ModalHeader>Bağlantı Ekle</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Bağlantı URL'si"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" onClick={addLink}>
              Ekle
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TiptapEditor;
