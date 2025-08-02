import {
  accordionAnatomy,
  checkboxAnatomy,
  switchAnatomy,
  tagAnatomy,
} from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  extendTheme,
  type ThemeConfig,
} from "@chakra-ui/react";
//import { actionsMenuTheme } from "./ActionsMenuTheme.ts";
//import { radioTheme } from "./ui-components/Radio/Radio.ts";

const styleConfigHelpers = createMultiStyleConfigHelpers(accordionAnatomy.keys);
const { defineMultiStyleConfig: defineMultiCheckboxPartsStyle } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);
const { defineMultiStyleConfig: defineMultiTagPartsStyle } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);
const switchConfigHelpers = createMultiStyleConfigHelpers(switchAnatomy.keys);

const Switch = switchConfigHelpers.defineMultiStyleConfig({
  variants: {
    ncSwitch: {
      container: {
        w: "8",
        h: "5",
        p: "0.5",
      },
      thumb: {
        shadow: "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A ",
      },
      track: {
        _checked: {
          bgColor: "nc.green.100",
        },
      },
    },
  },
});
const Button = {
  variants: {
    ncButtonModule: {
      borderStyle: "solid",
      borderRadius: "lg",
      borderWidth: "2px",
      bg: "nc.gray.600",
      p: "0",
      h: "2.75rem",
      borderColor: "nc.gray.600",
      color: "nc.gray.100",
      fontSize: "sm",
      _hover: {
        _disabled: {
          bg: "nc.gray.700",
          color: "nc.gray.100",
          borderColor: "nc.gray.300",
        },
        borderColor: "nc.gray.400",
        color: "white",
      },
      _active: {
        color: "nc.turq.300",
        borderColor: "nc.gray.600",
        _disabled: {
          color: "nc.gray.100",
          borderColor: "nc.gray.300",
        },
      },
      _disabled: {
        borderColor: "nc.gray.300",
        bg: "nc.gray.700",
        opacity: 1,
        cursor: "not-allowed",
      },
    },
    ncButtonModuleRemoveEdit: {
      cursor: "auto",
      borderStyle: "solid",
      borderRadius: "lg",
      borderWidth: "0.6px",
      borderColor: "nc.gray.500",
      bg: "nc.gray.500",
      p: "0",
      h: "2.75rem",
      w: "14.5rem",
      color: "nc.gray.100",
      fontSize: "sm",
    },
    ncPrimary: {
      bg: "nc.turq.200",
      color: "nc.black.200",
      h: "2.75rem",
      py: "2",
      px: "8",
      fontSize: "sm",
      borderRadius: "lg",
      _hover: {
        bg: "nc.turq.100",
        _disabled: {
          bg: "nc.gray.700",
          color: "nc.gray.100",
        },
      },
      _active: {
        bg: "nc.turq.300",
      },
      _disabled: {
        bg: "nc.gray.700",
        color: "nc.gray.100",
        opacity: 1,
        cursor: "default",
      },
    },
    ncSecondary: {
      bg: "transparent",
      borderRadius: "lg",
      h: "2.75rem", //TODO: this is wrong
      py: "2",
      px: "8",
      fontSize: "sm",
      color: "nc.gray.100",
      _disabled: {
        opacity: 1,
        cursor: "default",
        color: "nc.gray.200",
      },
      _hover: {
        color: "nc.turq.100",
        _disabled: {
          color: "nc.gray.200",
        },
      },
      _active: {
        color: "nc.turq.200",
        _disabled: {
          color: "nc.gray.200",
        },
      },
    },
    ncTertiary: {
      bg: "nc.gray.100",
      borderRadius: "lg",
      py: "2",
      px: "8",
      fontSize: "sm",
      color: "white",
      _disabled: {
        bg: "nc.gray.100",
        opacity: 1,
        cursor: "default",
      },
    },
    ncDanger: {
      bg: "nc.red.200",
      h: "2.75rem",
      py: "2",
      px: "8",
      fontSize: "sm",
      borderRadius: "lg",
    },
    ncPrimaryOutlined: {
      bg: "nc.gray.500",
      borderStyle: "solid",
      borderWidth: "0.5px",
      borderRadius: "lg",
      py: "2",
      px: "8",
      fontSize: "sm",
      color: "nc.turq.200",
    },
    ncSecondaryOutlined: {
      bg: "transparent",
      py: "2",
      px: "8",
      borderStyle: "solid",
      borderWidth: "0.5px",
      bordercolor: "nc.gray.100",
      borderRadius: "lg",
      fontSize: "sm",
    },
    ncTertiaryOutlined: {
      bg: "transparent",
      py: "2",
      px: "8",
      borderStyle: "solid",
      borderWidth: "0.5px",
      borderColor: "nc.red.100",
      color: "nc.red.100",
      borderRadius: "lg",
      fontSize: "sm",
    },
    ncLink: {
      bg: "transparent",
      color: "nc.purple.500",
      py: "2",
      px: "8",
      textDecoration: "underline",
      textUnderlineOffset: "3px",
      fontSize: "sm",
      borderRadius: "none",
      _hover: {
        color: "nc.purple.400",
        _disabled: {
          color: "nc.gray.100",
        },
      },
      _disabled: {
        opacity: 1,
        cursor: "default",
      },
    },
    ncDataConnection: {
      bgColor: "nc.green.300",
      color: "nc.black.200",
      py: "2",
      px: "8",
      fontSize: "md",
      borderRadius: "lg",
      _hover: {
        bg: "nc.green.100",
        _disabled: {
          bg: "nc.gray.100",
          color: "white",
        },
      },
      _active: {
        bg: "nc.green.500",
      },
      _disabled: {
        bg: "nc.gray.100",
        color: "white",
        opacity: 1,
        cursor: "default",
      },
    },
  },
};

