import React, {useState} from 'react';
import {Form, Button, Alert} from 'react-bootstrap';
import styles from '../styles/login.module.css'
import {auth} from '../firebase/config';
import Link  from 'next/link'
import {signInWithEmailAndPassword} from 'firebase/auth'

interface props {
  back: () => void;
  type: 'in'| 'out';
}

const LogIn = ({back, type}: props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth,email, password)
      .then((user) => {
        back();
      })
      .catch((error) => {
        setError(`Login Failed: ${error.message}`);
      });
  };
 
  if(type === 'out'){
    return (
      <div className = {styles.logIn}>
        <Alert className = {styles.logOutBox}variant = 'success'>
          <Alert.Heading>Sign Out Successful!</Alert.Heading>
            <Button onClick = {back} variant = 'outline-success'>Close</Button>
        </Alert>
      </div>
    )
  }
  return (
    <div className={styles.logIn}>
      <div className={styles.logInBox}>
        <div className={styles.logInTitlek}>
          <h2>Login</h2>
        </div>
        <div className={styles.logInErrors}>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
        <Form className="form">
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className={styles.logInButtons}>
            <Button
              variant="primary"
              type="submit"
              id="submitButton"
              onClick={handleSubmit}
            >
              Login
            </Button>
            <Button variant="danger" id="backButton" onClick={back}>
              Back
            </Button>
          </div>
        </Form>
        <div><Link href = '/join' passHref><a className = {styles.link} onClick = {back} >Create an Account</a></Link> to start ranking movies!</div>
      </div>
    </div>
  );
};

export default LogIn;
