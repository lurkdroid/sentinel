import { Switch } from "@headlessui/react";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setIsDark } from "../../slices";

interface Props {
  logout: boolean;
}
function Header(props: Props) {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.dashboard.dark);
  const address = useAppSelector((state) => state.user.parsedAddress);
  const { network } = useAppSelector((state) => state.app);

  console.warn("@n " + network);
  console.warn("@a " + address);

  const toggleTheme = () => {
    dispatch(setIsDark(!isDark));
  };

  return (
    <>
      <div className={`sticky top-0 z-10`}>
        <div className={`h-1 bg-${network || "secondary"}`}></div>
        <nav className="dark:text-white bg-transparent header-border-b">
          <div className="px-4 mx-auto">
            <div className="flex items-center justify-between py-4">
              <div className="flex space-x-2 text-2xl font-semibold">
                <div className="ml-20">
                  <NavLink to="/">soliDroid</NavLink>
                </div>
              </div>
              {address && (
                <div className="hidden md:flex md:space-x-8 md:items-center">
                  <NavLink to={"/dashboard"}>Dashboard</NavLink>
                  <NavLink to={"/history"}>History</NavLink>
                  <div>
                    <Switch
                      checked={isDark}
                      onChange={toggleTheme}
                      className={`${
                        isDark ? "bg-yellow-500" : "bg-black"
                      } relative inline-flex items-center h-6 rounded-full w-11`}
                    >
                      <span
                        className={`${
                          isDark ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform bg-white rounded-full`}
                      />
                    </Switch>
                  </div>
                </div>
              )}
              {network && (
                <div
                  className={` 
                mr-10 md:flex md:space-x-8 p-1
                md:items-center
                ${address ? "border-2 border-white rounded border-solid" : ""}`}
                >
                  <span>{address}</span>
                  <img
                    className={"rounded"}
                    src={`images/networks/${network}-network.jpg`}
                    width="40"
                    alt={network}
                  />
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Header;
