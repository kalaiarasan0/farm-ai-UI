import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Search, ChevronLeft, ChevronRight, Eye, Plus } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { useNavigate } from 'react-router-dom'


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
  color: var(--input-text-color, inherit); /* inherit allows parent logic if needed, but var preferable if defined */
  
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
  border: 1px solid var(--border-color); /* Added border to match card style */
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
  background-color: var(--card-bg); /* Use card bg for better theme integration, or keeping button-bg if it's dynamic */
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

const CategoryList = () => {
  // useTheme removed
  const navigate = useNavigate();
  const [categorys, setCategorys] = useState([]);
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

  // Fetch categorys
  const fetchCategorys = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (debouncedSearch) {
        data = await categoryService.searchCategorys(debouncedSearch);
        if (Array.isArray(data)) {
          setCategorys(data);
          setTotal(data.length);
        } else {
          setCategorys(data.data || []);
          setTotal(data.count || 0);
        }
      } else {
        const offset = (page - 1) * limit;
        data = await categoryService.getCategorys(limit, offset);
        setCategorys(data);

        const countData = await categoryService.getCategoryCount();
        setTotal(countData.count);
      }
    } catch (error) {
      // console.error("Error fetching categorys:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchCategorys();
  }, [fetchCategorys]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRowClick = (id) => {
    navigate(`/category/${id}`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Container>
      <Header>
        <Title>Category</Title>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SearchContainer>
            <Search size={20} color="var(--input-placeholder)" />
            <SearchInput
              placeholder="Search by name..."
              value={search}
              onChange={handleSearchChange}
            />
          </SearchContainer>
          <CreateButton onClick={() => navigate('/category/new')}>
            <Plus size={18} />
             Create</CreateButton>
        </div>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>SKU</Th>
              <Th>Species</Th>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th style={{ textAlign: 'right' }}>Action</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <Td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</Td>
              </tr>
            ) : categorys.length === 0 ? (
              <tr>
                <Td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No categorys found</Td>
              </tr>
            ) : (
              categorys.map((category) => (
                <Tr key={category.category_id} onClick={() => handleRowClick(category.category_id)}>
                  <Td>{category.sku}</Td>
                  <Td>{category.species}</Td>
                  <Td>{category.name}</Td>
                  <Td>₹{category.base_price}</Td>
                  <Td style={{ textAlign: 'right' }}>
                    <ActionButton onClick={(e) => { e.stopPropagation(); handleRowClick(category.category_id); }}>
                      <Eye size={18} />
                    </ActionButton>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      {!debouncedSearch && (
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
      )}
    </Container>
  );
};
export default CategoryList;
