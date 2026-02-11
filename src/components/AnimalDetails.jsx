import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animalService } from '../services/animalService';
import Toast from './Toast';
import { ArrowLeft, X, Plus } from 'lucide-react';
import styled, { css } from 'styled-components';
import capitalizeFirstLetter from '../utils/common_functions';

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
  justify-content: space-between;
  width: 100%;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MoveButton = styled.button`
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--card-bg);
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$variant === 'primary' ? `
    background-color: var(--primary-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--button-hover, #0056b3);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  ` : `
    background-color: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    
    &:hover {
      background-color: var(--bg-secondary);
    }
  `}
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  min-height: 100px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
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
  width: 100%;
  // margin: 0 auto;
  background: var(--card-bg);
  padding: 32px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
`;

const inputStyles = css`
  width: 100%;
  flex: 1;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background-color: var(--card-bg); 
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin-top: 8px;
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

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--table-border);
  color: var(--text-primary);
  font-size: 0.875rem;
`;

const Tr = styled.tr`
   background-color: var(--table-row-bg);
   &:hover {
    background-color: var(--table-row-hover);
  }
`;

const AnimalDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [animalEvents, setAnimalEvents] = useState([]);
  const [animalEventsLoading, setAnimalEventsLoading] = useState(true);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [movementType, setMovementType] = useState('For Sale');
  const [eventType, setEventType] = useState('Milk');
  const [movementNotes, setMovementNotes] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [moveLoading, setMoveLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventMilkTime, setEventMilkTime] = useState();
  const [eventMilkQuantity, setEventMilkQuantity] = useState('');
  const [eventMilkSNF, setEventMilkSNF] = useState('');
  const [eventMilkFat, setEventMilkFat] = useState('');
  const [eventMilkWater, setEventMilkWater] = useState('');
  const [eventMilkRate, setEventMilkRate] = useState('');
  const [eventMilkSession, setEventMilkSession] = useState('');

  useEffect(() => {
    fetchAnimal();
  }, [id]);

  useEffect(() => {
    fetchAnimalEvents();
  }, [id, page]);

  const fetchAnimal = async () => {
    try {
      setLoading(true);
      const data = await animalService.getAnimalById(id);
      setAnimal(data);
    } catch (err) {
      // console.error("Failed to fetch animal", err);
      setError(err.message || "Failed to load animal details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimalEvents = async () => {
    try {
      setAnimalEventsLoading(true);
      const offset = (page - 1) * limit;
      let data;
      data = await animalService.getAnimalEventsByAnimalId(id, limit, offset);
      setAnimalEvents(data);
      if (data.count) {
        setTotalPages(Math.ceil(data.count / limit));
      }
    } catch (err) {
      // console.error("Failed to fetch animal events", err);
      setError(err.message || "Failed to load animal events");
    } finally {
      setAnimalEventsLoading(false);
    }
  };

  const renderField = (label, value) => {
    return (
      <DetailItem>
        <DetailLabel>{label}</DetailLabel>
        <DetailValue>{value || '-'}</DetailValue>
      </DetailItem>
    );
  };
  if (loading) return <LoadingWrapper>Loading Animal details...</LoadingWrapper>;
  if (animalEventsLoading) return <LoadingWrapper>Loading Animal events...</LoadingWrapper>;
  if (error) return <ErrorWrapper>Error: {error}</ErrorWrapper>;
  if (!animal) return <ErrorWrapper>Animal not found</ErrorWrapper>;

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
        <HeaderLeft>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </BackButton>
          <Title>Animal Details</Title>
        </HeaderLeft>
      </Header>

      <Form>

        <SectionTitle>
          Basic Information
          <MoveButton onClick={() => setIsMoveModalOpen(true)}><Plus size={18} /> Move</MoveButton>

        </SectionTitle>
        <DetailGrid>
          {renderField("Animal ID", animal.id)}
          {renderField("Tag ID", animal.tag_id)}
          {renderField("Category ID", animal.category_id)}
          {renderField("Category Name", animal.category_name)}
          {renderField("Gender", animal.gender)}
          {renderField("Birth Date", animal.birth_date)}
          {renderField("Status", capitalizeFirstLetter(animal.status === 'in_inventory' ? 'Inventory' : animal.status))}
          {renderField("Source", capitalizeFirstLetter(animal.source))}
          {renderField("Source Reference", animal.source_reference)}
          {renderField("Purchase Price", animal.purchase_price)}
          {renderField("Purchase Date", animal.purchase_date)}
          {/* {renderField("Order Number", animal.order_number)} */}
          {renderField("Order Status", animal.order_status)}
          {renderField("Order Item ID", animal.order_item_id)}
          {renderField("Created At", animal.created_at)}
          {renderField("Updated At", animal.updated_at)}
        </DetailGrid>
      </Form>

      <Form>
        <SectionTitle>
          Events
          <MoveButton onClick={() => setIsEventModalOpen(true)}><Plus size={18} /> Add Event</MoveButton>
        </SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <Th>Type</Th>
                <Th>Date</Th>
                <Th>Milk Time</Th>
                <Th>Milk Quantity</Th>
                <Th>Milk SNF</Th>
                <Th>Milk Fat</Th>
                <Th>Milk Water</Th>
                <Th>Milk Rate</Th>
                <Th>Milk Session</Th>
                <Th>Notes</Th>
                {/* <Th>Recorded At</Th> */}
              </tr>
            </thead>
            <tbody>
              {animalEvents.events && animalEvents.events.length > 0 ? (
                animalEvents.events.map(event => (
                  <Tr key={event.id}>
                    <Td>{event.event_type}</Td>
                    <Td>{event.event_date}</Td>
                    <Td>{event.event_milk_time}</Td>
                    <Td>{event.event_milk_quantity}</Td>
                    <Td>{event.event_milk_snf}</Td>
                    <Td>{event.event_milk_fat}</Td>
                    <Td>{event.event_milk_water}</Td>
                    <Td>{event.event_milk_rate}</Td>
                    <Td>{event.event_milk_session}</Td>
                    <Td>{event.notes}</Td>
                    {/* <Td>{event.created_at}</Td> */}
                  </Tr>
                ))
              ) : (
                <tr><Td colSpan="11">No events recorded.</Td></tr>
              )}
            </tbody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px', alignItems: 'center' }}>
            <Button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span style={{ color: 'var(--text-primary)' }}>Page {page} of {totalPages}</span>
            <Button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Form>

      <Form>
        <SectionTitle>Inventory Movements</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Type</Th>
                <Th>Date</Th>
                <Th>Notes</Th>
              </tr>
            </thead>
            <tbody>
              {animal.inventory_items && animal.inventory_items.length > 0 ? (
                animal.inventory_items.map(item => (
                  <Tr key={item.id}>
                    <Td>{item.id}</Td>
                    <Td>{item.movement_type}</Td>
                    <Td>{item.movement_date}</Td>
                    <Td>{item.notes}</Td>
                  </Tr>
                ))
              ) : (
                <tr><Td colSpan="4">No inventory movements.</Td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </Form>

      {isMoveModalOpen && (
        <ModalOverlay onClick={(e) => {
          if (e.target === e.currentTarget) setIsMoveModalOpen(false);
        }}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Move to Inventory</ModalTitle>
              <CloseButton onClick={() => setIsMoveModalOpen(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                <Label>Movement Type</Label>
                <Select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value)}
                >
                  <option value="For Sale">For Sale</option>
                  <option value="deceased">Deceased</option>
                  <option value="consumed">Consumed</option>
                  <option value="lost">Lost</option>
                  <option value="other">Other</option>
                </Select>
              </FieldGroup>
              <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                <Label>Notes</Label>
                <TextArea
                  placeholder="Optional notes..."
                  value={movementNotes}
                  onChange={(e) => setMovementNotes(e.target.value)}
                />
              </FieldGroup>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsMoveModalOpen(false)}>Cancel</Button>
              <Button
                $variant="primary"
                disabled={moveLoading}
                onClick={async () => {
                  if (!movementType) {
                    setToast({ type: 'error', message: 'Movement type is required' });
                    return;
                  }
                  setMoveLoading(true);
                  try {
                    await animalService.createInventoryMovement({
                      animal_id: parseInt(id),
                      movement_type: movementType,
                      notes: movementNotes
                    });
                    setToast({ type: 'success', message: 'Animal moved successfully' });
                    setIsMoveModalOpen(false);
                    fetchAnimal(); // Refresh data
                  } catch (err) {
                    // console.error(err);
                    setToast({ type: 'error', message: err.message || 'Failed to move animal' });
                  } finally {
                    setMoveLoading(false);
                  }
                }}
              >
                {moveLoading ? 'Moving...' : 'Move'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
      {isEventModalOpen && (
        <ModalOverlay onClick={(e) => {
          if (e.target === e.currentTarget) setIsEventModalOpen(false);
        }}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add Event</ModalTitle>
              <CloseButton onClick={() => setIsEventModalOpen(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                <Label>Event Type</Label>
                <Select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value="Medical">Medical</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Breeding">Breeding</option>
                  <option value="Birth">Birth</option>
                  <option value="Milk">Milk</option>
                  <option value="Deworming">Deworming</option>
                  <option value="Others">Others</option>
                </Select>
              </FieldGroup>
              <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                <Label>Event Date</Label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </FieldGroup>
              {eventType === 'Milk' && (
                <>
                  <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                    <Label>Event Milk Session</Label>
                    <Select
                      value={eventMilkSession}
                      onChange={(e) => {
                        const session = e.target.value;
                        setEventMilkSession(session);
                        if (session === 'AM') setEventMilkTime('06:00');
                        else if (session === 'PM') setEventMilkTime('18:00');
                      }}
                    >
                      <option value="">Select Session</option>
                      <option value="AM">AM Morning</option>
                      <option value="PM">PM Evening</option>
                    </Select>
                    <Label>Event Milk Time</Label>
                    <Input
                      type="time"
                      value={eventMilkTime}
                      onChange={(e) => setEventMilkTime(e.target.value)}
                    />

                  </FieldGroup>
                  <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                    <Label>Event Milk Quantity</Label>
                    <Input
                      type="number"
                      value={eventMilkQuantity}
                      onChange={(e) => setEventMilkQuantity(e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                    <Label>Event Milk SNF</Label>
                    <Input
                      type="number"
                      value={eventMilkSNF}
                      onChange={(e) => setEventMilkSNF(e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                    <Label>Event Milk Fat</Label>
                    <Input
                      type="number"
                      value={eventMilkFat}
                      onChange={(e) => setEventMilkFat(e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                    <Label>Event Milk Water</Label>
                    <Input
                      type="number"
                      value={eventMilkWater}
                      onChange={(e) => setEventMilkWater(e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                    <Label>Event Milk Rate</Label>
                    <Input
                      type="number"
                      value={eventMilkRate}
                      onChange={(e) => setEventMilkRate(e.target.value)}
                    />
                  </FieldGroup>
                </>
              )}

              <FieldGroup style={{ gridTemplateColumns: '120px 1fr' }}>
                <Label>Notes</Label>
                <TextArea
                  placeholder="Optional notes..."
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                />
              </FieldGroup>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsMoveModalOpen(false)}>Cancel</Button>
              <Button
                $variant="primary"
                disabled={moveLoading}
                onClick={async () => {
                  if (!eventType) {
                    setToast({ type: 'error', message: 'Event type is required' });
                    return;
                  }
                  if (!eventDate) {
                    setToast({ type: 'error', message: 'Event date is required' });
                    return;
                  }

                  setEventLoading(true);
                  try {
                    // let finalNotes = eventNotes;
                    // if (eventType === 'Milk') {
                    //   const parts = [];
                    //   if (eventMilkTime) parts.push(`Time: ${eventMilkTime}`);
                    //   if (eventMilkQuantity) parts.push(`Qty: ${eventMilkQuantity}`);
                    //   if (eventMilkSNF) parts.push(`SNF: ${eventMilkSNF}`);
                    //   if (eventMilkFat) parts.push(`Fat: ${eventMilkFat}`);
                    //   if (eventMilkWater) parts.push(`Water: ${eventMilkWater}`);
                    //   if (eventMilkRate) parts.push(`Rate: ${eventMilkRate}`);
                    //   if (eventMilkSession) parts.push(`Session: ${eventMilkSession}`);

                    //   if (parts.length > 0) {
                    //     finalNotes = `${parts.join(', ')}. ${eventNotes}`;
                    //   }
                    // }

                    const payload = {
                      animal_id: parseInt(id),
                      event_type: eventType,
                      event_date: eventDate,
                      notes: eventNotes,
                      event_milk_time: eventMilkTime,
                      event_milk_quantity: eventMilkQuantity,
                      event_milk_snf: eventMilkSNF,
                      event_milk_fat: eventMilkFat,
                      event_milk_water: eventMilkWater,
                      event_milk_rate: eventMilkRate,
                      event_milk_session: eventMilkSession
                    };

                    const newEvent = await animalService.createAnimalEvent(payload);

                    setToast({ type: 'success', message: 'Event added successfully' });
                    setIsEventModalOpen(false);

                    // Update local state without reloading
                    setAnimal(prev => ({
                      ...prev,
                      events: [newEvent, ...(prev.events || [])]
                    }));

                    if (eventType === 'Birth') {
                      navigate('/animals/new');
                      return;
                    }

                    // Reset form fields
                    setEventNotes('');
                    setEventDate('');
                    setEventMilkTime('');
                    setEventMilkQuantity('');
                    setEventMilkSNF('');
                    setEventMilkFat('');
                    setEventMilkWater('');
                    setEventMilkRate('');

                  } catch (err) {
                    console.error(err);
                    setToast({ type: 'error', message: err.message || 'Failed to add event' });
                  } finally {
                    setEventLoading(false);
                  }
                }}
              >
                {eventLoading ? 'Saving...' : 'Save'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )
      }
    </Container >
  );
};
export default AnimalDetails;
