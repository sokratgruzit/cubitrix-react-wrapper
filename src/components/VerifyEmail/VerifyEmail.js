import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

const VerifyEmail = (props) => {
  const params = useParams();
  useEffect(() => {
    axios
      .post("/accounts/verify", { code: params.id })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e?.response));
  }, [params]);

  return <div>Verify Email</div>;
};

export default VerifyEmail;
