import { Discord, Instagram, Twitter, Mail } from "design-system/icon";

const links = [
  {
    link: "https://jobs.lever.co/ShowtimeTechnologies",
    title: "Careers",
  },

  {
    link: "https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68",
    title: "Terms & Conditions",
  },

  {
    link: "/feedback",
    title: "Feedback",
  },

  {
    link: "/assets/Showtime-Assets.zip",
    title: "FeedbBrand Assetsack",
  },
];
const social = [
  {
    icon: Twitter,
    link: "https://twitter.com/tryShowtime",
    title: "Twitter",
  },
  {
    icon: Instagram,
    link: "https://www.instagram.com/tryshowtime/",
    title: "Instagram",
  },
  {
    icon: Discord,
    link: "/discord",
    title: "Discord",
  },
  {
    icon: Mail,
    link: "mailto:help@tryshowtime.com",
    title: "Contact",
  },
];

export const useFooter = () => {
  return { links, social };
};
