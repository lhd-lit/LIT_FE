import { Link } from "react-router-dom";
import backButtonIcon from "../assets/backButtonIcon.svg";

type BackButtonProps = {
  to: string;
};

export function BackButton({ to }: BackButtonProps) {
  return (
    <Link
      to={to}
      className="flex items-center justify-center w-8 h-8 rounded-lg bg-background-light text-text-primary hover:bg-background-hover transition"
      aria-label="Go back"
    >
        <img src={backButtonIcon} alt="back arrow icon" className="w-5 h-5" aria-hidden="true" />
    </Link>
  );
}

