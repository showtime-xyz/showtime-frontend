import {
  Discord,
  Instagram,
  Twitter,
  Mail,
} from "@showtime-xyz/universal.icon";

const links = [
  {
    link: "https://showtimeinc.notion.site/Work-at-Showtime-Public-fa6282938e284134b302184062d7e329",
    title: "Careers",
  },

  {
    link: "https://showtimeinc.notion.site/Legal-Public-c407e36eb7cd414ca190245ca8621e68",
    title: "Terms & Conditions",
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
    icon: Discord,
    link: "/discord",
    title: "Discord",
  },
  {
    icon: Mail,
    link: "mailto:help@showtime.xyz",
    title: "Contact",
  },
];

export const useFooter = () => {
  return { links, social };
};
