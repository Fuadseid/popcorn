import React from "react";
import ReactDOM from "react-dom/client";
 import './index.css';
 import App from './App';
/* import { StarRating } from "./StarRating";
 */const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
/* function Test() {
  const [rating, onSetrating] = useState(0);

  return (
    <>
      <StarRating
        maxrate={3}
        color={"red"}
        size={35}
        className=""
        message={["Bad", "good", "Excellent"]}
        defaultRating={2}
        onSetrating={onSetrating}
      />
      <p>You have rated {rating}</p>
    </>
  );
} */
