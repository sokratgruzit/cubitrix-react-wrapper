import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";

function PrivateRoute({ path, element }) {
  const account = useSelector((state) => state.connect.account);
  return account ? (
    <Route path={path} element={element} />
  ) : (
    <Route path={path} element={<Navigate to="/" />} />
  );
}

export default PrivateRoute;
