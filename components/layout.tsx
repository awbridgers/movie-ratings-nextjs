import Nav from './navBar';
import Footer from './footer';
import style from '../styles/App.module.css';

interface Props {
  children: React.ReactNode;
}

const Layout = ({children}: Props) => {
  const fixMe = () => {
    console.log('test');
  };
  return (
    <div className = {style.layout}>
      <Nav signIn={fixMe} signOut={fixMe} />
      <div className={style.appBody}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
