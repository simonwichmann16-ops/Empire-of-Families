
import React from 'react';

export type SVGIconProps = React.SVGProps<SVGSVGElement> & { title?: string };

interface IconProps {
  icon: React.FunctionComponent<SVGIconProps>;
  className?: string;
  title?: string;
}

const Icon: React.FC<IconProps> = ({ icon: SvgIcon, className, title }) => {
  return <SvgIcon className={className} title={title} />;
};

export const KeyIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
  </svg>
);


export const UserPlusIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4.5 19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V15a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 15v4.5Z" />
  </svg>
);

export const UserMinusIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 19.5H6m14.25-5.25a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4.5 19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V15a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 15v4.5Z" />
  </svg>
);

export const InboxIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.012-1.244h3.86M4.5 3h15M4.5 7.5h15" />
  </svg>
);


export const MegaphoneIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);


export const HeartIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

export const MapIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        {/* Border */}
        <path d="M3.75 3.75h16.5v16.5H3.75z" strokeLinecap="round" strokeLinejoin="round" />
        {/* Grid right */}
        <path d="M14.25 3.75v16.5m3.75-16.5v16.5M14.25 8.25h6m-6 7.5h6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Main connectors */}
        <path d="M8.25 3.75v16.5M3.75 11.25h10.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Curved part */}
        <path d="M3.75 6.75c3 0 3 3 6 3s3-3 6-3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.75 18.75c4-4 4-8 8-8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.25 14.25h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const BatteryIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 10.5H21v3H3.75V10.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 14.25V9.75A2.25 2.25 0 015.25 7.5h13.5A2.25 2.25 0 0121 9.75v4.5A2.25 2.25 0 0118.75 16.5H5.25A2.25 2.25 0 013 14.25z" />
    </svg>
);

export const MoneyIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
);

export const RespectIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
);

export const HandThumbUpIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H6.633a1.875 1.875 0 01-1.875-1.875V11.625c0-1.036.84-1.875 1.875-1.875z" />
    </svg>
);


export const PowerIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);

export const LevelIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

export const HospitalIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9" />
    </svg>
);

export const DaggerIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 8.084-2.373 20.657a.75.75 0 0 1-1.06-1.06L10.916 7.25l-2.433-2.434a.75.75 0 0 1 0-1.061l2.25-2.25a.75.75 0 0 1 1.06 0l2.434 2.433L16.3 2.62a.75.75 0 0 1 1.06 1.061L15.316 5.8l2.121 2.121a.75.75 0 0 1 0 1.06l-.97.97a.75.75 0 0 1-1.06 0l-2.122-2.121z" />
    </svg>
);

export const BriefcaseIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.972 2.4-2.213 2.545-1.39.16-2.537-1.03-2.537-2.39V15a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 .75.75v.075Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 14.15v4.075c0 1.313.972 2.4 2.213 2.545 1.39.16 2.537-1.03 2.537-2.39V15a.75.75 0 0 0-.75-.75H5.25a.75.75 0 0 0-.75.75v.075Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15.75v-1.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 .75.75v1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v6A2.25 2.25 0 0 0 6 12h12a2.25 2.25 0 0 0 2.25-2.25v-6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 3.75Z" />
    </svg>
);

export const BuildingOfficeIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.625.625 0 0 1 .625.625v3.75a.625.625 0 0 1-.625.625H9v-5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75h6.375a.625.625 0 0 1 .625.625v3.75a.625.625 0 0 1-.625.625H9v-5Z" />
    </svg>
  );

export const IdentificationIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.499-1.632Z" />
    </svg>
);

export const ShieldCheckIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const BuildingLibraryIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);

export const PillIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.343 17.657a7.5 7.5 0 0 1-0-10.606l1.06-1.061a.75.75 0 0 1 1.06 0l9.192 9.192a.75.75 0 0 1 0 1.06l-1.06 1.06a7.5 7.5 0 0 1-10.607 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.464 7.536 16.464 15.536" />
    </svg>
);

export const LeafIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.982 2.278a.75.75 0 011.083.99l-3.328 5.764a.75.75 0 00.323 1.054l5.483 3.165a.75.75 0 01.444.978l-2.09 3.62a.75.75 0 01-1.342-.777l1.018-1.764-4.56-2.632a.75.75 0 00-.814 0L5.68 15.54l1.018 1.764a.75.75 0 01-1.342.777l-2.09-3.62a.75.75 0 01.444-.978l5.483-3.165a.75.75 0 00.323-1.054L8.899 3.268a.75.75 0 011.083-.99l3 5.196 3-5.196Z" />
    </svg>
);

export const NoseIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.002v3.75m0 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.75 0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75c-3.75 0-6.75-1.679-6.75-3.75s3-3.75 6.75-3.75 6.75 1.679 6.75 3.75-3 3.75-6.75 3.75z" />
    </svg>
);

