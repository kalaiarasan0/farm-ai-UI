import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, Search, Eye, Plus } from 'lucide-react';
import { animalService } from '../services/animalService';
import { useNavigate } from 'react-router-dom';
import capitalizeFirstLetter from '../utils/common_functions';

const Container = styled.div`
  padding: 1.5rem;
  color: var(--text-primary);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;  
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
  }
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  outline: none;
  margin-left: 0.5rem;
  width: 100%;
  color: var(--input-text-color, inherit);
  
  &::placeholder {
    color: var(--input-placeholder);
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  color: var(--text-secondary);
`;

const PageInfo = styled.span`
  font-size: 0.875rem;
`;

const PaginationButton = styled.button`
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white; 
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ $status }) =>
    $status === 'alive' ? 'rgba(74, 222, 128, 0.1)' :
      $status === 'in_inventory' ? 'rgba(59, 130, 246, 0.1)' :
        'rgba(148, 163, 184, 0.1)'};
  color: ${({ $status }) =>
    $status === 'alive' ? '#22c55e' :
      $status === 'in_inventory' ? '#3b82f6' :
        'var(--text-secondary)'};
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    gap: 0.5rem;
  }
`;

const AnimalList = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  // const [toast, setToast] = useState(null);


  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchAnimals = useCallback(async () => {
    setLoading(true);
    try {
      if (debouncedSearch) {
        const data = await animalService.getAnimalByTagId(debouncedSearch);
        // API returns a single object if found, or likely error if not. 
        // We'll wrap it in array if it's an object to safely map.
        if (Array.isArray(data)) {
          setAnimals(data);
          setTotal(data.length);
        } else if (data && data.id) {
          setAnimals([data]);
          setTotal(1);
        } else {
          setAnimals([]);
          setTotal(0);
        }
      } else {
        const offset = (page - 1) * limit;
        const data = await animalService.getAnimals(limit, offset);
        setAnimals(data);

        const countData = await animalService.getAnimalCount();
        setTotal(countData.count);
      }
    } catch (error) {
      // console.error("Error fetching animals:", error);
      // Determine if it was a 404 (not found) for search
      if (debouncedSearch) {
        setAnimals([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Container>
      {/* {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )} */}
      <Header>
        <Title>Animals List</Title>
        <ActionContainer>
          <SearchContainer>
            <Search size={20} color="var(--input-placeholder)" />
            <SearchInput
              placeholder="Search by Tag ID..."
              value={search}
              onChange={handleSearchChange}
            />
          </SearchContainer>
          <CreateButton onClick={() => navigate('/animals/new')}> <Plus size={18} /> Create</CreateButton>
        </ActionContainer>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Tag ID</Th>
              <Th>Gender</Th>
              <Th>Status</Th>
              <Th>Category</Th>
              <Th>Source</Th>
              <Th>Date</Th>
              <Th style={{ textAlign: 'right' }}>Action</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <Td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</Td>
              </tr>
            ) : animals.length === 0 ? (
              <tr>
                <Td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No animals found</Td>
              </tr>
            ) : (
              animals.map((animal) => (
                <Tr key={animal.id} onClick={() => navigate(`/animals/${animal.id}`)}>
                  <Td>{animal.tag_id}</Td>
                  <Td>{animal.gender}</Td>
                  <Td>
                    <StatusBadge $status={animal.status}>{capitalizeFirstLetter(animal.status === 'in_inventory' ? 'Inventory' : animal.status)}</StatusBadge>
                  </Td>
                  <Td>{animal.animal_name}</Td>
                  <Td>{capitalizeFirstLetter(animal.source)}</Td>
                  <Td>{animal.birth_date ?? animal.purchase_date}</Td>
                  <Td style={{ textAlign: 'right' }}>
                    <ActionButton onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/animals/${animal.id}`);
                    }}>
                      <Eye size={18} />
                    </ActionButton>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      <PaginationContainer>
        <PageInfo>
          Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} entries
        </PageInfo>
        <div style={{ display: 'flex' }}>
          <PaginationButton
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft size={18} />
          </PaginationButton>
          <PaginationButton
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={18} />
          </PaginationButton>
        </div>
      </PaginationContainer>
    </Container>
  );
};
export default AnimalList;
