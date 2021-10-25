import React, {useContext, useState} from 'react';
import {Form, Button, Alert, Row, Col} from 'react-bootstrap';
import loginStyle from '../styles/login.module.css'
import {AuthContext} from '../firebase/authProvider';
import {db} from '../firebase/config';
import {FirebaseContext} from '../firebase/provider';
import {ref, update} from 'firebase/database'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
  updateEmail,
  updatePassword,
} from 'firebase/auth';

interface Props {
  type: 'Password' | 'Email' | 'Name' | 'Delete';
  currentEmail: string;
  currentName: string;
  back: () => void;
}
interface Errors {
  displayName: string;
  confirmPassword: string;
  email: string;
  password: string;
  currentPassword: string;
}

const ChangeProfileInfo = ({type, back, currentEmail, currentName}: Props) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [deleteText, setDeleteText] = useState<string>('');
  const user = useContext(AuthContext)!; //user must exist to access this page
  const userMovies = useContext(FirebaseContext).userMovie;
  const [errors, setErrors] = useState<Errors>({
    displayName: '',
    confirmPassword: '',
    email: '',
    password: '',
    currentPassword: '',
  });
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrors({
      displayName: '',
      confirmPassword: '',
      email: '',
      password: '',
      currentPassword: '',
    });
    //reauthenticate the user
    const cred = EmailAuthProvider.credential(currentEmail, currentPassword);
    switch (type) {
      case 'Email':
        reauthenticateWithCredential(user, cred)
          .then((userCredential) => {
              updateEmail(userCredential.user, email)
              .then(() => {
                setSuccess(true);
              })
              .catch((e) => {
                setErrors((prev) => ({...prev, email: e.message}));
              });
          })
          .catch((e) => {
            setErrors((prev) => ({...prev, currentPassword: e.message}));
          });
        break;
      case 'Name':
        if (name.length < 3) {
          setErrors((prev) => ({
            ...prev,
            displayName: 'Name must be at least 3 characters.',
          }));
        } else if (!/^[a-zA-Z]+$/g.test(name)) {
          setErrors((prev) => ({
            ...prev,
            displayName: 'Name can only contain letters.',
          }));
        } else {
          //need to update display name in users and at each movie where it appears
          let updates: {[key: string]: any} = {};
          updates[`users/${user.uid}/displayName`] = name;
          userMovies.forEach((movie) => {
            updates[`movies/${movie.name}/ratings/${user.uid}/displayName`] =
              name;
          });
          update(ref(db),updates)
            .then(() => {
              updateProfile(user,{displayName: name})
                .then(() => {
                  setSuccess(true);
                })
                .catch((e) => {
                  setErrors((prev) => ({...prev, displayName: e.message}));
                });
            })
            .catch((e) =>
              setErrors((prev) => ({...prev, displayName: e.message}))
            );
        }
        break;
      case 'Password':
        if (password !== confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: 'Passwords do not match',
          }));
        } else {
          //then reauth user
         reauthenticateWithCredential(user, cred)
            .then((userCredential) => {
              //if user authorized, change password
              updatePassword(userCredential.user, password)
                .then(() => {
                  setSuccess(true);
                })
                .catch((e) => {
                  setErrors((prev) => ({...prev, password: e.message}));
                });
            })
            .catch((e) => {
              setErrors((prev) => ({...prev, currentPassword: e.message}));
            });
        }
        break;
      case 'Delete':
        //delete all the users ratings
          reauthenticateWithCredential(user, cred)
          .then((userCredential) => {
            if (userCredential.user) {
              const reCred = userCredential.user;
              const deleteDB: {[key: string]: any} = {};
              userMovies.forEach((movie) => {
                deleteDB[`movies/${movie.name}/ratings/${reCred.uid}`] = null;
              });
              deleteDB[`users/${reCred.uid}`] = null;
              update(ref(db), deleteDB)
                .then(() => {
                  reCred
                    .delete()
                    .then(() => {
                      setSuccess(true);
                    })
                    .catch((e) => {
                      setErrors((prev) => ({
                        ...prev,
                        currentPassword: e.message,
                      }));
                    });
                })
                .catch((e) => {
                  setErrors((prev) => ({...prev, currentPassword: e.message}));
                });
            }
          })
          .catch((e) => {
            setErrors((prev) => ({...prev, currentPassword: e.message}));
          });
        break;
    }
  };
  if (success) {
    return (
      <div className={loginStyle.logIn}>
        <Alert className={loginStyle.logOutBox} variant="success">
          <Alert.Heading>Success!</Alert.Heading>
          <p>Your {type} has been changed.</p>
          <Button variant="outline-success" onClick={back}>
            Close
          </Button>
        </Alert>
      </div>
    );
  }
  return (
    <div className={loginStyle.logIn}>
      <div className={loginStyle.logInBox}>
        <div className={loginStyle.logInTitle}>
          {type !== 'Delete' && <h2>Change {type}</h2>}
          {type === 'Delete' && <h2>Delete Account</h2>}
        </div>
        <Form className="form">
          {type === 'Email' && (
            <>
              <Form.Group as={Row} controlId="formBasicEmail">
                <Form.Label column>Current Email:</Form.Label>
                <Col>
                  <Form.Control
                    className="plainText"
                    plaintext
                    readOnly
                    defaultValue={currentEmail}
                  ></Form.Control>
                </Col>
              </Form.Group>
              <Form.Group controlId="newEmailForm">
                <Form.Label>New Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter New Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  isInvalid={errors.email !== ''}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formBasicCurrentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  isInvalid={errors.currentPassword !== ''}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}
          {type === 'Name' && (
            <>
              <Form.Group as={Row} controlId="formBasicName">
                <Form.Label column>Current Name:</Form.Label>
                <Col>
                  <Form.Control
                    className="plainText"
                    plaintext
                    readOnly
                    defaultValue={currentName}
                  ></Form.Control>
                </Col>
              </Form.Group>
              <Form.Group controlId="newNameForm">
                <Form.Label>New Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter New Name"
                  onChange={(e) => {
                    if (e.target.value.length <= 12) {
                      setName(e.target.value);
                    }
                  }}
                  value={name}
                  isInvalid={errors.displayName !== ''}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.displayName}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}
          {type === 'Password' && (
            <>
              <Form.Group controlId="formBasicCurrentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  isInvalid={errors.currentPassword !== ''}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formBasicNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={errors.password !== ''}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={errors.confirmPassword !== ''}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}
          {type === 'Delete' && (
            <>
              <Form.Text className="warning">
                Warning: This action will permanently delete your account!
              </Form.Text>
              <Form.Group controlId="formBasicCurrentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  isInvalid={errors.currentPassword !== ''}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="delete">
                <Form.Label>Enter 'DELETE' to delete your account.</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="enter DELETE"
                  onChange={(e) => setDeleteText(e.target.value)}
                  value={deleteText}
                />
              </Form.Group>
            </>
          )}
          <div className={loginStyle.logInButtons} data-testid="buttons">
            {type !== 'Delete' && (
              <Button
                variant="primary"
                type="submit"
                id="submitButton"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
            {type === 'Delete' && (
              <Button
                variant="warning"
                id="deleteButton"
                onClick={handleSubmit}
                disabled={deleteText !== 'DELETE'}
              >
                Delete Account
              </Button>
            )}
            <Button variant="danger" id="backButton" onClick={back}>
              Back
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangeProfileInfo;
