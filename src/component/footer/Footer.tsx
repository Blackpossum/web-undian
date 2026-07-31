import type { ReactNode } from "react";

import './Footer.css'

interface FooterProps {
  className?:string;
  title: string;
  description: string;
  icon?: ReactNode | null;
};

const CommonFooter = (props:FooterProps) : ReactNode => {
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

export default CommonFooter;