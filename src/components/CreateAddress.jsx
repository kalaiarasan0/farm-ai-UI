import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
import Toast from './Toast';
import SearchableSelect from './SearchableSelect';
import { ArrowLeft, ChevronLeft, Save } from 'lucide-react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  padding: 24px;
  width: 100%;
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
  max-width: 900px;
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

const CreateAddress = () => {
    const navigate = useNavigate();
    const { customerId } = useParams();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        label: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'INDIA' // Default to India
    });

    const [errors, setErrors] = useState({});

    // Dropdown options
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [pincodes, setPincodes] = useState([]);

    useEffect(() => {
        loadStates();
    }, []);

    useEffect(() => {
        if (formData.state) {
            loadDistricts(formData.state);
        } else {
            setDistricts([]);
        }
    }, [formData.state]);

    useEffect(() => {
        if (formData.city) {
            loadPincodes(formData.city);
        } else {
            setPincodes([]);
        }
    }, [formData.city]);


    const loadStates = async () => {
        try {
            const data = await customerService.getStates();
            // Adjust if API returns objects, assuming array of strings for now based on SearchableSelect simple implementation
            setStates(data);
        } catch (err) {
            console.error("Failed to load states", err);
        }
    };

    const loadDistricts = async (state) => {
        try {
            const data = await customerService.getDistricts(state);
            setDistricts(data);
        } catch (err) {
            console.error("Failed to load districts", err);
        }
    };

    const loadPincodes = async (district) => {
        try {
            const data = await customerService.getPincodes(district);
            setPincodes(data);
        } catch (err) {
            console.error("Failed to load pincodes", err);
        }
    };

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

    const handleSelectChange = (name, value) => {
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
        if (!formData.label.trim()) newErrors.label = "Label is required";
        if (!formData.line1.trim()) newErrors.line1 = "Line 1 is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.postal_code.trim()) newErrors.postal_code = "Postal Code is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                customer_id: parseInt(customerId),
                ...formData
            };

            await customerService.createAddress(payload);
            setToast({ message: "Address created successfully!", type: "success" });

            setTimeout(() => {
                navigate(`/customers/${customerId}`);
            }, 1500);

        } catch (err) {
            console.error("Failed to create address", err);
            setToast({ message: `Failed to create address: ${err.message || 'Unknown error'}`, type: "error" });
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
                <Title>Create New Address</Title>
            </Header>

            <Form onSubmit={handleSubmit}>

                <FieldGroup>
                    <Label>Country</Label>
                    <InputWrapper>
                        <SearchableSelect
                            options={['INDIA']}
                            value={formData.country}
                            onChange={(val) => handleSelectChange('country', val)}
                            placeholder="Select Country"
                        />
                        {errors.country && <ErrorMessage>{errors.country}</ErrorMessage>}
                    </InputWrapper>
                </FieldGroup>

                <FieldGroup>
                    <Label>State</Label>
                    <InputWrapper>
                        <SearchableSelect
                            options={states}
                            value={formData.state}
                            onChange={(val) => handleSelectChange('state', val)}
                            placeholder="Select State"
                        />
                        {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                    </InputWrapper>
                </FieldGroup>

                <FieldGroup>
                    <Label>City</Label>
                    <InputWrapper>
                        <SearchableSelect
                            options={districts}
                            value={formData.city}
                            onChange={(val) => handleSelectChange('city', val)}
                            placeholder="Select City"
                        />
                        {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
                    </InputWrapper>
                </FieldGroup>

                <FieldGroup>
                    <Label>Postal Code</Label>
                    <InputWrapper>
                        <SearchableSelect
                            options={pincodes}
                            value={formData.postal_code} // Assuming API returns strings or convert numbers to strings
                            onChange={(val) => handleSelectChange('postal_code', val)}
                            placeholder="Select Postal Code"
                        />
                        {errors.postal_code && <ErrorMessage>{errors.postal_code}</ErrorMessage>}
                    </InputWrapper>
                </FieldGroup>

                <FieldGroup>
                    <Label>Line 1</Label>
                    <InputWrapper>
                        <Input
                            name="line1"
                            value={formData.line1}
                            onChange={handleChange}
                            placeholder="Building, Street"
                        />
                        {errors.line1 && <ErrorMessage>{errors.line1}</ErrorMessage>}
                    </InputWrapper>
                </FieldGroup>

                <FieldGroup>
                    <Label>Line 2</Label>
                    <InputWrapper>
                        <Input
                            name="line2"
                            value={formData.line2}
                            onChange={handleChange}
                            placeholder="Area, Landmark"
                        />
                    </InputWrapper>
                </FieldGroup>

                <FieldGroup>
                    <Label>Label</Label>
                    <InputWrapper>
                        <Input
                            name="label"
                            value={formData.label}
                            onChange={handleChange}
                            placeholder="e.g. Home, Office"
                        />
                        {errors.label && <ErrorMessage>{errors.label}</ErrorMessage>}
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

export default CreateAddress;
