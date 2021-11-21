import { Redirect, Route, Switch } from 'react-router';

import { MessageDialog } from '../components';
import { DroidStatus } from '../containers/droid/details';
import { History } from '../containers/droid/history';
import { useAppSelector } from '../hooks/redux';
import Header from '../layout/header';
import { Home } from '../views/Home';

function App() {
  const isDark = useAppSelector((state) => state.dashboard.dark);
  const { modal, network, logout } = useAppSelector((state) => state.app);

  const { address: userAddress } = useAppSelector((state) => state.user);
  console.warn("USER ADDRESS: " + userAddress);

  return (
    <div className={`${isDark ? "dark" : ""} h-screen`}>
      <MessageDialog show={modal} />
      <div className={"dark:bg-black-type1 h-full"}>
        {userAddress && <Header logout={logout} />}
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

                return (
                  <div className="flex justify-center p-2 m-2 mt-2">
                    <DroidStatus />
                  </div>
                );
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
