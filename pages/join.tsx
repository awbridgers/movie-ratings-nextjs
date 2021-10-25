import React, {useContext, useState} from 'react';
import {Form, Button, FormControl, Alert} from 'react-bootstrap';
import styles from '../styles/login.module.css'
import {auth, db} from '../firebase/config';
import {AuthContext} from '../firebase/authProvider';
import {useRouter} from 'next/router'
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {set,ref,child} from 'firebase/database'

interface Errors {
  displayName: string;
  confirmPassword: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({
    displayName: '',
    confirmPassword: '',
    email: '',
    password: '',
  });
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  const [alreadySignedIn, setAlreadySignedIn] = useState<boolean>(false);
  const history = useRouter();
  const user = useContext(AuthContext);

  const handleSubmit = () => {
    //set all errors back to empty string
    setErrors({displayName: '', confirmPassword: '', email: '', password: ''});
    let formHasErrors = false;
    //check for my errors first before attempting to create with firebase
    
    if (displayName.length <= 2) {
      setErrors((prev) => ({
        ...prev,
        displayName: 'Display Name must be at least 3 characters',
      }));
      formHasErrors = true;
    } else if (!/^[a-zA-Z]+$/g.test(displayName)) {
      setErrors((prev) => ({
        ...prev,
        displayName: 'Display Name can only be letters',
      }));
      formHasErrors = true;
    }
    if (confirmPassword !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
      formHasErrors = true;
    }
    if (!formHasErrors) {
      //if there were no errors, try to make the user
      if (user) {
        //if the user is alraedy signed in, don't let them make a new account
        setAlreadySignedIn(true);
      } else {
        //if there are no errors:
        //1. create the user
        //2. add user info to said user
        //3. add user to the database
        
        createUserWithEmailAndPassword(auth,email, password)
          .then((newUser) => {
            if(newUser.user){
              updateProfile(newUser.user,{displayName: displayName})
              .catch((e) => console.log(e.message));
            set(ref(db,`/users/${newUser.user.uid}`),{displayName}).then(()=>{
              setAccountCreated(true);
            }).catch(e=>console.log(e.message))
            
          }})
          .catch((e) => {
            if (e.message.toLowerCase().includes('email')) {
              setErrors((prev) => ({...prev, email: e.message.includes('already') ? 'Email Already in Use' : 'Invalid Email'}));
            }
            if (e.message.toLowerCase().includes('password')) {
              setErrors((prev) => ({...prev, password: e.message}));
            }
          });
      }
    }
  };
  return (
    <div className={styles.signUp}>
      {accountCreated && (
        <div className={styles.logIn}>
          <Alert className={styles.logOutBox} variant="success">
            <Alert.Heading>Success!</Alert.Heading>
            <p>Your account has been created!</p>
            <Button variant="outline-success" onClick={() => history.push('/')}>
              Continue to Home Page
            </Button>
          </Alert>
        </div>
      )}
      {alreadySignedIn && (
        <div className={styles.logIn}>
          <Alert className={styles.logOutBox} variant="danger">
            <Alert.Heading>Already Signed In</Alert.Heading>
            <p>
              Please sign out of the current account before making a new one.
            </p>
            <Button
              variant="outline-danger"
              onClick={() => setAlreadySignedIn(false)}
            >
              Back
            </Button>
          </Alert>
        </div>
      )}
      <div className={styles.signUpTitle}>
        <h2>Join Movie Ratings</h2>
      </div>
      <Form className={styles.signUpForm}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            isInvalid={errors.email !== ''}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formBasicDisplay">
          <Form.Label>Display Name</Form.Label>
          <Form.Control
            placeholder="Display Name"
            onChange={(e) => {
              if (e.target.value.length <= 12) {
                setDisplayName(e.target.value);
              }
            }}
            value={displayName}
            isInvalid={errors.displayName !== ''}
          />
          <FormControl.Feedback type="invalid">
            {errors.displayName}
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={errors.password !== ''}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isInvalid={errors.confirmPassword !== ''}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>
        <div className={styles.logInButtons}>
          <Button variant="primary" id="joinButton" onClick={handleSubmit}>
            Join
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SignUp;
