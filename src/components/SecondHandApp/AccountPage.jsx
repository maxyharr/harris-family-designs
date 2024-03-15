import { Button, Card, Col, Form, Row, Spin, Typography, Input, Alert } from 'antd';
import React from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCurrentUser, users, auth } from '../../api';
import { row, card } from '../../styles';
import FullPageSpinner from '../shared/FullPageSpinner';
import { mutate } from 'swr';

const AccountPage = () => {
  const [initialFormSet, setInitialFormSet] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState({ type: '', message: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',

    email: '',

    password: '',
    passwordConfirmation: '',

    currentPassword: '',
  });

  const { data: currentUser, error: currentUserError, isLoading } = useCurrentUser();

  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    if (currentUser && !initialFormSet) {
      setForm({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        password: '',
        passwordConfirmation: '',
        currentPassword: '',
      });

      setInitialFormSet(true);
    }
  }, [currentUser])

  const navigate = useNavigate();
  const logout = async () => {
    await auth.logout();
    navigate('/login');
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await users.update(form);
      mutate('/users/current');
      setSubmitMessage({
        type: 'success',
        message: 'Account updated! If you changed your email, please check your inbox for a confirmation email.'
      });
    } catch (error) {
      setSubmitMessage({ type: 'error', message: error.message, });
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading || !currentUser) {
    return <FullPageSpinner />;
  }

  return (
    <Row>
      <Col
        span={24}
        style={row.flexRowCenterCenter}
      >
        <Card
          title="My Account"
          extra={<Button onClick={logout}>Logout</Button>}
          style={card.standard}
        >
          <Form name="userInfo" layout="vertical" onFinish={handleSubmit} onChange={() => setSubmitMessage({ type: '', message: '' })}>
            <Form.Item label="First Name">
              <Input value={form.firstName} onChange={ e => setForm({ ...form, firstName: e.target.value }) } />
            </Form.Item>

            <Form.Item label="Last Name">
              <Input value={form.lastName} onChange={ e => setForm({ ...form, lastName: e.target.value }) } />
            </Form.Item>

            <Form.Item rules={{ required: true, message: 'Please input your email' }} label="Email" >
              <Input value={form.email} onChange={ e => setForm({ ...form, email: e.target.value }) } />
              {form.email !== currentUser.email && (
                <>
                  <Button size='small' type='link' onClick={() => setForm({...form, email: currentUser.email})}>reset</Button>
                  <Typography.Text type="secondary">
                    Changing your email will require you to confirm the new email address
                  </Typography.Text>
                </>
              )}
            </Form.Item>

            <Form.Item label="Change Password" >
              <Input type="password" value={form.password} onChange={ e => setForm({ ...form, password: e.target.value }) } />
            </Form.Item>

            <Form.Item label="Change Password Confirmation" >
              <Input type="password" value={form.passwordConfirmation} onChange={ e => setForm({ ...form, passwordConfirmation: e.target.value }) } />
            </Form.Item>

            <Form.Item rules={{ required: true, message: 'Current password is required to make updates' }} label="Current Password" >
              <Input type="password" value={form.currentPassword} onChange={ e => setForm({ ...form, currentPassword: e.target.value }) } />
            </Form.Item>

            <Form.Item>
              <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <Button disabled={submitting} type="primary" htmlType="submit" style={{
                    display: 'block',
                    marginRight: 'auto',
                  }}>
                  { submitting ? 'Submitting...' : 'Save' }
                </Button>
              </div>
            </Form.Item>
          </Form>
          {currentUserError && <Alert type="error" message={currentUserError.message} />}
          {submitMessage?.message && <Alert type={submitMessage.type} message={submitMessage.message} />}
        </Card>
      </Col>
    </Row>
  );
}

export default AccountPage;