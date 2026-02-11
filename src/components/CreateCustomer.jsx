import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
import Toast from './Toast';
import { ArrowLeft, ChevronLeft, Save } from 'lucide-react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  color: var(--text-primary);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  color: var(--text-primary);
  &:hover {
    background-color: var(--bg-secondary);
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  background: var(--card-bg);
  padding: 32px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
`;

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  padding-top: 12px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const inputStyles = css`
  width: 100%;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: var(--input-border-focus);
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  border: 1px solid transparent;

  &.cancel {
    background-color: transparent;
    border-color: var(--border-color);
    color: var(--text-secondary);
    &:hover {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }
  }

  &.submit {
    background-color: var(--primary-color);
    color: white;
    &:hover {
      background-color: var(--button-hover);
    }
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

const CreateCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await customerService.createCustomer(formData);
      setToast({ message: "Customer created successfully!", type: "success" });

      setTimeout(() => {
        navigate('/customers');
      }, 1500);

    } catch (err) {
      console.error("Failed to create customer", err);
      // Detailed error handling is done in http.js via toast, but we can set form errors if structure allows
      // For now, relying on toast from http.js or fallback here
      setToast({ message: `Failed to create customer: ${err.message || 'Unknown error'}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </BackButton>
        <Title>Create New Customer</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label>First Name</Label>
          <InputWrapper>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
            />
            {errors.first_name && <ErrorMessage>{errors.first_name}</ErrorMessage>}
          </InputWrapper>
        </FieldGroup>

        <FieldGroup>
          <Label>Last Name</Label>
          <InputWrapper>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
            />
            {errors.last_name && <ErrorMessage>{errors.last_name}</ErrorMessage>}
          </InputWrapper>
        </FieldGroup>

        <FieldGroup>
          <Label>Email</Label>
          <InputWrapper>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputWrapper>
        </FieldGroup>

        <FieldGroup>
          <Label>Phone</Label>
          <InputWrapper>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          </InputWrapper>
        </FieldGroup>

        <ButtonGroup>
          <Button type="button" className="cancel" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            Cancel
          </Button>
          <Button type="submit" className="submit" disabled={loading}>
            <Save size={20} />
            {loading ? 'Creating...' : 'Save'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default CreateCustomer;
