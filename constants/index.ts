import Sun from "@/public/assets/icons/sun.svg";
import Moon from "@/public/assets/icons/moon.svg";
import System from "@/public/assets/icons/computer.svg";
import Home from "@/public/assets/icons/home.svg";
import Community from "@/public/assets/icons/users.svg";
import Collections from "@/public/assets/icons/star.svg";
import FindJobs from "@/public/assets/icons/suitcase.svg";
import Tags from "@/public/assets/icons/tag.svg";
import Profile from "@/public/assets/icons/user.svg";
import AskQuestion from "@/public/assets/icons/question.svg";

export const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: System },
];

export const sideBarLinks = [
  {
    imgURL: Home,
    route: "/",
    label: "Home",
  },
  {
    imgURL: Community,
    route: "/community",
    label: "Community",
  },
  {
    imgURL: Collections,
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: FindJobs,
    route: "/jobs",
    label: "Find Jobs",
  },
  {
    imgURL: Tags,
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: Profile,
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: AskQuestion,
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
