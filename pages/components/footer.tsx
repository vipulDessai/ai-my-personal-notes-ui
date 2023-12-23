import commonStyles from "../../styles/common.module.scss";

export const Footer = () => {
  return (
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
  );
};
