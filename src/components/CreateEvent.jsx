import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalService } from '../services/animalService';
import Toast from './Toast';
import { ArrowLeft, Save, Search, Check } from 'lucide-react';
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
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: var(--card-bg);
  padding: 32px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
`;

const SubTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
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
  position: relative;
  width: 100%;
`;

const inputStyles = css`
  width: 100%;
  flex: 1;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid var(--input-border);
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 100px;
  font-family: inherit;
  resize: vertical;
`;

const Select = styled.select`
  ${inputStyles}
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  
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

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
`;

const SearchItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  &:hover {
    background-color: var(--bg-secondary);
  }
`;

const AnimalSummary = styled.div`
  background-color: var(--bg-secondary);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SummaryLabel = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  font-weight: 500;
`;

const SummaryValue = styled.span`
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
`;

const CreateEvent = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    // Animal Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    // Event Form State
    const [eventType, setEventType] = useState('Milk');
    const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [eventNotes, setEventNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Milk Specific State
    const [eventMilkTime, setEventMilkTime] = useState('');
    const [eventMilkQuantity, setEventMilkQuantity] = useState('');
    const [eventMilkSNF, setEventMilkSNF] = useState('');
    const [eventMilkFat, setEventMilkFat] = useState('');
    const [eventMilkWater, setEventMilkWater] = useState('');
    const [eventMilkRate, setEventMilkRate] = useState('');
    const [eventMilkSession, setEventMilkSession] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 1 && !selectedAnimal) {
                setIsSearching(true);
                try {
                    const results = await animalService.getLookup(searchTerm);
                    setSearchResults(results);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedAnimal]);

    const handleSelectAnimal = async (animal) => {
        // Lookup returns minimal info, we might need full details or just enough to show summary
        // Typically lookup returns { id, tag_id, ... }
        // Let's assume lookup returns enough, or we fetch details if needed.
        // For now, using what lookup gives + id
        setSelectedAnimal(animal);
        setSearchTerm(animal.tag_id);
        setSearchResults([]);
    };

    const handleClearSelection = () => {
        setSelectedAnimal(null);
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAnimal) {
            setToast({ type: 'error', message: 'Please select an animal' });
            return;
        }
        if (!eventType) {
            setToast({ type: 'error', message: 'Event type is required' });
            return;
        }
        if (!eventDate) {
            setToast({ type: 'error', message: 'Event date is required' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                animal_id: selectedAnimal.id,
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

            await animalService.createAnimalEvent(payload);

            setToast({ type: 'success', message: 'Event recorded successfully' });

            // Reset form but keep animal selected? Or reset all?
            // Let's reset event fields but keep animal for faster entry if needed?
            // Or maybe redirect? Use requests 'simple to user'
            // Maybe clear form to allow next entry
            setEventNotes('');
            setEventMilkTime('');
            setEventMilkQuantity('');
            setEventMilkSNF('');
            setEventMilkFat('');
            setEventMilkWater('');
            setEventMilkRate('');
            setEventMilkSession('');

        } catch (err) {
            console.error(err);
            setToast({ type: 'error', message: err.message || 'Failed to record event' });
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
                <Title>Record Event</Title>
            </Header>

            <Form onSubmit={handleSubmit}>
                <SubTitle>Find Animal</SubTitle>
                <FieldGroup>
                    <Label>Search by Tag ID</Label>
                    <InputWrapper>
                        <Input
                            placeholder="Enter Tag ID..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setSelectedAnimal(null); // Clear selection on edit
                            }}
                        />
                        <Search size={20} style={{ position: 'absolute', right: 12, color: 'var(--text-secondary)' }} />
                        {searchResults.length > 0 && (
                            <SearchResults>
                                {searchResults.map(animal => (
                                    <SearchItem key={animal.id} onClick={() => handleSelectAnimal(animal)}>
                                        {animal.tag_id} - {animal.category_name || 'No Category'}
                                    </SearchItem>
                                ))}
                            </SearchResults>
                        )}
                    </InputWrapper>
                </FieldGroup>

                {selectedAnimal && (
                    <AnimalSummary>
                        <SummaryItem>
                            <SummaryLabel>Tag ID</SummaryLabel>
                            <SummaryValue
                                style={{ cursor: 'pointer', color: 'var(--primary-color)', textDecoration: 'underline' }}
                                onClick={() => navigate(`/animals/${selectedAnimal.id}`)}
                            >
                                {selectedAnimal.tag_id}
                            </SummaryValue>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryLabel>Category</SummaryLabel>
                            <SummaryValue>{selectedAnimal.category_name || '-'}</SummaryValue>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryLabel>Action</SummaryLabel>
                            <Button type="button" onClick={handleClearSelection} style={{ padding: '4px 8px', fontSize: '12px' }}>Change</Button>
                        </SummaryItem>
                    </AnimalSummary>
                )}

                {selectedAnimal && (
                    <>
                        <SubTitle>Event Details</SubTitle>
                        <FieldGroup>
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

                        <FieldGroup>
                            <Label>Event Date</Label>
                            <Input
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                        </FieldGroup>

                        {eventType === 'Milk' && (
                            <>
                                <FieldGroup>
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
                                </FieldGroup>

                                <FieldGroup>
                                    <Label>Event Milk Time</Label>
                                    <Input
                                        type="time"
                                        value={eventMilkTime}
                                        onChange={(e) => setEventMilkTime(e.target.value)}
                                    />
                                </FieldGroup>

                                <FieldGroup>
                                    <Label>Event Milk Quantity</Label>
                                    <Input
                                        type="number"
                                        value={eventMilkQuantity}
                                        onChange={(e) => setEventMilkQuantity(e.target.value)}
                                    />
                                </FieldGroup>
                                <FieldGroup>
                                    <Label>Event Milk SNF</Label>
                                    <Input
                                        type="number"
                                        value={eventMilkSNF}
                                        onChange={(e) => setEventMilkSNF(e.target.value)}
                                    />
                                </FieldGroup>
                                <FieldGroup>
                                    <Label>Event Milk Fat</Label>
                                    <Input
                                        type="number"
                                        value={eventMilkFat}
                                        onChange={(e) => setEventMilkFat(e.target.value)}
                                    />
                                </FieldGroup>
                                <FieldGroup>
                                    <Label>Event Milk Water</Label>
                                    <Input
                                        type="number"
                                        value={eventMilkWater}
                                        onChange={(e) => setEventMilkWater(e.target.value)}
                                    />
                                </FieldGroup>
                                <FieldGroup>
                                    <Label>Event Milk Rate</Label>
                                    <Input
                                        type="number"
                                        value={eventMilkRate}
                                        onChange={(e) => setEventMilkRate(e.target.value)}
                                    />
                                </FieldGroup>
                            </>
                        )}

                        <FieldGroup>
                            <Label>Notes</Label>
                            <TextArea
                                placeholder="Optional notes..."
                                value={eventNotes}
                                onChange={(e) => setEventNotes(e.target.value)}
                            />
                        </FieldGroup>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <Button $variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Saving...' : <><Save size={18} /> Save Event</>}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </Container>
    );
};

export default CreateEvent;
