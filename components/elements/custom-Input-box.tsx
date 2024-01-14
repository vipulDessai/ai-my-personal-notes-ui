import commonStyles from "../../styles/common.module.scss";

import { iconComponents } from "../utils";

const { FileUploadIcon } = iconComponents;

export const CustomInputBox = ({ label }: { label: string }) => {
  return (
    <section className={commonStyles["file-upload-custom-button"]}>
      <ul>
        <li className={commonStyles["icon-holder"]}>
          <FileUploadIcon />
        </li>
        <li>Upload Files</li>
      </ul>
      <input type="file" name={`form field ${label}`} />
    </section>
  );
};
