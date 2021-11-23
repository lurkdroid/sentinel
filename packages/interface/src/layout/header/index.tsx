import { Dialog, Switch, Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/outline';
import { ethers } from 'ethers';
import { Fragment, useEffect, useRef } from 'react';
import { useMoralis } from 'react-moralis';
import { Link, NavLink } from 'react-router-dom';

import logo from '../../assets/logos/logo.jpg';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { NetworkService } from '../../services';
import { setIsDark, setMenu, setNetwork } from '../../slices';
import { setApp, setLogout } from '../../slices/app';
import { setAddress } from '../../slices/userInfo';

interface Props {
  logout: boolean;
}
function Header(props: Props) {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();

  const cancelButtonRef = useRef(null);
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.dashboard.dark);
  const isMenuOpen = useAppSelector((state) => state.dashboard.menu);
  const address = useAppSelector((state) => state.user.parsedAddress);
  const networkName = useAppSelector((state) => state.dashboard.network);
  const { network } = useAppSelector((state) => state.app);
  const toggleTheme = () => {
    dispatch(setIsDark(!isDark));
  };
  useEffect(() => {
    if (props.logout) {
      logout().then(() => dispatch(setLogout(false)));
    }
  }, [props.logout]);
  useEffect(() => {
    if (user && user.attributes) {
      console.log(user.attributes);
      dispatch(setAddress(user.attributes.ethAddress));
      if (isAuthenticated) {
        (async () => {
          const provider = await new ethers.providers.Web3Provider(
            window.ethereum
          );
          const { chainId } = await provider.getNetwork();
          NetworkService.listen();

          console.log("network name is:");
          dispatch(setNetwork(chainId));
          dispatch(setApp(chainId));
          console.log({ chainId });
        })();
      }
    }
  }, [isAuthenticated, dispatch, user]);

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
          <div className="px-4 mx-auto max-w-7xl">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-2 text-2xl font-semibold">
                <div className="rounded-md">
                  <NavLink to="/">
                    <img src={logo} width="30" alt="soliDroid" />
                  </NavLink>
                </div>
                <div>
                  <NavLink to="/">SoliDroid</NavLink>
                </div>
              </div>
              <div className="hidden md:flex md:space-x-8 md:items-center">
                <NavLink to={"/dashboard"}>Dashboard</NavLink>
                <NavLink to={"/home"}>Configuration</NavLink>
                <NavLink to={"/signal"}>Signal Providers</NavLink>
                <NavLink to={"/history"}>History</NavLink>
                {!isAuthenticated && (
                  <button
                    className="px-4 py-2 text-white rounded-md bg-purple"
                    onClick={() => authenticate()}
                  >
                    Connect
                  </button>
                )}
                {isAuthenticated && (
                  <button
                    className="px-4 py-2 text-white rounded-md bg-purple"
                    onClick={() => logout()}
                  >
                    {networkName} {address}
                  </button>
                )}
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
              <div className="flex items-center space-x-2 md:hidden">
                <div>
                  {!isAuthenticated && (
                    <button
                      className="px-4 py-2 text-white rounded-md bg-purple"
                      onClick={() => authenticate()}
                    >
                      Connect
                    </button>
                  )}
                  {isAuthenticated && (
                    <button
                      className="border border-purple text-purple px-1.5 py-1 rounded-md text-sm"
                      onClick={logout}
                    >
                      {address}
                    </button>
                  )}
                </div>
                <div>
                  <button onClick={() => openMenu()}>
                    <MenuIcon height="20" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <Transition.Root show={isMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto md:hidden"
          initialFocus={cancelButtonRef}
          onClose={openMenu}
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block w-full overflow-hidden align-middle transition-all transform rounded-lg shadow-xl bg-gray sm:my-8 sm:max-w-lg">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 space-y-3 text-center">
                      <div
                        className="cursor-pointer hover:text-red"
                        onClick={() => openMenu(false)}
                      >
                        <Link to="/home">Base</Link>
                      </div>
                      <div
                        className="cursor-pointer hover:text-red"
                        onClick={() => openMenu(false)}
                      >
                        <Link to="/dashboard">Strategy</Link>
                      </div>
                      <div className="pt-8">
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
                  </div>
                </div>
                <div className="px-4 py-3">
                  <button
                    type="button"
                    className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 
                          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                    onClick={() => openMenu(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default Header;
