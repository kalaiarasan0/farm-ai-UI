import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';

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

const TableContainer = styled.div`
  width: 100%;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  overflow-x: auto;
  border: 1px solid var(--border-color);
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

const Tr = styled.tr`
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--table-border);
  background-color: var(--table-row-bg);
  
  &:hover {
    background-color: var(--table-row-hover);
    cursor: pointer;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 1rem;
  color: var(--text-primary);
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => props.$status === 'in_inventory' ? 'var(--success-bg)' : 'var(--warning-bg)'};
  color: ${props => props.$status === 'in_inventory' ? 'var(--success-text)' : 'var(--warning-text)'};
`;

const InventoryAnimals = () => {
    const { inventoryId } = useParams();
    const navigate = useNavigate();
    const [animals, setAnimals] = useState([]); // Initialize as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnimals = useCallback(async () => {
        if (!inventoryId) return;

        setLoading(true);
        setError(null);
        try {
            const response = await inventoryService.getInventoryAnimals(inventoryId);
            // The API returns an object with a data property which is the array
            // response: { data: [...], count: ... }
            setAnimals(response.data || []);
        } catch (err) {
            console.error("Error fetching inventory animals:", err);
            setError("Failed to load animals.");
            setAnimals([]);
        } finally {
            setLoading(false);
        }
    }, [inventoryId]);

    useEffect(() => {
        fetchAnimals();
    }, [fetchAnimals]);

    if (loading) {
        return (
            <Container>
                <Header>
                    <BackButton onClick={() => navigate('/inventory')}>
                        <ArrowLeft size={24} style={{ marginRight: '0.5rem' }} />
                    </BackButton>
                    <Title>Inventory Animals</Title>
                </Header>
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <BackButton onClick={() => navigate('/inventory')}>
                    <ArrowLeft size={24} style={{ marginRight: '0.5rem' }} />
                </BackButton>
                <Title>Inventory Animals (ID: {inventoryId})</Title>
            </Header>

            {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{error}</div>}

            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <Th>Date</Th>
                            <Th>Type</Th>
                            <Th>Tag ID</Th>
                            <Th>Animal ID</Th>
                            <Th>Move To Inv?</Th>
                            <Th>Status</Th>
                            <Th>Notes</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {animals.length === 0 ? (
                            <Tr>
                                <Td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No animals found for this inventory item.
                                </Td>
                            </Tr>
                        ) : (
                            animals.map((item, index) => (
                                <Tr
                                    key={`${item.animal_id}-${index}`}
                                    onClick={() => navigate(`/animals/${item.animal_id}`)}
                                >
                                    <Td>{item.movement_date}</Td>
                                    <Td>{item.movement_type}</Td>
                                    <Td>{item.tag_id}</Td>
                                    <Td>{item.animal_id}</Td>
                                    <Td>{item.is_move_to_inventory ? 'Yes' : 'No'}</Td>
                                    <Td>
                                        <StatusBadge $status={item.status}>
                                            {item.status.replace('_', ' ')}
                                        </StatusBadge>
                                    </Td>
                                    <Td>{item.notes || '-'}</Td>
                                </Tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default InventoryAnimals;
