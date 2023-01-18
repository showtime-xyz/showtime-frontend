import { Instagram, Twitter, Mail, Github } from "@showtime-xyz/universal.icon";

const links = [
  {
    link: "https://showtime-xyz.notion.site/Work-at-Showtime-Public-fa6282938e284134b302184062d7e329",
    title: "Careers",
  },

  {
    link: "https://showtime-xyz.notion.site/Legal-Public-c407e36eb7cd414ca190245ca8621e68",
    title: "Terms & Conditions",
  },
  {
    link: "mailto:help@showtime.xyz",
    title: "Feedback",
  },
  {
    link: "/assets/Showtime-Assets.zip",
    title: "Brand Assets",
  },
];

const social = [
  {
    icon: Twitter,
    link: "https://twitter.com/Showtime_xyz",
    title: "Twitter",
  },
  {
    icon: Instagram,
    link: "https://www.instagram.com/Showtime_xyz",
    title: "Instagram",
  },

  {
    icon: Mail,
    link: "mailto:help@showtime.xyz",
    title: "Contact",
  },
  {
    icon: Github,
    link: "https://github.com/showtime-xyz/showtime-frontend  ",
    title: "Github",
  },
];

export const useFooter = () => {
  return { links, social };
};
