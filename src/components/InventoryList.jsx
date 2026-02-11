import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';

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

const InventoryList = () => {
  const navigate = useNavigate();
  const [inventories, setInventories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchInventories = useCallback(async () => {
    setLoading(true);
    try {
      if (debouncedSearch) {
        const response = await inventoryService.getInventoryByProductName(debouncedSearch);
        setInventories(response.data || []);
        setTotal(response.count || 0);
      } else {
        const offset = (page - 1) * limit;
        const response = await inventoryService.getInventories(limit, offset);
        setInventories(response.data || []);
        setTotal(response.count || 0);
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
      setInventories([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchInventories();
  }, [fetchInventories]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Container>
      <Header>
        <Title>Inventory List</Title>
        <SearchContainer>
          <Search size={20} color="var(--input-placeholder)" />
          <SearchInput
            placeholder="Search by Product Name..."
            value={search}
            onChange={handleSearchChange}
          />
        </SearchContainer>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Product</Th>
              <Th>Quantity</Th>
              <Th>Price</Th>
              <Th>Location</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <Td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</Td>
              </tr>
            ) : inventories.length === 0 ? (
              <tr>
                <Td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No inventory items found</Td>
              </tr>
            ) : (
              inventories.map((item) => (
                <Tr
                  key={item.inventory_id}
                  onClick={() => navigate(`/inventory/${item.inventory_id}/animals`)}
                >
                  <Td>{item.inventory_id}</Td>
                  <Td>{item.category?.name || '-'}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>{item.unit_price}</Td>
                  <Td>{item.location || '-'}</Td>
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

export default InventoryList;
