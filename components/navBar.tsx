import React, {useEffect, useState, useContext} from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {AuthContext} from '../firebase/authProvider';
import { FirebaseContext } from '../firebase/provider';
import {useRouter} from 'next/router'
import Link from 'next/link'
interface props {
  signIn: () => void;
  signOut: ()=> void;
}

const NavBar = ({signIn, signOut}: props) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const {pathname} = useRouter();
  const user = useContext(AuthContext);
  const displayName = useContext(FirebaseContext).displayName;
  useEffect(() => {
    setExpanded(false);
  }, [pathname]);
  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="sm"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link href = '/' passHref>
            <Nav.Link>
              Home
            </Nav.Link>
          </Link>
          <Link href="/viewers" passHref>
            <Nav.Link>
              Viewers
            </Nav.Link>
          </Link>
        </Nav>
        <Nav className="ms-auto">
          {user && displayName ? (
            <NavDropdown align = 'end' title = {displayName} id = 'dropdown'>
              <Link href = '/profile' passHref><NavDropdown.Item>Profile</NavDropdown.Item></Link>
              <NavDropdown.Item onClick= {signOut}>Sign Out</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link id="logInButton" onClick={signIn}>
              Sign In
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
