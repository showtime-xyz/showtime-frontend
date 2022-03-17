import mixpanel from "mixpanel-browser";
import Link from "next/link";

import ShowtimeWordmark from "./Icons/ShowtimeWordmark";
import DiscordIcon from "./Icons/Social/DiscordIcon";
import EmailIcon from "./Icons/Social/EmailIcon";
import InstagramIcon from "./Icons/Social/InstagramIcon";
import TwitterIcon from "./Icons/Social/TwitterIcon";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 py-8 md:py-24 px-4 md:px-40 flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
        <div className="space-y-4 flex-1">
          <Link href="/">
            <a
              className="flex items-center space-x-2"
              onClick={() => mixpanel.track("Footer logo click")}
            >
              <ShowtimeWordmark className="w-auto h-8 text-white" />
            </a>
          </Link>
          <p className="text-gray-400 font-medium text-sm">
            &copy; {new Date().getFullYear()} Showtime Technologies, Inc.
          </p>
        </div>
        <div className="flex justify-between flex-1">
          <div className="space-y-4 flex flex-col">
            <a
              className="text-gray-200 font-bold"
              href="https://jobs.lever.co/ShowtimeTechnologies"
              target="_blank"
              rel="noopener noreferrer"
            >
              Careers
            </a>
            <a
              className="text-gray-200 font-bold"
              href="https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms &amp; Conditions
            </a>
            <a
              className="text-gray-200 font-bold"
              href="/feedback"
              target="_blank"
              rel="noopener noreferrer"
            >
              Feedback
            </a>
            <a
              className="text-gray-200 font-bold"
              href="/assets/Showtime-Assets.zip"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              Brand Assets
            </a>
          </div>
          <div className="space-y-4">
            <a
              className="text-gray-200 font-bold flex items-center space-x-2"
              href="https://twitter.com/tryShowtime"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon className="w-4 h-4" />
              <span>Twitter</span>
            </a>
            <a
              className="text-gray-200 font-bold flex items-center space-x-2"
              href="https://www.instagram.com/tryshowtime/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram</span>
            </a>
            <a
              className="text-gray-200 font-bold flex items-center space-x-2"
              href="/discord"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon className="w-4 h-4" />
              <span>Discord</span>
            </a>
            <a
              className="text-gray-200 font-bold flex items-center space-x-2"
              href="mailto:help@tryshowtime.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <EmailIcon className="w-4 h-auto" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
