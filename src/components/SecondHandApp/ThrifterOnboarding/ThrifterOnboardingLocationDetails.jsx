import React from 'react';
import { Button, Form, Input, Alert, Spin, App } from 'antd';
import CardLayout from '../../shared/CardLayout';
import Typography from 'antd/es/typography/Typography';
import { useCurrentUser, users } from '../../../api';
import { usePlacesWidget } from 'react-google-autocomplete';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const ThrifterOnboardingLocationDetails = ({onNext, onPrev}) => {
  const { currentUser, isLoading: isUserLoading}  = useCurrentUser();
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleSubmit = async ({address}) => {
    setSubmitting(true);
    try {
      const {error} = await users.updateCurrent({address});
      if (error) throw new Error(error);
      message.success('Your address has been saved!');
      onNext();
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  const { ref: placesWidgetRef } = usePlacesWidget({
    apiKey: googleMapsApiKey,
    onPlaceSelected: (place) => {
      form.setFieldsValue({ address: place.formatted_address });
    },
    options: {
      types: ['address'],
      componentRestrictions: { country: 'us' },
    },
  });

  if (isUserLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin size="large" style={{marginTop: 16}}/>
    </div>
  );

  // This is a workaround for the issue where the Enter key triggers the form submission
  // when the user is trying to select an address from the Google Places Autocomplete dropdown
  const handleKeyDown = (e) => {
    const placesWidget = placesWidgetRef.current;
    if (placesWidget && e.key === 'Enter') {
      e.preventDefault();
    }
  }

  return (
    <CardLayout title="Where Do You Thrive?">
      <Typography.Paragraph>
        Your local area is a treasure trove of finds. Sharing your location helps us connect you with customers eager for local gems.
      </Typography.Paragraph>
      <Form
        name="thrifter-onboarding-location-details"
        onChange={() => setError('')}
        onFinish={handleSubmit}
        form={form}
        initialValues={{ address: currentUser?.address }}
      >
        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: true,
              message: 'Please input your address!',
            },
          ]}
        >
          <Input.Search
            placeholder="Enter your address"
            ref={(c) => placesWidgetRef.current = c?.input }
            onKeyDown={handleKeyDown}
            autoComplete='off'
          />
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="link" onClick={onPrev} style={{padding: 0}}>Back</Button>
            <Button type="primary" htmlType="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Form.Item>
        {error && <Alert message={error} type="error" />}
      </Form>
    </CardLayout>
  );
}

export default ThrifterOnboardingLocationDetails;
