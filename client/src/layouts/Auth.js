import React, {useState} from 'react';
import {
  Button,
  Container,
  FormControl,
  Grid,
  Paper,
  TextField,
} from '@material-ui/core';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // handle login logic...
    console.log('handling');
  };

  return (
    <Container style={{display: 'flex', justifyContent: 'center'}}>
      <Grid item sm={6} xs={12}>
        <Paper>
          <Container>
            <h5 style={{paddingTop: '15px'}}>Access to CW Admin</h5>
            <h6>Admin Site</h6>
            <br />
            <form
              onSubmit={e => {
                e.preventDefault();
                handleLogin();
              }}>
              <FormControl className="custom-field-form">
                <TextField
                  label="Email"
                  variant="outlined"
                  size="small"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl className="custom-field-form">
                <TextField
                  label="Password"
                  variant="outlined"
                  size="small"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </FormControl>
              <br />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth>
                Login
              </Button>
            </form>
            <br />
          </Container>
        </Paper>
      </Grid>
    </Container>
  );
}

Auth.propTypes = {};
