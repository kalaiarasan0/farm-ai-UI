import React from 'react';
import styled from 'styled-components';
import { ArrowLeft, Save } from 'lucide-react';
import capitalizeFirstLetter from '../utils/common_functions';
import { useCreateOrderForm } from '../hooks/useCreateOrderForm';

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

const Select = styled.select`
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

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  align-self: flex-start;

  &:hover {
    background-color: var(--primary-hover);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  color: var(--error-color);
  font-size: 0.875rem;
`;

const InfoText = styled.div`
  background-color: var(--bg-secondary);
  padding: 1rem;
  border-radius: 6px;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const CreateOrder = () => {
    const {
        customers,
        categories,
        addresses,
        formData,
        sameAsBilling,
        setSameAsBilling,
        inventory,
        submitting,
        calculated,
        handleChange,
        handleSubmit,
        navigate
    } = useCreateOrderForm();

    return (
        <Container>
            <Header>
                <BackButton onClick={() => navigate('/orders')}>
                    <ArrowLeft size={24} style={{ marginRight: '0.5rem' }} />
                </BackButton>
                <Title>Place New Order</Title>
            </Header>

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Customer</Label>
                    <Select
                        name="customer_id"
                        value={formData.customer_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers.map(c => (
                            <option key={c.customer_id} value={c.customer_id}>
                                {capitalizeFirstLetter(c.first_name)} {capitalizeFirstLetter(c.last_name)} (ID: {c.customer_id})
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                {formData.customer_id && (
                    <>
                        <FormGroup>
                            <Label>Billing Address</Label>
                            <Select
                                name="billing_address_id"
                                value={formData.billing_address_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Billing Address</option>
                                {addresses.map(addr => (
                                    <option key={addr.address_id} value={addr.address_id}>
                                        {addr.label}, {addr.line2}, {addr.city}, {addr.postal_code}
                                    </option>
                                ))}
                            </Select>
                        </FormGroup>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="sameAsBilling"
                                checked={sameAsBilling}
                                onChange={(e) => setSameAsBilling(e.target.checked)}
                            />
                            <Label htmlFor="sameAsBilling" style={{ fontWeight: 'normal' }}>Shipping address same as billing</Label>
                        </div>

                        <FormGroup>
                            <Label>Shipping Address</Label>
                            <Select
                                name="shipping_address_id"
                                value={formData.shipping_address_id}
                                onChange={handleChange}
                                required
                                disabled={sameAsBilling}
                            >
                                <option value="">Select Shipping Address</option>
                                {addresses.map(addr => (
                                    <option key={addr.address_id} value={addr.address_id}>
                                        {addr.label}, {addr.line2}, {addr.city}, {addr.postal_code}
                                    </option>
                                ))}
                            </Select>
                        </FormGroup>
                    </>
                )}

                <FormGroup>
                    <Label>Category / Product</Label>
                    <Select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Product</option>
                        {categories.map(p => (
                            <option key={p.category_id} value={p.category_id}>
                                {p.name}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                {inventory ? (
                    <InfoText>
                        <strong>Available Quantity:</strong> {inventory.quantity}<br />
                        <strong>Unit Price:</strong> {inventory.unit_price}
                    </InfoText>
                ) : formData.category_id ? (
                    <InfoText>Checking inventory...</InfoText>
                ) : null}

                <FormGroup>
                    <Label>Quantity</Label>
                    <Input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        max={inventory?.quantity}
                        required
                        disabled={!inventory}
                    />
                    {inventory && parseInt(formData.quantity) > inventory.quantity && (
                        <ErrorText>Quantity cannot exceed {inventory.quantity}</ErrorText>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label>Price Per Quantity</Label>
                    <Input
                        type="number"
                        name="unit_price"
                        value={formData.unit_price}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Gross Total Price</Label>
                    <Input
                        type="text"
                        value={calculated.grossTotal}
                        disabled
                        readOnly
                    />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup>
                        <Label>Discount Value</Label>
                        <Input
                            type="number"
                            name="discount_value"
                            value={formData.discount_value}
                            onChange={handleChange}
                            min="0"
                            placeholder="0.00"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Discount (%)</Label>
                        <Input
                            type="number"
                            name="discount_percent"
                            value={formData.discount_percent}
                            onChange={handleChange}
                            // min="0"
                            max="100"
                            placeholder="0%"
                        />
                    </FormGroup>
                </div>

                <FormGroup>
                    <Label>Net Total (Gross Price - Discounts)</Label>
                    <Input
                        type="text"
                        value={calculated.netTotal}
                        disabled
                        readOnly
                        style={{ fontWeight: 'bold' }}
                    />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FormGroup>
                        <Label>Shipping Cost</Label>
                        <Input
                            type="number"
                            name="shipping"
                            value={formData.shipping}
                            onChange={handleChange}
                            min="0"
                            placeholder="0.00"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Tax</Label>
                        <Input
                            type="number"
                            name="tax"
                            value={formData.tax}
                            onChange={handleChange}
                            min="0"
                            placeholder="0.00"
                        />
                    </FormGroup>
                </div>



                <FormGroup>
                    <Label>Grand Total (Order)</Label>
                    <Input
                        type="text"
                        value={calculated.orderTotal}
                        disabled
                        readOnly
                        style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary-color)' }}
                    />
                </FormGroup>

                <Button type="submit" disabled={submitting || !inventory || (parseInt(formData.quantity) > inventory.quantity)}>
                    <Save size={20} />
                    Place Order
                </Button>
            </Form>
        </Container>
    );
};

export default CreateOrder;
