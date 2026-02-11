import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
import Toast from './Toast';
import SearchableSelect from './SearchableSelect';
import { Pencil, Check, X, ArrowLeft } from 'lucide-react';
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

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  background: var(--card-bg);
  padding: 32px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
  margin: 0 auto;
`;

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const inputStyles = css`
  width: 100%;
  flex: 1;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid ${({ $isEditing }) =>
    $isEditing ? 'var(--primary-color)' : 'var(--input-border)'};
  background-color: ${({ $isEditing }) =>
    $isEditing ? 'var(--input-bg)' : 'transparent'};
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

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  cursor: pointer;
  flex-shrink: 0;

  color: var(--text-secondary);
  transition: all 0.2s;

  &:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }

  &.save:hover {
    color: #4ade80;
    border-color: #22c55e;
    background-color: rgba(34, 197, 94, 0.1);
  }

  &.cancel:hover {
    color: #ef4444;
    border-color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
  }
  
  & > svg {
    stroke: currentColor;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  font-size: 18px;
  color: var(--text-secondary);
`;

const ErrorWrapper = styled.div`
  padding: 20px;
  color: #ef4444;
  text-align: center;
`;

const AddressDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  // Dropdown options state
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [pincodes, setPincodes] = useState([]);

  useEffect(() => {
    fetchAddress();
  }, [id]);

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAddressById(id);
      setAddress(data);
    } catch (err) {
      // console.error("Failed to fetch address", err);
      setError(err.message || "Failed to load address");
    } finally {
      setLoading(false);
    }
  };

  // Load options dynamically based on field
  const loadOptions = async (field) => {
    try {
      if (field === 'state') {
        // only fetch if not already loaded or simple cache logic
        const data = await customerService.getStates();
        setStates(data);
      } else if (field === 'city' && address.state) {
        const data = await customerService.getDistricts(address.state);
        setDistricts(data);
      } else if (field === 'postal_code' && address.city) {
        const data = await customerService.getPincodes(address.city);
        setPincodes(data);
      }
    } catch (err) {
      // console.error(`Failed to load options for ${field}`, err);
      setToast({ message: `Failed to load options: ${err.message}`, type: 'error' });
    }
  }

  const handleEditStart = async (field, value) => {
    setEditingField(field);
    setTempValue(value || "");

    // Load options if it's a dropdown field
    if (['state', 'city', 'postal_code'].includes(field)) {
      await loadOptions(field);
    }
  };

  const handleUpdate = async (field) => {
    try {
      const payload = {
        customer_id: address.customer_id,
        [field]: tempValue
      };

      await customerService.updateAddress(address.address_id, payload);

      setAddress(prev => ({
        ...prev,
        [field]: tempValue
      }));

      // If state changed, clear city/pincode logic could be applied here if needed
      // But for simple update, we just update.
      // However, inconsistent data might occur (e.g. State changed, but City remains from old State).
      // For now, follow simple field update logic.

      setToast({ message: `Updated ${field} successfully!`, type: 'success' });
      setEditingField(null);
    } catch (err) {
      // console.error("Update failed", err);
      setToast({ message: `Failed to update ${field}: ${err.message}`, type: 'error' });
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const renderField = (label, fieldKey, isReadOnly = false, type = "text") => {
    if (!address) return null;

    const isEditing = editingField === fieldKey;
    const value = isEditing ? tempValue : (address[fieldKey] || '');

    let inputComponent;

    if (isEditing && type === "select") {
      let opts = [];
      if (fieldKey === 'country') opts = ['India'];
      if (fieldKey === 'state') opts = states;
      if (fieldKey === 'city') opts = districts;
      if (fieldKey === 'postal_code') opts = pincodes;

      inputComponent = (
        <div style={{ flex: 1 }}>
          <SearchableSelect
            options={opts}
            value={value}
            onChange={(val) => setTempValue(val)}
            placeholder={`Select ${label}`}
          />
        </div>
      );
    } else {
      inputComponent = (
        <Input
          value={value}
          readOnly={!isEditing}
          $isEditing={isEditing}
          onChange={(e) => setTempValue(e.target.value)}
        />
      );
    }

    return (
      <FieldGroup>
        <Label>{label}</Label>
        <InputWrapper>
          {inputComponent}

          {!isReadOnly && (
            <>
              {isEditing ? (
                <>
                  <IconButton className="save" onClick={() => handleUpdate(fieldKey)}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2px" }}>
                      <Check size={18} />
                    </div>
                  </IconButton>
                  <IconButton className="cancel" onClick={handleCancelEdit}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2px" }}>
                      <X size={18} />
                    </div>
                  </IconButton>
                </>
              ) : (
                <IconButton onClick={() => handleEditStart(fieldKey, address[fieldKey])}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2px" }}>
                    <Pencil size={18} />
                  </div>
                </IconButton>
              )}
            </>
          )}
        </InputWrapper>
      </FieldGroup>
    );
  };

  if (loading) return <LoadingWrapper>Loading Address details...</LoadingWrapper>;
  if (error) return <ErrorWrapper>Error: {error}</ErrorWrapper>;
  if (!address) return <ErrorWrapper>Address not found</ErrorWrapper>;

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
        <Title>Address Details</Title>
      </Header>

      <Form>
        {/* {renderField("Address ID", "address_id", true)} */}
        {renderField("Customer Name", "customer_name", true)}
        {renderField("Country", "country", false, "select")}
        {renderField("State", "state", false, "select")}
        {renderField("City", "city", false, "select")}
        {renderField("Postal Code", "postal_code", false, "select")}
        {renderField("Line 1", "line1")}
        {renderField("Line 2", "line2")}
        {renderField("Label", "label")}
      </Form>
    </Container>
  );
};
export default AddressDetails;
