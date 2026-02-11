import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
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
  padding-top: 12px; /* Align with input text */
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

const Textarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 100px;
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

const CreateCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    sku: '',
    species: '',
    name: '',
    description: '',
    base_price: '',
    specs: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.species.trim()) newErrors.species = "Species is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.base_price) {
      newErrors.base_price = "Base price is required";
    } else if (isNaN(formData.base_price) || Number(formData.base_price) <= 0) {
      newErrors.base_price = "Base price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Ensure base_price is a number
      const payload = {
        ...formData,
        base_price: Number(formData.base_price)
      };

      await categoryService.createCategory(payload);
      setToast({ message: "Category created successfully!", type: "success" });

      // Delay navigation a bit to show success message
      setTimeout(() => {
        navigate('/category');
      }, 1500);

    } catch (err) {
      console.error("Failed to create category", err);
      setToast({ message: `Failed to create category: ${err.message || 'Unknown error'}`, type: "error" });
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
        <Title>Create New Category</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label>SKU</Label>
          <InputWrapper>
            <Input
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
            />
            {errors.sku && <ErrorMessage>{errors.sku}</ErrorMessage>}
          </InputWrapper>
        </FieldGroup>

        <FieldGroup>
          <Label>Species</Label>
          <InputWrapper>
            <Input
              name="species"
              value={formData.species}
              onChange={handleChange}
              placeholder="e.g. Goat, Chicken"
            />
            {errors.species && <ErrorMessage>{errors.species}</ErrorMessage>}
          </InputWrapper>
        </FieldGroup>

        <FieldGroup>
          <Label>Name</Label>
          <InputWrapper>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Category Name"
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </InputWrapper>
        </FieldGroup>

        <FieldGroup>
          <Label>Base Price</Label>
          <InputWrapper>
            <Input
              name="base_price"
              type="number"
              step="0.01"
              value={formData.base_price}
              onChange={handleChange}
              placeholder="0.00"
            />
            {errors.base_price && <ErrorMessage>{errors.base_price}</ErrorMessage>}
          </InputWrapper>
        </FieldGroup>

        <FieldGroup>
          <Label>Specs</Label>
          <InputWrapper>
            <Input
              name="specs"
              value={formData.specs}
              onChange={handleChange}
              placeholder="Category specifications"
            />
          </InputWrapper>
        </FieldGroup>

        <FieldGroup>
          <Label>Description</Label>
          <InputWrapper>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Category description..."
            />
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

export default CreateCategory;
