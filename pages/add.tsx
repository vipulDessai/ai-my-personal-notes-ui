import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {
  CommandBar,
  FocusTrapZone,
  IButtonProps,
  ICommandBarItemProps,
} from "@fluentui/react";
import { setVirtualParent } from "@fluentui/dom-utilities";

import commonStyles from "../styles/common.module.scss";

import logoSvg from "../public/note-manager-app-main-logo.svg";

const overflowProps: IButtonProps = { ariaLabel: "More commands" };
const _items: ICommandBarItemProps[] = [
  {
    key: "newItem",
    text: "New",
    cacheKey: "myCacheKey", // changing this key will invalidate this item's cache
    iconProps: { iconName: "Add" },
    subMenuProps: {
      items: [
        {
          key: "emailMessage",
          text: "Email message",
          iconProps: { iconName: "Mail" },
          ["data-automation-id"]: "newEmailButton", // optional
        },
        {
          key: "calendarEvent",
          text: "Calendar event",
          iconProps: { iconName: "Calendar" },
        },
      ],
    },
  },
  {
    key: "upload",
    text: "Upload",
    iconProps: { iconName: "Upload" },
    subMenuProps: {
      items: [
        {
          key: "uploadfile",
          text: "File",
          preferMenuTargetAsEventTarget: true,
          onClick: (
            ev?:
              | React.MouseEvent<HTMLElement, MouseEvent>
              | React.KeyboardEvent<HTMLElement>
              | undefined,
          ) => {
            ev?.persist();

            Promise.resolve().then(() => {
              const inputElement = document.createElement("input");
              inputElement.style.visibility = "hidden";
              inputElement.setAttribute("type", "file");

              document.body.appendChild(inputElement);

              const target = ev?.target as HTMLElement | undefined;

              if (target) {
                setVirtualParent(inputElement, target);
              }

              inputElement.click();

              if (target) {
                setVirtualParent(inputElement, null);
              }

              setTimeout(() => {
                inputElement.remove();
              }, 10000);
            });
          },
        },
        {
          key: "uploadfolder",
          text: "Folder",
          preferMenuTargetAsEventTarget: true,
          onClick: (
            ev?:
              | React.MouseEvent<HTMLElement, MouseEvent>
              | React.KeyboardEvent<HTMLElement>
              | undefined,
          ) => {
            ev?.persist();

            Promise.resolve().then(() => {
              const inputElement = document.createElement("input");
              inputElement.style.visibility = "hidden";
              inputElement.setAttribute("type", "file");

              (inputElement as { webkitdirectory?: boolean }).webkitdirectory =
                true;

              document.body.appendChild(inputElement);

              const target = ev?.target as HTMLElement | undefined;

              if (target) {
                setVirtualParent(inputElement, target);
              }

              inputElement.click();

              if (target) {
                setVirtualParent(inputElement, null);
              }

              setTimeout(() => {
                inputElement.remove();
              }, 10000);
            });
          },
        },
      ],
    },
  },
  {
    key: "share",
    text: "Share",
    iconProps: { iconName: "Share" },
    onClick: () => console.log("Share"),
  },
  {
    key: "download",
    text: "Download",
    iconProps: { iconName: "Download" },
    onClick: () => console.log("Download"),
  },
];
const _overflowItems: ICommandBarItemProps[] = [
  {
    key: "move",
    text: "Move to...",
    onClick: () => console.log("Move to"),
    iconProps: { iconName: "MoveToFolder" },
  },
  {
    key: "copy",
    text: "Copy to...",
    onClick: () => console.log("Copy to"),
    iconProps: { iconName: "Copy" },
  },
  {
    key: "rename",
    text: "Rename...",
    onClick: () => console.log("Rename"),
    iconProps: { iconName: "Edit" },
  },
];
const _farItems: ICommandBarItemProps[] = [
  {
    key: "tile",
    text: "Grid view",
    // This needs an ariaLabel since it's icon-only
    ariaLabel: "Grid view",
    iconOnly: true,
    iconProps: { iconName: "Tiles" },
    onClick: () => console.log("Tiles"),
  },
  {
    key: "info",
    text: "Info",
    // This needs an ariaLabel since it's icon-only
    ariaLabel: "Info",
    iconOnly: true,
    iconProps: { iconName: "Info" },
    onClick: () => console.log("Info"),
  },
];

export default function Home() {
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Add Note</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Image
          alt="Follow us on Twitter"
          src={logoSvg}
          className={commonStyles["app-logo"]}
        ></Image>
      </header>

      {/* TODO: fix the not working go back button when the menu is enabled */}
      <nav>
        <FocusTrapZone>
          <CommandBar
            items={_items}
            overflowItems={_overflowItems}
            overflowButtonProps={overflowProps}
            farItems={_farItems}
            ariaLabel="Inbox actions"
            primaryGroupAriaLabel="Email actions"
            farItemsGroupAriaLabel="More actions"
          />
        </FocusTrapZone>
      </nav>

      <main>
        <p>Add note page</p>

        <ul className={commonStyles["links-group"]}>
          <li>
            <Link href="/">Back</Link>
          </li>
        </ul>
      </main>

      <footer>
        <a
          className={commonStyles["flex-center"]}
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Powered by</span>
          <img src="/vercel.svg" alt="Vercel" className={commonStyles.logo} />
        </a>
      </footer>
    </div>
  );
}
