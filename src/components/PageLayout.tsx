import { ReactNode } from "react";
import HamburgerMenu from "./HamburgerMenu";

interface PageLayoutProps {
  children: ReactNode;
  showHamburgerMenu?: boolean;
}

const PageLayout = ({ children, showHamburgerMenu = true }: PageLayoutProps) => {
  return (
    <div className="relative min-h-screen">
      {children}
      {showHamburgerMenu && <HamburgerMenu />}
    </div>
  );
};

export default PageLayout; 