import { Dialog, Switch, Transition } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/outline";
// import { ethers } from "ethers";
import { Fragment, useEffect, useRef } from "react";
// import { useMoralis } from "react-moralis";
import { Link, NavLink } from "react-router-dom";

import logo from "../../assets/logos/logo.png";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { NetworkService } from "../../services";
import { setIsDark, setMenu, setNetwork } from "../../slices";
// import { setApp, setLogout } from "../../slices/app";
// import { setAddress } from "../../slices/userInfo";

interface Props {
  logout: boolean;
}
function Header(props: Props) {
  // const { authenticate, isAuthenticated, user, logout } = useMoralis();

  const cancelButtonRef = useRef(null);
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.dashboard.dark);
  const isMenuOpen = useAppSelector((state) => state.dashboard.menu);
  const address = useAppSelector((state) => state.user.parsedAddress);
  // const networkName = useAppSelector((state) => state.dashboard.network);
  const { network } = useAppSelector((state) => state.app);

  console.warn("@n " + network);
  console.warn("@a " + address);

  const toggleTheme = () => {
    dispatch(setIsDark(!isDark));
  };

  // useEffect(() => {
  //   if (props.logout) {
  //     logout().then(() => dispatch(setLogout(false)));
  //   }
  // }, [props.logout]);
  // useEffect(() => {
  //   if (user && user.attributes) {
  //     console.log(user.attributes);
  //     dispatch(setAddress(user.attributes.ethAddress));
  //     if (isAuthenticated) {
  //       (async () => {
  //         const provider = await new ethers.providers.Web3Provider(
  //           window.ethereum
  //         );
  //         const { chainId } = await provider.getNetwork();
  //         NetworkService.listen();

  //         console.log("network name is:");
  //         dispatch(setNetwork(chainId));
  //         dispatch(setApp(chainId));
  //         console.log({ chainId });
  //       })();
  //     }
  //   }
  // }, [isAuthenticated, dispatch, user]);
  useEffect(() => {
    // if (user && user.attributes) {
    //   console.log(user.attributes);
    //   dispatch(setAddress(user.attributes.ethAddress));
    //   if () {
    //     (async () => {
    //       const provider = await new ethers.providers.Web3Provider(
    //         window.ethereum
    //       );
    //       const { chainId } = await provider.getNetwork();
    //       NetworkService.listen();
    //       console.log("network name is:");
    //       dispatch(setNetwork(chainId));
    //       dispatch(setApp(chainId));
    //       console.log({ chainId });
    //     })();
    //   }
    // }
  }, [dispatch]);

  const openMenu = (o?: boolean) => {
    if (o === false || o === true) {
      dispatch(setMenu(o));
    } else {
      dispatch(setMenu(!isMenuOpen));
    }
  };

  return (
    <>
      <div className={`sticky top-0 z-10 dark:bg-black`}>
        <div className={`h-1 bg-${network || "secondary"}`}></div>
        <nav className="dark:text-white">
          <div className="px-4 mx-auto">
            <div className="flex items-center justify-between py-4">
              <div className="flex space-x-2 text-2xl font-semibold">
                <div className="ml-20">
                  <NavLink to="/">soliDroid</NavLink>
                </div>
              </div>
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
              {network && (
                <div
                  className={` 
                mr-10 md:flex md:space-x-8 p-1
                md:items-center
                border-2 border-white rounded border-solid`}
                >
                  <span>{address}</span>
                  <img
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
