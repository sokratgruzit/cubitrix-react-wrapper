import React from "react";

const Dashboard = ({ className, ...props }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="#CDCED1"
      className={className}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2672 1.5839C11.7398 1.16396 12.397 1.04175 13.1083 1.04175H16.475C17.1863 1.04175 17.8435 1.16396 18.3162 1.5839C18.8077 2.02059 18.9583 2.64881 18.9583 3.31675V7.10008C18.9583 7.76756 18.8079 8.39673 18.3153 8.83269C17.8417 9.25179 17.184 9.37098 16.4731 9.36675H13.1083C12.3993 9.36675 11.7414 9.24745 11.2681 8.82853C10.7751 8.39221 10.625 7.76256 10.625 7.09175V3.31675C10.625 2.64881 10.7757 2.02059 11.2672 1.5839ZM12.0974 2.51834C11.991 2.61291 11.875 2.80969 11.875 3.31675V7.09175C11.875 7.60427 11.9916 7.79962 12.0965 7.89247C12.2211 8.00271 12.4924 8.11675 13.1083 8.11675H16.4789C17.0923 8.12061 17.3629 8.0063 17.4868 7.89664C17.5921 7.80343 17.7083 7.60761 17.7083 7.10008V3.31675C17.7083 2.80969 17.5923 2.61291 17.4859 2.51834C17.3606 2.40704 17.0887 2.29175 16.475 2.29175H13.1083C12.4946 2.29175 12.2227 2.40704 12.0974 2.51834Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2403 11.2403C11.7135 10.7672 12.3832 10.625 13.1083 10.625H16.475C17.2001 10.625 17.8699 10.7672 18.343 11.2403C18.8161 11.7135 18.9583 12.3832 18.9583 13.1083V16.475C18.9583 17.2001 18.8161 17.8699 18.343 18.343C17.8699 18.8161 17.2001 18.9583 16.475 18.9583H13.1083C12.3832 18.9583 11.7135 18.8161 11.2403 18.343C10.7672 17.8699 10.625 17.2001 10.625 16.475V13.1083C10.625 12.3832 10.7672 11.7135 11.2403 11.2403ZM12.1242 12.1242C11.9994 12.249 11.875 12.5084 11.875 13.1083V16.475C11.875 17.0749 11.9994 17.3343 12.1242 17.4591C12.249 17.5839 12.5084 17.7083 13.1083 17.7083H16.475C17.0749 17.7083 17.3343 17.5839 17.4591 17.4591C17.5839 17.3343 17.7083 17.0749 17.7083 16.475V13.1083C17.7083 12.5084 17.5839 12.249 17.4591 12.1242C17.3343 11.9994 17.0749 11.875 16.475 11.875H13.1083C12.5084 11.875 12.249 11.9994 12.1242 12.1242Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.68391 1.5839C2.15656 1.16396 2.81379 1.04175 3.52508 1.04175H6.89175C7.60304 1.04175 8.26027 1.16396 8.73292 1.5839C9.2244 2.02059 9.37508 2.64881 9.37508 3.31675V7.10008C9.37508 7.76756 9.22461 8.39673 8.732 8.83269C8.25846 9.25179 7.60074 9.37098 6.88989 9.36675H3.52508C2.81602 9.36675 2.15817 9.24745 1.68483 8.82853C1.19182 8.39221 1.04175 7.76256 1.04175 7.09175V3.31675C1.04175 2.64881 1.19242 2.02059 1.68391 1.5839ZM2.51417 2.51834C2.40774 2.61291 2.29175 2.80969 2.29175 3.31675V7.09175C2.29175 7.60427 2.40834 7.79962 2.51325 7.89247C2.63782 8.00271 2.90915 8.11675 3.52508 8.11675H6.89568C7.50904 8.12061 7.77966 8.0063 7.90358 7.89664C8.00889 7.80343 8.12508 7.60761 8.12508 7.10008V3.31675C8.12508 2.80969 8.00909 2.61291 7.90266 2.51834C7.77739 2.40704 7.50546 2.29175 6.89175 2.29175H3.52508C2.91137 2.29175 2.63944 2.40704 2.51417 2.51834Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.6571 11.2403C2.13021 10.7672 2.79998 10.625 3.52508 10.625H6.89175C7.61685 10.625 8.28662 10.7672 8.75973 11.2403C9.23284 11.7135 9.37508 12.3832 9.37508 13.1083V16.475C9.37508 17.2001 9.23284 17.8699 8.75973 18.343C8.28662 18.8161 7.61685 18.9583 6.89175 18.9583H3.52508C2.79998 18.9583 2.13021 18.8161 1.6571 18.343C1.18399 17.8699 1.04175 17.2001 1.04175 16.475V13.1083C1.04175 12.3832 1.18399 11.7135 1.6571 11.2403ZM2.54098 12.1242C2.41617 12.249 2.29175 12.5084 2.29175 13.1083V16.475C2.29175 17.0749 2.41617 17.3343 2.54098 17.4591C2.66579 17.5839 2.92518 17.7083 3.52508 17.7083H6.89175C7.49165 17.7083 7.75104 17.5839 7.87585 17.4591C8.00066 17.3343 8.12508 17.0749 8.12508 16.475V13.1083C8.12508 12.5084 8.00066 12.249 7.87585 12.1242C7.75104 11.9994 7.49165 11.875 6.89175 11.875H3.52508C2.92518 11.875 2.66579 11.9994 2.54098 12.1242Z"
      />
    </svg>
  );
};

export default Dashboard;
