import React from "react";

const Notifications = ({ className, ...props }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFFFFF"
      className={className}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.02 2.90991C8.71 2.90991 6.02 5.59991 6.02 8.90991V11.7999C6.02 12.4099 5.76 13.3399 5.45 13.8599L4.3 15.7699C3.59 16.9499 4.08 18.2599 5.38 18.6999C9.69 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M13.87 3.19994C12.6607 2.85553 11.3793 2.85553 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994V3.19994Z"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.89999 21.1801C9.33815 20.6174 9.02178 19.8552 9.01999 19.0601"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export default Notifications;