export const SpoonIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5A5.25 5.25 0 006 9.75c0 2.227 1.344 4.148 3.27 4.996V21h3.46v-6.254c1.926-.848 3.27-2.77 3.27-4.996A5.25 5.25 0 0011.25 4.5z" />
    </svg>
);


export const TruckIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 0 1 3.375-3.375h9.75a3.375 3.375 0 0 1 3.375 3.375v1.875M10.5 6h9m-9 3.75h9m-9 3.75h.75" />
    </svg>
);

export const BankIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
    </svg>
);

export const GarageIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7H3a2 2 0 0 0-2 2v12h20V9a2 2 0 0 0-2-2zM5 19V11h14v8H5zm2-6h10v2H7v-2zm0 3h10v2H7v-2z" />
    </svg>
);

export const ThiefIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg viewBox="0 0 105 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {title && <title>{title}</title>}
        <rect x="25" y="50" width="50" height="50" rx="10" fill="#2d3748" />
        <rect x="25" y="68" width="50" height="12" fill="#e2e8f0" />
        <path d="M50 0C66.5685 0 80 13.4315 80 30V40H20V30C20 13.4315 33.4315 0 50 0Z" fill="#1a202c"/>
        <rect x="20" y="35" width="60" height="15" rx="5" fill="#f7fafc" />
        <circle cx="40" cy="42.5" r="4" fill="#1a202c"/>
        <circle cx="60" cy="42.5" r="4" fill="#1a202c"/>
        <g transform="translate(75 60) rotate(10)">
            <path d="M0 10C0 4.47715 4.47715 0 10 0H20C25.5228 0 30 4.47715 30 10V20C30 25.5228 25.5228 30 20 30H10C4.47715 30 0 25.5228 0 20V10Z" fill="#c79b63"/>
            <text x="9" y="21" fontFamily="monospace" fontSize="18" fill="#f7fafc" fontWeight="bold">$</text>
        </g>
    </svg>
);

export const AirplaneIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l4 -7h3z" />
    </svg>
);

export const TrainIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L21 6.375m0 0l-3.75 3.375M21 6.375H3m18 0v1.5M3 6.375v1.5m15-1.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 1.5A1.5 1.5 0 013 9.75m0 0a1.5 1.5 0 003 0m-3 0h.008v.008H3v-.008zm1.5 3.375H3m1.5 0h.008v.008H4.5v-.008zm1.5 3.375H3m1.5 0h.008v.008H4.5v-.008zm1.5 3.375H3m1.5 0h.008v.008H4.5v-.008z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.375v17.25a2.25 2.25 0 002.25 2.25h9.75a2.25 2.25 0 002.25-2.25V3.375m-14.25 0h14.25" />
    </svg>
);

export const FriendsEnemiesIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-3.75 0-7.06 2.06-8.5 5.03a9.5 9.5 0 0 0-1.5 5.22c0 5.24 4.26 9.5 9.5 9.5s9.5-4.26 9.5-9.5c0-1.95-.59-3.76-1.5-5.22C19.06 4.31 15.75 2.25 12 2.25Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25C12 2.25 12 12 12 12s0 9.75 0 9.75c5.24 0 9.5-4.26 9.5-9.5S17.24 2.25 12 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75a.375.375 0 1 0-.75 0 .375.375 0 0 0 .75 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 14.25a.375.375 0 1 0-.75 0 .375.375 0 0 0 .75 0z" />
    </svg>
);

export const DiceIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25v-8.25a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.008v.008H12v-.008Zm0-2.25h.008v.008H12v-.008ZM15.75 15.75h.008v.008h-.008v-.008Zm0-2.25h.008v.008h-.008v-.008ZM8.25 15.75h.008v.008H8.25v-.008Zm0-2.25h.008v.008H8.25v-.008Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.25h18" />
    </svg>
);

export const CardIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13.5H9" />
    </svg>
);

export const StarIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

export const CrownIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
);

export const WrenchIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.83-5.83m-1.58-1.58L9.42 12l-2.29-2.29A2.652 2.652 0 0 0 3 13.53l5.83 5.83a2.652 2.652 0 0 0 4.17-4.17Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.25 10.5-2.29-2.29A2.652 2.652 0 0 0 8.23 4.5l-2.4 2.4a2.652 2.652 0 0 0 0 3.75l2.4 2.4a2.652 2.652 0 0 0 3.75 0l2.29-2.29" />
    </svg>
);

export const HandcuffsIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75a2.25 2.25 0 0 1 2.25 2.25v3.75a2.25 2.25 0 0 1-2.25 2.25H15M10.5 6H6a2.25 2.25 0 0 0-2.25 2.25v3.75a2.25 2.25 0 0 0 2.25 2.25h1.5m4.5-6.75h-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12V6m1.5 6V6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m17.25 12-1.5-6m-1.5 6 1.5-6" />
    </svg>
);

