import { Backdrop, CircularProgress } from "@mui/material";
import { Redirect, Route, Switch } from "react-router";

import { MessageDialog } from "../components";
import { DroidStatus } from "../containers/droid/details";
import { History } from "../containers/droid/history";
import { useAppSelector } from "../hooks/redux";
import Header from "../layout/header";
import { Home } from "../views/Home";
import { NetworkService } from "../services/networkService";
import { useEffect } from "react";
function App() {
  const isDark = useAppSelector((state) => state.dashboard.dark);
  const { modal, network, logout } = useAppSelector((state) => state.app);
  const { loading } = useAppSelector((state) => state.app);

  useEffect(() => {
    NetworkService.listen();
  }, []);

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
          <Route path="/" exact component={Home} />
          <Route path="/history" exact render={() => <History />} />
          {network && (
            <Route
              path="/dashboard"
              exact
              render={() => {
                console.log("RENDERING_ DASHBOARD:");

                return <DroidStatus />;
              }}
            />
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
