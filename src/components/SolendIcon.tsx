export type SolendIconProps = {
  className?: string;
};

const SolendIcon = ({ className }: SolendIconProps) => {
  return (
    <svg
      className={className}
      width="24"
      height="20"
      viewBox="0 0 24 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.31107 2.37903L3.30732 4.48199C1.43142 6.45076 1.45088 9.59694 3.35099 11.5413C5.24431 13.4787 8.30555 13.5063 10.232 11.6034L13.0403 8.82957C15.0819 6.81308 18.3216 6.82742 20.3458 8.86193C22.5456 11.0727 22.4118 14.74 20.057 16.7767L18.6426 18M6.96889 8.03368C6.96889 8.03368 10.2154 4.07542 13.7383 3.08586M16.4506 12.9983C16.4506 12.9983 13.2061 16.9686 9.66692 17.8952"
        stroke="#FF9351"
        strokeWidth="2.89801"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4_20"
          x1="9.66692"
          y1="16.3092"
          x2="16.337"
          y2="13.3335"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF9351" />
          <stop offset="1" stopColor="#FF5C28" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SolendIcon;
