import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <>
      <h1> 404 Error not Found!</h1>
      <br />
      <Link to="/"> Go Back To Home Page </Link>
    </>
  );
}

export default ErrorPage;