const Input = {
  variants: {
    ncTextInput: {
      field: {
        color: "nc.gray.100",
        bg: "transparent",
        borderWidth: "0.5px",
        borderStyle: "solid",
        borderColor: "nc.gray.300",
        _active: {
          borderColor: "nc.gray.200",
        },
        _placeholder: {
          color: "nc.gray.100",
        },
        _placeholderShown: {
          borderColor: "nc.gray.300",
        },
        _focus: {
          borderColor: "nc.gray.200",
        },
      },
    },
  },
};

const Tag = defineMultiTagPartsStyle({
  variants: {
    shortcut: {
      container: {
        backgroundColor: "nc.gray.500",
        borderWidth: "1px",
        borderColor: "nc.gray.300",
        borderRadius: "0.5rem",
        py: "0.75rem",
        px: "1rem",
      },
      label: {
        textColor: "nc.turq.100",
        color: "nc.turq.100",
        fontSize: "0.75rem",
      },
    },
    ncYellow: {
      container: {
        borderColor: "nc.yellow.200",
        borderWidth: "1px",
        borderStyle: "solid",
        bg: "transparent",
        borderRadius: "base",
        boxSizing: "border-box",
        fontWeight: "semibold",
        lineHeight: "lg",
        px: "2",
        py: "1",
      },
      label: {
        fontSize: "xs",
        color: "nc.gray.100",
      },
    },
    ncTurq: {
      container: {
        borderColor: "nc.turq.200",
        borderWidth: "1px",
        borderStyle: "solid",
        bg: "transparent",
        borderRadius: "base",
        boxSizing: "border-box",
        fontWeight: "semibold",
        lineHeight: "lg",
        px: "2",
        py: "1",
      },
      label: {
        fontSize: "xs",
        color: "nc.gray.100",
      },
    },
    ncBlue: {
      container: {
        borderColor: "nc.blue.100",
        borderWidth: "1px",
        borderStyle: "solid",
        bg: "transparent",
        borderRadius: "base",
        boxSizing: "border-box",
        fontWeight: "semibold",
        lineHeight: "lg",
        px: "2",
        py: "1",
      },
      label: {
        fontSize: "xs",
        color: "nc.gray.100",
      },
    },
    ncOrange: {
      container: {
        borderColor: "nc.orange.100",
        borderWidth: "1px",
        borderStyle: "solid",
        bg: "transparent",
        borderRadius: "base",
        boxSizing: "border-box",
        fontWeight: "semibold",
        lineHeight: "lg",
        px: "2",
        py: "1",
      },
      label: {
        fontSize: "xs",
        color: "nc.gray.100",
      },
    },
  },
});

