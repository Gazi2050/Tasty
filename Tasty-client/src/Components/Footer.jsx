import logo from '/logo.png'
import { FaSquareXTwitter, FaLinkedin, FaSquareFacebook } from "react-icons/fa6";
const Footer = () => {
    return (
        <div>
            <footer className="footer bg-slate-300 items-center p-4 ">
                <aside className="items-center grid-flow-col">
                    <img className='w-10' src={logo} alt="" />
                    <p>Copyright © 2024 - All right reserved</p>
                </aside>
                <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end text-2xl">
                    <a href='https://x.com/gazi20048' target="_blank" rel="noopener noreferrer" className='text-black'><FaSquareXTwitter /></a>
                    <a href='https://www.linkedin.com/in/gazi-nahian-92468727a' target="_blank" rel="noopener noreferrer" className='text-blue-500'><FaLinkedin /></a>
                    <a href='https://www.facebook.com/profile.php?id=100070872175936' target="_blank" rel="noopener noreferrer" className='text-blue-600'><FaSquareFacebook /></a>
                </nav>
            </footer>
        </div>
    );
};

export default Footer;