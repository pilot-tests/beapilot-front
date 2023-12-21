import { Link } from 'react-router-dom';
import SvgLogo from '../svg/Logo';
import "./Footer.scss"

export default function Footer() {
  return (
    <footer className="footer">


      <div className="footer__content">
        <div className="footer__logo">
          <a href="/">
            <SvgLogo />
            </a>
            Test Pilot Pro
        </div>
        <ul className="footer__links">
          <li>
            <a href="<?php echo home_url('test-pilot-pro-faqs/'); ?>">FAQS</a>
          </li>
          <li>
            <a href="<?php echo home_url('/contact'); ?>">CONTACTO</a>
          </li>
          <li>
            <a href="https://discord.gg/ba5xe3JgKP" target="_BLANK">DISCORD</a>
          </li>

        </ul>
      </div>
    </footer>
  );
}