export const MailIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

export const VaultIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a.75.75 0 0 0-1.5 0v2.25a.75.75 0 0 0 1.5 0V15Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25a.75.75 0 0 1 1.5 0v2.25a.75.75 0 0 1-1.5 0V8.25Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a.75.75 0 0 0 0-1.5h-2.25a.75.75 0 0 0 0 1.5h2.25Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 0 1.5H8.25Z" />
    </svg>
);

export const HeistIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        {/* Hood */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.222 0-9.75 3.02-9.75 8.25 0 4.45 2.986 8.212 7.004 9.155A.638.638 0 0010 20.25v1.5H14v-1.5c.162 0 .324-.026.48-.076 4.018-.943 7.02-4.705 7.02-9.179C21.75 5.27 17.222 2.25 12 2.25Z" />
        {/* Face */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 11.25c0 .75-.375 1.5-1.125 1.5h-6.75C7.875 12.75 7.5 12 7.5 11.25S9.375 7.5 12 7.5s4.5 3 4.5 3.75Z" />
        {/* Eyes */}
        <circle cx="10.125" cy="10.875" r=".375" fill="currentColor" />
        <circle cx="13.875" cy="10.875" r=".375" fill="currentColor" />
        {/* Mustache */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 13.5c.75.75 1.5.75 2.25.75s1.5 0 2.25-.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5c-.75 1.5-1.5 1.5-1.5 2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13.5c.75 1.5 1.5 1.5 1.5 2.25" />
    </svg>
);

export const BrainIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 1-.92-2.185V7.875a4.5 4.5 0 0 1 .92-2.185L9 3l.813 2.846a4.5 4.5 0 0 1 .92 2.185v7.153a4.5 4.5 0 0 1-.92 2.185Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.187 15.904L15 18.75l.813-2.846a4.5 4.5 0 0 0 .92-2.185V7.875a4.5 4.5 0 0 0-.92-2.185L15 3l-.813 2.846a4.5 4.5 0 0 0-.92 2.185v7.153a4.5 4.5 0 0 0 .92 2.185Z" />
    </svg>
);

export const ClipboardDocumentListIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2Z" />
    </svg>
);

export const HomeModernIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M5.625 7.364l-1.5.545" />
    </svg>
);

export const CogIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const UserGroupIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.289 2.72a.75.75 0 0 1-.529.529l-1.063.266a.75.75 0 0 1-.976-.976l.266-1.063a.75.75 0 0 1 .529-.529m3.743 1.95.896.224c.552.138 1.13.295 1.725.479m-4.5-1.95a2.25 2.25 0 0 1 3.844-1.233A2.25 2.25 0 0 1 12 18.75v-2.162c0-.55.22-1.055.584-1.423l.445-.445a.75.75 0 0 0-1.06-1.06l-2.074 2.074a.75.75 0 0 0-.212.53v.314m0 0a2.25 2.25 0 0 1-3.328 2.07A2.25 2.25 0 0 1 7.5 15.375v-1.11ac.75.75 0 0 0-1.5 0v1.11a3.75 3.75 0 0 0 5.25 3.464M12 12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm-3.75 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
    </svg>
);

export const ArrowLeftStartOnRectangleIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      {title && <title>{title}</title>}
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
    </svg>
);

export const StorefrontIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        {title && <title>{title}</title>}
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12.98 6.88a2.5 2.5 0 00-1.96-.38c-.86.53-1.46 1.44-1.63 2.47H8.25a.75.75 0 000 1.5h1.25v.75h-1a.75.75 0 000 1.5h1.75v3.25c0 .41.34.75.75.75h1.5a.75.75 0 00.75-.75V13.5h.5v2.25c0 .41.34.75.75.75h1.25a.75.75 0 00.75-.75v-2c0-.41-.34-.75-.75-.75h-.5v-1.75H15a.75.75 0 000-1.5h-.21c-.32-1.95-1.4-3.5-2.81-4.37zM15 12.75h1.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75H15v-3z"/>
    </svg>
);

export const HandgunIcon: React.FC<SVGIconProps> = ({ title, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {title && <title>{title}</title>}
      <path d="M13 21v-6" />
      <path d="M16 15h-6" />
      <path d="M10 15v-1.923c0 -1.923 1.79 -3.577 4 -3.577s4 1.654 4 3.577v1.923" />
      <path d="M14 9.5v-5.5h2l2 2v2.5" />
      <path d="M13 11h-7.818c-2.07 0 -3.818 -1.48 -3.818 -3.333v-1.334c0 -1.853 1.747 -3.333 3.818 -3.333h9" />
    </svg>
);


export default Icon;
