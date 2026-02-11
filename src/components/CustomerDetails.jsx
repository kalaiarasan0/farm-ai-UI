import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
import Toast from './Toast';
import Modal from './Modal';
import { Pencil, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import styled from 'styled-components';

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

const CreateButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  
  &:hover {
    background-color: var(--primary-hover, #0056b3);
  }
`;

const DeleteButton = styled.button`
  background-color: var(--error-color, #ef4444);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  
  &:hover {
    background-color: #dc2626;
  }
`;


const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 100%; /* Increased width for grid */
`;

const Section = styled.div`
  background: var(--card-bg);
  padding: 32px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
`;

// --- New Grid Components ---
const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  position: relative;
  
  &:hover .edit-icon {
    opacity: 1;
  }
`;

const DetailLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  word-break: break-word;
`;

const EditIconWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  color: var(--text-secondary);
  opacity: 0; /* Hidden by default */
  transition: opacity 0.2s, color 0.2s;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: var(--primary-color);
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  /* Show on mobile by default or leave hidden? 
     Let's keep it hover for desktop, maybe always visible on touch? 
  */
  @media (pointer: coarse) {
    opacity: 1;
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

// Address Table Styling
const AddressTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 1rem;
  border-bottom: 1px solid var(--table-border);
  color: var(--table-header-text);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  background-color: var(--table-header-bg);
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--table-border);
  background-color: var(--table-row-bg);
  
  &:hover {
    background-color: var(--table-row-hover);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 1rem;
  color: var(--text-primary);
`;

// Modal Handlers
const ModalInput = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid var(--input-border);
    border-radius: 6px;
    background-color: var(--input-bg);
    color: var(--text-primary);
    font-size: 16px;
    margin-bottom: 20px;

    &:focus {
        outline: none;
        border-color: var(--primary-color);
    }
`;

const ModalButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`;

const Button = styled.button`
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    
    &.cancel {
        background-color: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        &:hover { background-color: var(--bg-secondary); }
    }

    &.save {
        background-color: var(--primary-color);
        color: white;
        &:hover { background-color: var(--primary-hover); }
    }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  padding: 0.25rem;
  
  &:hover {
    color: var(--primary-color);
    background: none;
  }
`;


const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalField, setModalField] = useState(null); // { key: 'firstName', label: 'First Name', value: '...' }
  const [modalValue, setModalValue] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [customerData, addressData] = await Promise.all([
        customerService.getCustomerById(id),
        customerService.getCustomerAddresses(id)
      ]);
      setCustomer(customerData);
      setAddresses(addressData || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleEditClick = (key, label, value) => {
    setModalField({ key, label });
    setModalValue(value);
    setIsModalOpen(true);
  };

  const handleModalSave = async () => {
    if (!modalField) return;

    try {
      const payload = {
        [modalField.key]: modalValue
      };

      await customerService.updateCustomer(customer.customer_id, payload);

      setCustomer(prev => ({
        ...prev,
        [modalField.key]: modalValue
      }));

      setToast({ message: `Updated ${modalField.label} successfully!`, type: 'success' });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update failed", err);
      setToast({ message: `Failed to update ${modalField.label}: ${err.message}`, type: 'error' });
    }
  };

  const handleAddressRowClick = (addressId) => {
    navigate(`/addresses/${addressId}`);
  };

  const handleDeleteCustomer = async () => {
    if (window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      try {
        await customerService.deleteCustomer(id);
        setToast({ message: "Customer deleted successfully", type: "success" });
        setTimeout(() => {
          navigate('/customers');
        }, 1500);
      } catch (err) {
        console.error("Delete failed", err);
        setToast({ message: `Failed to delete customer: ${err.message}`, type: 'error' });
      }
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address? This action cannot be undone.")) {
      try {
        await customerService.deleteAddress(addressId);
        setToast({ message: "Address deleted successfully", type: "success" });
        setTimeout(() => {
          navigate(`/customers/${customer.customer_id}`);
        }, 1500);
      } catch (err) {
        console.error("Delete failed", err);
        setToast({ message: `Failed to delete address: ${err.message}`, type: 'error' });
      }
    }
  };

  const renderDetailItem = (label, key, isReadOnly = false) => {
    if (!customer) return null;
    const value = customer[key] || '-';

    return (
      <DetailItem className="group">
        <DetailLabel>{label}</DetailLabel>
        <DetailValue>{value}</DetailValue>
        {!isReadOnly && (
          <EditIconWrapper className="edit-icon" onClick={() => handleEditClick(key, label, value)}>
            <Pencil size={16} />
          </EditIconWrapper>
        )}
      </DetailItem>
    );
  };

  if (loading) return <LoadingWrapper>Loading Customer details...</LoadingWrapper>;
  if (error) return <ErrorWrapper>Error: {error}</ErrorWrapper>;
  if (!customer) return <ErrorWrapper>Customer not found</ErrorWrapper>;

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
        <Title>Customer Details</Title>
        <div style={{ marginLeft: 'auto' }}>
          <DeleteButton onClick={handleDeleteCustomer}>
            <Trash2 size={18} /> Delete
          </DeleteButton>
        </div>
      </Header>

      <ContentWrapper>
        <Section>
          <SectionTitle>Basic Information</SectionTitle>
          <DetailGrid>
            {renderDetailItem("Customer ID", "customer_id", true)}
            {renderDetailItem("First Name", "first_name")}
            {renderDetailItem("Last Name", "last_name")}
            {renderDetailItem("Email", "email")}
            {renderDetailItem("Phone", "phone")}
            {renderDetailItem("Created At", "created_at", true)}
          </DetailGrid>
        </Section>

        <Section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            <SectionTitle style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>Addresses</SectionTitle>
            <CreateButton
              onClick={() => navigate(`/customers/${customer.customer_id}/addresses/new`)}
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              <Plus size={12} /> Add Address
            </CreateButton>
          </div>
          {addresses.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No addresses found.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <AddressTable>
                <thead>
                  <tr>
                    <Th>Label</Th>
                    <Th>Line 1</Th>
                    <Th>City</Th>
                    <Th>State</Th>
                    <Th>Postal Code</Th>
                    <Th>Country</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map(addr => (
                    <Tr key={addr.address_id} onClick={() => handleAddressRowClick(addr.address_id)}>
                      <Td>{addr.label}</Td>
                      <Td>{addr.line1}</Td>
                      <Td>{addr.city}</Td>
                      <Td>{addr.state}</Td>
                      <Td>{addr.postal_code}</Td>
                      <Td>{addr.country}</Td>
                      <Td>
                        <ActionButton onClick={() => handleDeleteAddress(addr.address_id)}>
                          <Trash2 size={18} />
                        </ActionButton>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </AddressTable>
            </div>
          )}
        </Section>
      </ContentWrapper>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit ${modalField?.label || 'Field'}`}
      >
        <ModalInput
          autoFocus
          value={modalValue}
          onChange={(e) => setModalValue(e.target.value)}
        />
        <ModalButtonContainer>
          <Button className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button className="save" onClick={handleModalSave}>Update</Button>
        </ModalButtonContainer>
      </Modal>

    </Container>
  );
};
export default CustomerDetails;
