import { Backdrop, CircularProgress } from "@mui/material";
import { Redirect, Route, Switch } from "react-router";

import { MessageDialog } from "../components";
import { DroidStatus } from "../containers/droid/details";
import { History } from "../containers/droid/history";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import Header from "../layout/header";
import { Home } from "../views/Home";
import { NetworkService } from "../services/networkService";
import { useEffect } from "react";
import { setLoading } from "../slices";
function App() {
  const isDark = useAppSelector((state) => state.dashboard.dark);
  const { modal, network, logout } = useAppSelector((state) => state.app);
  const { loading } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(false));
    NetworkService.listen();
  }, [network]);

  const { address: userAddress } = useAppSelector((state) => state.user);
  return (
    <div className={`${isDark ? "dark" : network} h-screen`}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        // onClick={() => dispatch(setLoading(false))}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <MessageDialog show={modal} />
      <div className={"dark:bg-black-type1 h-full"}>
        <Header logout={logout} />
        <Switch>
          <Route
            path="/"
            exact
            render={() => <Home backgroundImage={"/images/assets/bg.jpg"} />}
          />

          {userAddress && (
            <>
              <Route path="/history" exact render={() => <History />} />
              <Route
                path="/dashboard"
                exact
                render={() => {
                  console.log("RENDERING_ DASHBOARD:");

                  return <DroidStatus />;
                }}
              />
            </>
          )}
          {!userAddress ? (
            <Redirect
              path="/"
              to={{
                pathname: "/",
              }}
            />
          ) : (
            <Redirect
              path="/"
              to={{
                pathname: "/dashboard",
              }}
            />
          )}
        </Switch>
      </div>
    </div>
  );
}

export default App;
