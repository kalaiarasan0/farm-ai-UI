import React from 'react';
import styled from 'styled-components';
import { ArrowLeft, Save, ChevronLeft } from 'lucide-react';
import { useCreatePurchaseForm } from '../hooks/useCreatePurchaseForm';

const Container = styled.div`
  padding: 1.5rem;
  color: var(--text-primary);
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border-color);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-primary);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
  }

  &:disabled {
    background-color: var(--bg-secondary);
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
  }
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



const CreatePurchase = () => {
    const {
        formData,
        loading,
        submitting,
        handleChange,
        handleBack,
        handleSubmit
    } = useCreatePurchaseForm();

    return (
        <Container>
            <Header>
                <BackButton onClick={handleBack}>
                    <ArrowLeft size={24} style={{ marginRight: '0.5rem' }} />
                </BackButton>
                <Title>Create Purchase</Title>
            </Header>

            <Form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup>
                        <Label>Material Name *</Label>
                        <Input
                            type="text"
                            name="material_name"
                            value={formData.material_name}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Type of Material *</Label>
                        <Input
                            type="text"
                            name="type_of_material"
                            value={formData.type_of_material}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup>
                        <Label>Purchase Date *</Label>
                        <Input
                            type="date"
                            name="purchase_date"
                            value={formData.purchase_date}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Expiry Date *</Label>
                        <Input
                            type="date"
                            name="material_expiry_date"
                            value={formData.material_expiry_date}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup>
                        <Label>Supplier *</Label>
                        <Input
                            type="text"
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Batch Number *</Label>
                        <Input
                            type="text"
                            name="batch_number"
                            value={formData.batch_number}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                </div>

                <FormGroup>
                    <Label>Material Description *</Label>
                    <Input
                        type="text"
                        name="material_description"
                        value={formData.material_description}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Notes *</Label>
                    <TextArea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup>
                        <Label>Quantity *</Label>
                        <Input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Unit Price *</Label>
                        <Input
                            type="number"
                            name="unit_price"
                            value={formData.unit_price}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                </div>

                <FormGroup>
                    <Label>Gross Price</Label>
                    <Input
                        type="number"
                        name="gross_price"
                        value={formData.gross_price}
                        readOnly
                        disabled
                    />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup>
                        <Label>Discount Amount</Label>
                        <Input
                            type="number"
                            name="discount_amount"
                            value={formData.discount_amount}
                            onChange={handleChange}
                            min="0"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Discount (%)</Label>
                        <Input
                            type="number"
                            name="discount_percentage"
                            value={formData.discount_percentage}
                            onChange={handleChange}
                            min="0"
                            max="100"
                        />
                    </FormGroup>
                </div>

                <FormGroup>
                    <Label>Total Price *</Label>
                    <Input
                        type="number"
                        name="total_price"
                        value={formData.total_price}
                        readOnly
                        disabled
                        style={{ fontWeight: 'bold' }}
                    />
                </FormGroup>

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

export default CreatePurchase;