import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Search, ChevronLeft, ChevronRight, Eye, Plus, Trash2 } from 'lucide-react';
import { customerService } from '../services/customerService';
import { useNavigate } from 'react-router-dom';

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

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;

      let params = {};

      // Determine count_type and search params based on input
      // This is a simple heuristic: if it looks like a number, try phone, else name
      if (debouncedSearch) {
        const isNum = /^\d+$/.test(debouncedSearch);
        if (isNum) {
          params.count_type = 'phone';
          params.phone = debouncedSearch;
        } else {
          params.count_type = 'name';
          params.name = debouncedSearch;
        }
      } else {
        params.count_type = 'all';
      }

      // Fetch List
      const data = await customerService.getCustomers(limit, offset, params);

      // For list endpoint, depending on how backend behaves with search params:
      // The curl example shows: get list for count ... then list api with same params
      // If data is array (list), use it.
      // We assume the API returns [ ...customers ]
      setCustomers(data || []);

      // Fetch Count
      // We need to pass the same filters to get the total count for pagination
      const countData = await customerService.getCustomerCount(params);
      setTotal(countData.count);

    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleRowClick = (id) => {
    navigate(`/customers/${id}`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await customerService.deleteCustomer(id);
        fetchCustomers(); // Refresh list
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer");
      }
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Container>
      <Header>
        <Title>Customers</Title>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SearchContainer>
            <Search size={20} color="var(--input-placeholder)" />
            <SearchInput
              placeholder="Search by name or phone..."
              value={search}
              onChange={handleSearchChange}
            />
          </SearchContainer>
          <CreateButton onClick={() => navigate('/customers/new')}> <Plus size={20} /> Create</CreateButton>
        </div>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Created At</Th>
              <Th style={{ textAlign: 'right' }}>Action</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <Td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</Td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <Td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No customers found</Td>
              </tr>
            ) : (
              customers.map((customer) => (
                <Tr key={customer.customer_id} onClick={() => handleRowClick(customer.customer_id)}>
                  <Td>{customer.customer_id}</Td>
                  <Td>{customer.first_name}</Td>
                  <Td>{customer.last_name || '-'}</Td>
                  <Td>{customer.email}</Td>
                  <Td>{customer.phone}</Td>
                  <Td>{new Date(customer.created_at).toLocaleDateString()}</Td>
                  <Td style={{ textAlign: 'right' }}>
                    <ActionButton onClick={(e) => { e.stopPropagation(); handleRowClick(customer.customer_id); }}>
                      <Eye size={18} />
                    </ActionButton>
                    <ActionButton onClick={(e) => handleDelete(e, customer.customer_id)}>
                      <Trash2 size={18} color="var(--error-color, #ef4444)" />
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
          Showing {total === 0 ? 0 : ((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} entries
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
export default CustomerList;