const Checkbox = defineMultiCheckboxPartsStyle({
  variants: {
    ncPrimary: {
      icon: {
        w: "3",
        h: "3",
      },
      control: {
        borderWidth: "0.5px",
        borderColor: "nc.gray.300",
        borderStyle: "solid",
        borderRadius: "base",
        _focusVisible: {
          border: "none",
          boxShadow: "none",
          borderWidth: "0.5px",
          borderColor: "nc.gray.300",
          borderStyle: "solid",
          borderRadius: "base",
        },
      },
    },
    ncSecondary: {
      control: {
        borderRadius: "sm",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "nc.gray.300",
        _checked: {
          color: "nc.turq.200",
          bgColor: "transparent",
          borderColor: "nc.gray.300",
        },
      },
    },
    menuItem: {
      control: {
        border: "none",
        bgColor: "transparent",
        _checked: {
          border: "none",
          bgColor: "transparent",
          _hover: {
            bgColor: "transparent",
          },
        },
        _hover: {
          border: "none",
          bgColor: "transparent",
        },
      },
    },
  },
});

const Tabs = {
  variants: {
    ncTab: {
      tab: {
        borderRadius: "md",
        color: "white",
        py: "2",
        px: "3",
        fontSize: "sm",
        lineHeight: "5",
        fontWeight: "medium",
        _selected: {
          bg: "nc.gray.500",
          color: "nc.turq.200",
        },
      },
      tabpanel: {
        py: "5",
      },
    },
  },
};

const Table = {
  variants: {
    ncPlain: {
      table: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "nc.gray.400",
        borderCollapse: "initial",
        borderRadius: "lg",
      },
      thead: {
        tr: {
          th: {
            height: "44px",
            fontSize: "xs",
            fontWeight: "medium",
            fontFamily: "inter",
            color: "nc.gray.200",
            borderColor: "nc.gray.400",
            borderBottomWidth: "1px",
            borderStyle: "solid",
            borderCollapse: "collapse",
          },
        },
      },
      tbody: {
        tr: {
          borderCollapse: "collapse",
          _hover: {
            bg: "#FFFFFF12",
          },
          td: {
            border: "none",
            borderCollapse: "collapse",
            height: "4.5rem",
            fontSize: "sm",
            fontWeight: "medium",
          },
        },
      },
    },
    ncDownloadCenter: {
      table: {
        borderColor: "nc.gray.400",
      },
      thead: {
        tr: {
          th: {
            borderColor: "nc.gray.400",
            borderBottomWidth: "1px",
            fontSize: "0.75rem",
            color: "nc.gray.200",
            fontWeight: 500,
            whiteSpace: "nowrap",
          },
        },
      },
      tbody: {
        tr: {
          td: {
            borderColor: "nc.gray.400",
            borderBottomWidth: "1px",

            fontSize: "0.875rem",
            fontWeight: 500,
          },
        },
      },
    },
  },
};

const Modal = {
  variants: {
    ncModal: {
      dialog: {
        bg: "nc.black.100",
        borderRadius: "xl",
      },
      header: {
        pt: "8",
        pb: "2",
        px: "6",
        fontWeight: "medium",
        fontSize: "lg",
      },
      footer: {
        pt: "6",
        pb: "8",
        px: "6",
      },
    },
  },
};

