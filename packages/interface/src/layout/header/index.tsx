import React, { useState, Fragment, useRef } from "react";
import { Switch, Transition, Dialog } from "@headlessui/react"
import { NavLink, Link } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import logo from "../../assets/logos/logo.jpg";
import { useWallets } from '../../hooks/wallets';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setIsDark, setMenu } from "../../slices";

function Header(){
    const [state, {connect,disconnect}] = useWallets()
    const cancelButtonRef = useRef(null)
    const { parsedAddress, balance, web3Provider, chain } = state;
    const connected = web3Provider != null;
    const network = chain?.network;
    const dispatch = useAppDispatch();
    const isDark = useAppSelector(state=>state.dashboard.dark);
    const isMenuOpen = useAppSelector(state=>state.dashboard.menu);
    const toggleTheme = ()=>{
        dispatch(setIsDark(!isDark))
    }
    const openMenu = (o?: boolean)=> {
        if(o === false || o === true){
            dispatch(setMenu(o))
        } else{
            dispatch(setMenu(!isMenuOpen))
        }
    }
    return (
        <>
        <div className="dark:bg-black bg-secondary sticky top-0 z-10">
            <nav className="dark:text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="text-2xl font-semibold flex items-center space-x-2"><div className="rounded-md"><img src={logo} width="30"/></div><div>SoliDroid</div></div>
                        <div className="hidden md:flex md:space-x-8 md:items-center">

                            <NavLink to={"/home"}>Base</NavLink>
                            <NavLink to={"/dashboard"}>Strategy</NavLink>
                            {/* <NavLink to={"/about-us"}>?</NavLink> */}
                            {!connected && <button className="bg-purple text-white px-4 py-2 rounded-md" onClick={connect}>Connect</button>}
                            {connected && <button className="bg-purple text-white px-4 py-2 rounded-md" onClick={disconnect}>{parsedAddress}</button>}
                            <div>
                                <Switch
                                    checked={isDark}
                                    onChange={toggleTheme}
                                    className={`${isDark ? 'bg-yellow-500' : 'bg-black'
                                        } relative inline-flex items-center h-6 rounded-full w-11`}
                                >

                                    <span
                                        className={`${isDark ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block w-4 h-4 transform bg-white rounded-full`}
                                    />

                                </Switch>
                            </div>
                        </div>
                        <div className="md:hidden flex items-center space-x-2">
                            <div>
                                {!connected && <button className="bg-purple text-white px-4 py-2 rounded-md" onClick={connect}>Connect</button>}
                                {connected && <button className="border border-purple text-purple px-1.5 py-1 rounded-md text-sm" onClick={disconnect}>{parsedAddress}</button>}
                            </div>
                            <div>
                                <button onClick={()=>openMenu()}><MenuIcon height="20" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        <Transition.Root show={isMenuOpen} as={Fragment}>
              <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto md:hidden" initialFocus={cancelButtonRef} onClose={openMenu}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                  </Transition.Child>

                  {/* This element is to trick the browser into centering the modal contents. */}
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
                    <div className="inline-block bg-gray rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 align-middle sm:max-w-lg w-full">
                      <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mt-3 text-center space-y-3">
                            <div className="cursor-pointer hover:text-red" onClick={() => openMenu(false)}><Link to="/home">Base</Link></div>
                            <div className="cursor-pointer hover:text-red" onClick={() => openMenu(false)}><Link to="/dashboard">Strategy</Link></div>
                            <div className="pt-8">
                              <Switch
                                checked={isDark}
                                onChange={toggleTheme}
                                className={`${isDark ? 'bg-yellow-500' : 'bg-black'
                                  } relative inline-flex items-center h-6 rounded-full w-11`}
                              >

                                <span
                                  className={`${isDark ? 'translate-x-6' : 'translate-x-1'
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
    )

}

export default Header;