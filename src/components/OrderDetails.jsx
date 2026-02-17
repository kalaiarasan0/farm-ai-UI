import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash, Pencil } from 'lucide-react';
import { orderService } from '../services/orderService';
import { animalService } from '../services/animalService';
import capitalizeFirstLetter from '../utils/common_functions';
import { formatDateTime } from '../utils/common_functions';
import Modal from './Modal';
import { toastEventEmitter } from '../utils/toastEventEmitter';

const Container = styled.div`
  padding: 1.5rem;
  color: var(--text-primary);
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

const Section = styled.div`
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const Value = styled.span`
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 500;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--table-border);
  color: var(--table-header-text);
  font-weight: 600;
  font-size: 0.875rem;
  background-color: var(--table-header-bg);
`;

const Tr = styled.tr`
  border-bottom: 1px solid var(--table-border);
  background-color: var(--table-row-bg);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  color: var(--text-primary);
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
    background-color: var(--primary-hover);
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 6px;
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
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

  &:hover {
    background-color: var(--primary-hover);
  }
`;

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ animalId: '', orderItemId: '' });
    const [animalLookups, setAnimalLookups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [updateOrderStatus, setUpdateOrderStatus] = useState('');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const fetchOrder = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getOrderById(id);
            setOrder(data);
        } catch (err) {
            // console.error("Error fetching order details:", err);
            setError("Failed to load order details.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const fetchAnimalLookup = useCallback(async (query = '') => {
        try {
            // Pass filter params if orderItemId is present (which it should be when modal is open)
            const params = {};
            if (modalData.orderItemId) {
                params.filter = 'order_item';
                params.order_item_id = modalData.orderItemId;
                params.animal_status = 'in_inventory';
            }
            const data = await animalService.getLookup(query, params);
            setAnimalLookups(data);
        } catch (err) {
            // console.error("Error fetching animal lookup:", err);
            toastEventEmitter.emit(`${err}`, "error");
        }
    }, [modalData.orderItemId]);

    useEffect(() => {
        if (isModalOpen) {
            fetchAnimalLookup();
        }
    }, [isModalOpen, fetchAnimalLookup]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        // Debounce or just call directly if not too frequent. calling directly for now as per user request flow implies real-time feel or enter.
        // Let's call on change but heavily debounced or just on Enter? 
        // User asked: "opem modal option to select the animal lookup and search lookup by tag-id option"
        // Let's fetch on change for better UX
        const timeoutId = setTimeout(() => {
            fetchAnimalLookup(query);
        }, 500);
        return () => clearTimeout(timeoutId);
    };

    const handleModalOpen = (orderItemId) => {
        setModalData({ ...modalData, orderItemId });
        setSearchQuery('');
        setAnimalLookups([]);
        setIsModalOpen(true);
    };


    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            await orderService.mapAnimalToOrderItem(modalData.animalId, modalData.orderItemId);
            toastEventEmitter.emit("Animal mapped successfully", "success");
            setIsModalOpen(false);
            setModalData({ animalId: '', orderItemId: '' });
            fetchOrder(); // Refresh order details
        } catch (error) {
            // console.error("Error mapping animal:", error);
            toastEventEmitter.emit(`${error}`, "error");
        }
    };

    const handleRemoveAnimal = async (animalId, orderItemId) => {
        try {
            await orderService.removeAnimalToOrderItem(animalId, orderItemId);
            toastEventEmitter.emit("Animal removed successfully", "success");
            fetchOrder(); // Refresh order details
        } catch (error) {
            // console.error("Error removing animal:", error);
            toastEventEmitter.emit(`${error}`, "error");
        }
    };

    const handleUpdateOrderStatus = async (e) => {
        e.preventDefault();
        try {
            await orderService.updateOrderStatus(id, updateOrderStatus);
            toastEventEmitter.emit("Order status updated successfully", "success");
            setIsUpdateModalOpen(false); // Close the modal
            fetchOrder(); // Refresh order details
        } catch (error) {
            // console.error("Error updating order status:", error);
            toastEventEmitter.emit(`${error}`, "error");
        }
    };

    const handleUpdateOrderStatusChange = (e) => {
        setUpdateOrderStatus(e.target.value);
    };

    if (loading) {
        return (
            <Container>
                <Header>
                    <BackButton onClick={() => navigate('/orders')}>
                        <ArrowLeft size={24} style={{ marginRight: '0.5rem' }} />
                    </BackButton>
                    <Title>Order Details</Title>
                </Header>
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container>
                <Header>
                    <BackButton onClick={() => navigate('/orders')}>
                        <ArrowLeft size={24} style={{ marginRight: '0.5rem' }} />
                    </BackButton>
                    <Title>Order Details</Title>
                </Header>
                <div style={{ color: 'var(--error-color)' }}>{error || 'Order not found'}</div>
            </Container>
        );
    }

    const { customer, items, shipping_address, billing_address, animals } = order;

    return (
        <Container>
            <Header>
                <BackButton onClick={() => navigate('/orders')}>
                    <ArrowLeft size={24} style={{ marginRight: '0.5rem' }} />
                </BackButton>
                <Title>Order #{order.order_number}</Title>
            </Header>

            <Section>
                <SectionTitle>Order Information {capitalizeFirstLetter(order.status)}</SectionTitle>
                <Grid>
                    <Field>
                        <Label>Order Number</Label>
                        <Value>{order.order_number}</Value>
                    </Field>
                    <Field>
                        <Label>Total Amount</Label>
                        <Value>{order.total}</Value>
                    </Field>
                    <Field>
                        <Label>Subtotal</Label>
                        <Value>{order.subtotal}</Value>
                    </Field>
                    <Field>
                        <Label>Order Date</Label>
                        <Value>{formatDateTime(order.order_date)}</Value>
                    </Field>
                    <Field>
                        <Label>Shipping Cost</Label>
                        <Value>{order.shipping}</Value>
                    </Field>
                    <Field>
                        <Label>Tax</Label>
                        <Value>{order.tax}</Value>
                    </Field>
                    <Field>
                        <Label>Status <Pencil size={12} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} onClick={() => {
                            setUpdateOrderStatus(order.order_status);
                            setIsUpdateModalOpen(true);
                        }} /></Label>
                        <Value>{capitalizeFirstLetter(order.order_status)}</Value> {/* Status not in API, placeholder */}
                    </Field>
                </Grid>
            </Section>

            <Section>
                <SectionTitle>Items</SectionTitle>
                <TableContainer>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Category ID</Th>
                                <Th>Quantity</Th>
                                <Th>Unit Price</Th>
                                <Th>Net Price</Th>
                                <Th>Gross Price</Th>
                                <Th>Discount Value</Th>
                                <Th>Discount Percent</Th>
                                <Th style={{ textAlign: 'center' }}>Add Animal</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {items && items.map((item) => (
                                <Tr key={item.order_item_id}>
                                    <Td>{item.category_name}</Td>
                                    <Td>{item.quantity}</Td>
                                    <Td>{item.unit_price}</Td>
                                    <Td>{item.total_price}</Td>
                                    <Td>{item.gross_price}</Td>
                                    <Td>{item.discount_value}</Td>
                                    <Td>{item.discount_percent}</Td>
                                    <Td style={{ textAlign: 'right' }}>
                                        <ActionButton onClick={() => handleModalOpen(item.order_item_id)}>
                                            <Plus />
                                        </ActionButton>
                                    </Td>
                                </Tr>
                            ))}
                            {(!items || items.length === 0) && (
                                <Tr>
                                    <Td colSpan="8" style={{ textAlign: 'right' }}>No items in this order</Td>
                                </Tr>
                            )}
                        </tbody>
                    </Table>
                </TableContainer>
            </Section>

            <Section>
                <SectionTitle> Animal
                </SectionTitle>
                <TableContainer>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Animal ID</Th>
                                <Th>Animal Tag ID</Th>
                                <Th>Gender</Th>
                                <Th>Source</Th>
                                <Th>Status</Th>

                                <Th style={{ textAlign: 'right' }}>Remove Animal</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {animals && animals.map((animal) => (
                                <Tr key={animal.animal_id}>
                                    <Td>{animal.animal_id}</Td>
                                    <Td>{animal.tag_id}</Td>
                                    <Td>{animal.gender}</Td>
                                    <Td>{animal.source}</Td>
                                    <Td>{animal.status}</Td>
                                    <Td style={{ textAlign: 'right' }}>
                                        <ActionButton onClick={() => handleRemoveAnimal(animal.animal_id, animal.order_item_id)}><Trash /></ActionButton>
                                    </Td>
                                </Tr>
                            ))}
                            {(!animals || animals.length === 0) && (
                                <Tr>
                                    <Td colSpan="8" style={{ textAlign: 'center' }}>No animals in this order</Td>
                                </Tr>
                            )}
                        </tbody>
                    </Table>
                </TableContainer>
            </Section>

            <Section>
                <SectionTitle>Customer Details</SectionTitle>
                {customer ? (
                    <Grid>
                        <Field>
                            <Label>Name</Label>
                            <Value>{capitalizeFirstLetter(customer.first_name)} {capitalizeFirstLetter(customer.last_name)}</Value>
                        </Field>
                        <Field>
                            <Label>Email</Label>
                            <Value>{customer.email}</Value>
                        </Field>
                        <Field>
                            <Label>Phone</Label>
                            <Value
                                style={{ cursor: "pointer" }}
                                onClick={() => { }}>{customer.phone}</Value>
                            {/* // onClick={() => window.open(`tel:${customer.phone}`)}>{customer.phone}</Value> */}
                        </Field>
                    </Grid>
                ) : (
                    <div>No customer information available</div>
                )}
            </Section>


            <Section>
                <SectionTitle>Delivery</SectionTitle>
                {
                    shipping_address?.address_id ? (
                        <>
                            <SectionTitle>Shipping Address {shipping_address?.label ?? "Not Available"} </SectionTitle>
                            <Grid>
                                <Field>
                                    <Label>Line 1</Label>
                                    <Value>{shipping_address?.line1 ?? "Not Available"}</Value>
                                </Field>
                                <Field>
                                    <Label>Line 2</Label>
                                    <Value>{shipping_address?.line2 ?? "Not Available"}</Value>
                                </Field>
                                <Field>
                                    <Label>City</Label>
                                    <Value>{shipping_address?.city}</Value>
                                </Field>
                                <Field>
                                    <Label>State</Label>
                                    <Value>{shipping_address?.state}</Value>
                                </Field>
                                <Field>
                                    <Label>Zip</Label>
                                    <Value>{shipping_address?.postal_code}</Value>
                                </Field>
                                <Field>
                                    <Label>Country</Label>
                                    <Value>{shipping_address?.country}</Value>
                                </Field>
                            </Grid>
                        </>
                    ) : (
                        <SectionTitle>Shipping Address not available</SectionTitle>
                    )
                }

                {
                    billing_address?.address_id ? (
                        <>
                            <SectionTitle>Billing Address {billing_address?.label} </SectionTitle>
                            <Grid>
                                <Field>
                                    <Label>Line 1</Label>
                                    <Value>{billing_address?.line1}</Value>
                                </Field>
                                <Field>
                                    <Label>Line 2</Label>
                                    <Value>{billing_address?.line2}</Value>
                                </Field>
                                <Field>
                                    <Label>City</Label>
                                    <Value>{billing_address?.city}</Value>
                                </Field>
                                <Field>
                                    <Label>State</Label>
                                    <Value>{billing_address?.state}</Value>
                                </Field>
                                <Field>
                                    <Label>Zip</Label>
                                    <Value>{billing_address?.postal_code}</Value>
                                </Field>
                                <Field>
                                    <Label>Country</Label>
                                    <Value>{billing_address?.country}</Value>
                                </Field>
                            </Grid>
                        </>
                    ) : (
                        <SectionTitle>Billing Address not available</SectionTitle>
                    )
                }
            </Section>

            {/* Add Animal Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Map Animal to Order"
            >
                <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Field>
                        <Label>Search Animal by Tag ID</Label>
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                handleSearchChange(e);
                            }}
                            placeholder="Type to search..."
                        />
                    </Field>
                    <Field>
                        <Label>Select Animal</Label>
                        <Select
                            value={modalData.animalId}
                            onChange={(e) => setModalData({ ...modalData, animalId: e.target.value })}
                            required
                        >
                            <option value="">Select an animal</option>
                            {animalLookups.map(animal => (
                                <option key={animal.id} value={animal.id}>
                                    {animal.tag_id} - {animal.category_name}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                        <Button type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!modalData.animalId}>
                            Save
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Update Order Status Modal */}
            <Modal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                title="Update Order Status"
            >
                <form onSubmit={handleUpdateOrderStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Field>
                        <Label>Status</Label>
                        <Select
                            value={updateOrderStatus}
                            onChange={handleUpdateOrderStatusChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </Select>
                    </Field>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                        <Button type="button" onClick={() => setIsUpdateModalOpen(false)} style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Update
                        </Button>
                    </div>
                </form>
            </Modal>
        </Container>
    );
};

export default OrderDetails;
