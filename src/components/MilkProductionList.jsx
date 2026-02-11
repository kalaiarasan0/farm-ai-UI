import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalService } from '../services/animalService';
import styled from 'styled-components';
import { Droplet } from 'lucide-react';
import Toast from './Toast';

const Container = styled.div`
  padding: 24px;
  width: 100%;
  color: var(--text-primary);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TableContainer = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
  overflow: hidden;
`;

const Table = styled.table`
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

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  
  &:hover {
    background-color: var(--bg-secondary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  gap: 10px;
  align-items: center;
`;

const MilkProductionList = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchMilkEvents();
    }, [page]);

    const fetchMilkEvents = async () => {
        try {
            setLoading(true);
            const offset = (page - 1) * limit;
            const data = await animalService.getMilkEvents(null, limit, offset);
            setEvents(data.events || []);
            if (data.count) {
                setTotalPages(Math.ceil(data.count / limit));
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch milk production data');
        } finally {
            setLoading(false);
        }
    };

    if (loading && page === 1) return <LoadingWrapper>Loading Milk Production...</LoadingWrapper>;
    if (error) return <ErrorWrapper>Error: {error}</ErrorWrapper>;

    return (
        <Container>
            <Header>
                <Title>
                    <Droplet size={28} />
                    Milk Production
                </Title>
            </Header>

            <TableContainer>
                <div style={{ overflowX: 'auto' }}>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Date</Th>
                                <Th>Animal ID</Th>
                                <Th>Category</Th>
                                <Th>Session</Th>
                                <Th>Time</Th>
                                <Th>Quantity</Th>
                                <Th>SNF</Th>
                                <Th>Fat</Th>
                                <Th>Water</Th>
                                <Th>Rate</Th>
                                <Th>Notes</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.length > 0 ? (
                                events.map(event => (
                                    <Tr key={event.id}>
                                        <Td>{event.event_date}</Td>
                                        <Td
                                            style={{ cursor: 'pointer', color: 'var(--primary-color)', textDecoration: 'underline' }}
                                            onClick={() => navigate(`/animals/${event.animal_id}`)}
                                        >
                                            {event.animal_id}
                                        </Td>
                                        <Td>{event.category_name}</Td>
                                        <Td>{event.event_milk_session}</Td>
                                        <Td>{event.event_milk_time}</Td>
                                        <Td>{event.event_milk_quantity}</Td>
                                        <Td>{event.event_milk_snf}</Td>
                                        <Td>{event.event_milk_fat}</Td>
                                        <Td>{event.event_milk_water}</Td>
                                        <Td>{event.event_milk_rate}</Td>
                                        <Td>{event.notes}</Td>
                                    </Tr>
                                ))
                            ) : (
                                <tr><Td colSpan="11">No milk production records found.</Td></tr>
                            )}
                        </tbody>
                    </Table>
                </div>
                {totalPages > 1 && (
                    <Pagination>
                        <Button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span>Page {page} of {totalPages}</span>
                        <Button
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </Pagination>
                )}
            </TableContainer>
        </Container>
    );
};

export default MilkProductionList;