const Drawer = {
  variants: {
    allowPointerEvents: {
      dialogContainer: {
        pointerEvents: "none",
      },
      dialog: {
        pointerEvents: "all",
      },
    },
  },
};

const Link = {
  variants: {
    ncLink: {
      textDecoration: "underline",
      color: "nc.purple.100",
      lineHeight: "20px",
      fontSize: "14px",
    },
  },
};
const Textarea = {
  variants: {
    ncTextInput: {
      color: "nc.gray.100",
      bg: "transparent",
      borderWidth: "0.5px",
      borderStyle: "solid",
      borderColor: "nc.gray.300",
      _active: {
        borderColor: "nc.gray.200",
      },
      _placeholder: {
        color: "nc.gray.100",
      },
      _placeholderShown: {
        borderColor: "nc.gray.300",
      },
      _focus: {
        borderColor: "nc.gray.200",
      },
    },
  },
};

const Accordion = styleConfigHelpers.definePartsStyle({
  container: {
    border: "none",
    fontFamily: "inter",
  },
  button: {
    p: "5",
    _expanded: {
      bgColor: "nc.black.100",
    },
    borderTopRightRadius: "2xl",
    borderTopLeftRadius: "2xl",
    fontSize: "lg",
    fontWeight: "medium",
  },
  panel: {
    bgColor: "nc.black.100",
    borderBottomLeftRadius: "2xl",
    borderBottomRightRadius: "2xl",
    px: "5",
    pb: "7",
    color: "nc.gray.300",
  },
});

export const niricsonColors = {
  nc: {
    turq: {
      100: "#70F0F0",
      200: "#2BECEC",
      300: "#11D8D8",
    },
    blue: { 100: "#49a5fa", 200: "#1665DB" },
    yellow: {
      100: "#FFC300",
      200: "#ffdb64",
    },
    purple: {
      100: "#7B65FD",
      200: "#634de7",
    },
    darkPurple: "#543ed1",
    gPurple: {
      100: "#49464f",
      200: "#19181d",
    },
    orange: {
      100: "#FF5E3A",
      200: "#FF813A",
    },
    red: {
      100: "#e33529",
      200: "#D92B1F",
      300: "#FF523A",
    },
    change: {
      increase: {
        100: "#FFC300",
        200: "#FF8A00",
        300: "#E36A43",
        400: "#DA4A1B",
        500: "#D53300",
        600: "#932006",
        700: "#68048D",
      },
      decrease: {
        100: "#49a5fa",
        200: "#7B65FD",
        300: "#1E6BDF", //blue.300
        400: "#70F0F0", //turq.100
        500: "#07C68D", //green.100
        600: "#78FF48", //green.400
        700: "#006043",
      },
    },
    brown: "#93503a",
    gray: {
      100: "#E0E7F5",
      200: "#9EAAC0",
      300: "#667085",
      400: "#2a282c",
      500: "#1e1d20",
      600: "#121114",
      700: "#7F7D85",
    },
    green: {
      100: "#07c68d",
      200: "#06ab7a",
      300: "#039166",
      400: "#036043",
    },
    black: {
      100: "#1E1D20",
      200: "#2B2A2C",
    },
    white: {
      100: "#FFFFFF",
    },
  },
};

