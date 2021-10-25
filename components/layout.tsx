import Nav from './navBar';
import Footer from './footer';
import style from '../styles/App.module.css';
import {auth} from '../firebase/config'
import {useState} from 'react'
import LogIn from '../components/logIn'
import {signOut} from 'firebase/auth'

interface Props {
  children: React.ReactNode;
}

const Layout = ({children}: Props) => {
  const [login, setLogin] = useState<boolean>(false);
  const [logOut, setLogOut] = useState<boolean>(false);
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setLogOut(true);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  return (
    <div className = {style.layout}>
      {login && <LogIn type="in" back={() => setLogin(false)} />}
      {logOut && <LogIn type="out" back={() => setLogOut(false)} />}
      <Nav signIn={()=>setLogin(true)} signOut={handleSignOut} />
      <div className={style.appBody}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
