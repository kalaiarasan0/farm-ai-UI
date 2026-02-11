import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseService } from '../services/purchaseServices';
import Toast from './Toast';
import { ArrowLeft, X, Plus, Search, ArrowRight, Loader, Edit, Trash2, Eye } from 'lucide-react';
import styled, { css } from 'styled-components';
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
  cursor: pointer;
  
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

const Button = styled.button`
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

const PurchaseList = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
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

  //   Fetch purchases
  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (debouncedSearch) {
        data = await purchaseService.searchPurchase(debouncedSearch);
        if (Array.isArray(data)) {
          setPurchases(data);
          setTotal(data.length);
        } else {
          setPurchases(data.data || []);
          setTotal(data.count || 0);
        }
      } else {
        const offset = (page - 1) * limit;
        data = await purchaseService.listPurchase(limit, offset);
        setPurchases(data);

        const countData = await purchaseService.getPurchaseCount();
        setTotal(countData.count);
      }
    } catch (error) {
      // console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRowClick = (id) => {
    navigate(`/purchase/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await purchaseService.deletePurchase(id);
      fetchPurchases();
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Container>
      <Header>
        <Title>Purchases</Title>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SearchContainer>
            <Search size={20} color="var(--input-placeholder)" />
            <SearchInput
              placeholder="Search by name..."
              value={search}
              onChange={handleSearchChange}
            />
          </SearchContainer>
          <CreateButton onClick={() => navigate('/purchase/new')}>
            <Plus size={18} />
            Create</CreateButton>
        </div>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Material Name</Th>
              <Th>Type of Material</Th>
              <Th>Purchase Date</Th>
              <Th>Quantity</Th>
              <Th>Total Price</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  <Loader />
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No purchases found
                </td>
              </tr>
            ) : (
              purchases.map((purchase) => (
                <Tr key={purchase.id} onClick={() => handleRowClick(purchase.id)}>
                  <Td>{purchase.material_name}</Td>
                  <Td>{purchase.type_of_material}</Td>
                  <Td>{purchase.purchase_date}</Td>
                  <Td>{purchase.quantity}</Td>
                  <Td>{purchase.total_price}</Td>
                  <Td>
                    <ActionButton onClick={(e) => { e.stopPropagation(); handleRowClick(purchase.id); }}>
                      <Eye size={18} />
                    </ActionButton>


                    <ActionButton onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(purchase.id);
                    }}>
                      <Trash2 size={16} />
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
          Showing {((page - 1) * limit) + 1} to{' '}
          {Math.min(page * limit, total)} of {total} purchases
        </PageInfo>
        <div>
          <PaginationButton
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ArrowLeft size={16} />
          </PaginationButton>
          <PaginationButton
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            <ArrowRight size={16} />
          </PaginationButton>
        </div>
      </PaginationContainer>

    </Container>
  );
};

export default PurchaseList;
