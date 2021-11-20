import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="h-1/2">
        <div>WELCOME TO DROID HOME.</div>
        <div>Humanoid by choice</div>
      </div>
      <div>
        {" "}
        <Link to="/dashboard">LAUNCH APP</Link>
      </div>
    </div>
  );
};
