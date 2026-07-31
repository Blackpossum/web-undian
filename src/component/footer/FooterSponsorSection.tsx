import type { ReactNode } from "react";

import './Footer.css'

interface FooterContentProps {
  className?:string;
  title: string;
  description: string;
  icon?: ReactNode | null;
};

const FooterSponsorSection = (props:FooterContentProps) : ReactNode => {
  const {description, title, className='footer-container',icon}=props;
  return (
    <div className={className}>
      <p className="footer-desc">{description}</p>
        <span>
          {icon ? icon : null}
          <p className="title-text">{title}</p>
        </span>
    </div>
  );
};

export default FooterSponsorSection;