// const colors = {
//   nc: {
//     black: {
//       100: "#1E1D20",
//       200: "#2B2A2C",
//       400: "#121114",
//     },
//     blue: {
//       100: "#2194FD",
//     },
//     blueAlpha: {
//       100: "rgba(33, 148, 253, 0.2)",
//     },
//     green: {
//       100: "#06AB7A",
//       200: "#20C997",
//       300: "#26C697",
//       400: "#18473B",
//       500: "#039166",
//       600: "#07C68D",
//     },
//     greenAlpha: {
//       100: "rgba(3, 145, 102, 0.2)",
//     },
//     purple: {
//       100: "#7B65FD",
//       200: "#634DE7",
//       300: "#533ED1",
//       400: "#7F56D9",
//       500: "#6941C6",
//     },
//     purpleAlpha: {
//       100: "rgba(123, 101, 253, 0.2)",
//     },
//     gray: {
//       100: "#9E9EA8",
//       200: "#667085",
//       300: "#9EAAC0",
//       400: "#C7C7C7",
//       500: "#29282B",
//     },
//     grayAlpha: {
//       100: "rgba(158, 158, 168, 0.2)",
//     },
//     red: {
//       100: "#AB190E",
//       200: "#FF5E3A",
//       300: "#DD2A1D",
//     },
//     redAlpha: {
//       100: "rgba(171, 25, 14, 0.2)",
//       200: "rgba(255, 94, 58, 0.2)",
//     },
//     yellow: {
//       100: "#FFC300",
//     },
//   },
// };

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const Icon = {
  variants: {
    customVariant: {
      stroke: "red", // Custom stroke color for the "customVariant"
    },
    // Add more variants if needed
    // variantName: { ...styles },
    // variantName2: { ...styles },
  },
};

const chip = {
  display: "inline-flex",
  alignItems: "center",
  px: "17px",
  py: "2px",
  bg: "nc.gray.100",
  color: "nc.black.100",
  borderRadius: "full",
  fontSize: "xs",
  fontWeight: "medium",
  lineHeight: "18px",
};

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#171717",
        color: "white",
      },
      "[data-focus-visible]": {
        zIndex: "unset !important",
      },
    },
  },
  config,
  breakpoints: {
    sm: "30em", // 480px (mobiles)
    md: "48em", // 768px (tablets)
    lg: "62em", // 992px (small laptops)
    xl: "80em", // 1280px (laptops and desktops)
    "2xl": "90em", // 1440px (large screens)
  },
  components: {
    Icon,
    Input,
    Button,
    Tabs,
    Table,
    Modal,
    Checkbox,
    Drawer,
    Textarea,
    Link,
    Tag,
    //Menu: actionsMenuTheme,
    Accordion: {
      variants: {
        ncHelpAccordion: Accordion,
      },
    },
    Switch,
    //Radio: radioTheme,
  },
  layerStyles: {
    chip: chip,
    disabledChip: {
      ...chip,
      bg: "nc.gray.400",
      color: "nc.gray.500",
    },
  },
  fontSizes: {
    md: "0.875rem",
  },
  colors: niricsonColors,
});

export const focusAreaColors = {
  conditionTag: {
    color: {
      orange: "#A93D1B",
      red: "#D92B1F",
      yellow: "#FCFD57",
      blue: "#49A5FA",
      turq: "#2BECEC",
    },
    bgColor: {
      orange: "#BC401833",
      red: "#E3352933",
      yellow: "#FCFD5733",
      blue: "#2194FD33",
      turq: "#2BECEC33",
    },
  },
  actionTag: {
    color: {
      selected: niricsonColors.nc.white["100"],
      notSelected: niricsonColors.nc.gray["200"],
    },
    bgColor: {
      selected: "#FFFFFFB2",
      notSelected: "#FFFFFF19",
    },
  },
  priorityTag: {
    color: {
      red: "#D92B1F",
      orange: "#FF813A",
      yellow: "#FCFD57",
      green: "#75F94C",
    },
    bgColor: {
      red: "#E3352933",
      orange: "#FF5E3A33",
      yellow: "#FCFD5733",
      green: "#75F94C33",
    },
  },
  colorBox: {
    bgColor: {
      yellow: niricsonColors.nc.yellow["100"],
      orange: niricsonColors.nc.orange["200"],
      red: niricsonColors.nc.red["100"],
      green: niricsonColors.nc.green["100"],
      purple: niricsonColors.nc.purple["100"],
    },
  },
  comment: {
    userNameColor: {
      turq: "#00E4FF",
    },
  },
  typeFilter: {
    turq: "#00E4FF",
  },
};
