import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  IconButton,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { iconComponents, pageTitles } from "./utils";

const { InboxIcon, MailIcon, MenuIcon } = iconComponents;

export function SidePanel() {
  const router = useRouter();
  const [showSideMenu, setShowSideMenu] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setShowSideMenu(open);
    };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => {
              router.push("/");
            }}
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={pageTitles.HOME} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => {
              router.push("/add-note");
            }}
          >
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary={pageTitles.ADD_NOTE} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <nav>
      <IconButton aria-label="side menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor={"left"} open={showSideMenu} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </nav>
  );
}
