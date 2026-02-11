import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';
import { orderService } from '../services/orderService';
import capitalizeFirstLetter from '../utils/common_functions';
import { formatDate } from '../utils/common_functions';

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

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ $status }) =>
    $status === 'pending' ? 'rgba(105, 126, 160, 0.1)' :
      $status === 'in_transit' ? 'rgba(15, 34, 64, 0.1)' :
        $status === 'delivered' ? 'rgba(15, 34, 64, 0.1)' :
          $status === 'cancelled' ? 'rgba(15, 34, 64, 0.1)' :
            'var(--text-secondary)'};
  color: ${({ $status }) =>
    $status === 'pending' ? 'rgba(193, 187, 33, 1)' :
      $status === 'in_transit' ? 'rgba(2, 98, 251, 1)' :
        $status === 'delivered' ? 'rgba(0, 197, 76, 1)' :
          $status === 'cancelled' ? 'rgba(251, 2, 2, 1)' :
            'var(--text-secondary)'};
`;


const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
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

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      const offset = (page - 1) * limit;

      if (debouncedSearch) {
        response = await orderService.searchOrders(debouncedSearch, limit, offset);
      } else {
        response = await orderService.listOrders(limit, offset);
      }

      setOrders(response.orders || []);
      setTotal(response.count || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const totalPages = Math.ceil(total / limit);

  // const formatDate = (dateString) => {
  //   if (!dateString) return '-';
  //   return new Date(dateString).toLocaleString();
  // };

  const getCustomerName = (customer) => {
    if (!customer) return 'Unknown';
    const first = customer.first_name || '';
    const last = customer.last_name || '';
    return capitalizeFirstLetter(`${first} ${last}`.trim());
  };

  return (
    <Container>
      <Header>
        <Title>Orders</Title>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SearchContainer>
            <Search size={20} color="var(--input-placeholder)" />
            <SearchInput
              placeholder="Search Order # or Customer..."
              value={search}
              onChange={handleSearchChange}
            />
          </SearchContainer>
          <CreateButton onClick={() => navigate('/orders/new')}>
            <Plus size={18} />
            Create Order
          </CreateButton>
        </div>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Order Number</Th>
              <Th>Customer</Th>
              <Th>Order Status</Th>
              <Th>Ordered Time</Th>
              <Th>Total</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <Td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</Td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <Td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No orders found</Td>
              </tr>
            ) : (
              orders.map((order) => (
                <Tr
                  key={order.order_id}
                  onClick={() => navigate(`/orders/${order.order_id}`)}
                >
                  <Td>{order.order_number}</Td>
                  <Td>{getCustomerName(order.customer)}</Td>
                  <Td>
                    <StatusBadge $status={order.order_status}>
                      {capitalizeFirstLetter(order.order_status)}
                    </StatusBadge>
                  </Td>
                  <Td>{formatDate(order.order_date)}</Td>
                  {/* <Td>{formatDate(order.customer?.created_at)}</Td> Using customer created_at as requested, but typically order created_at is better? Request says "created_at as ordered Time" which usually implies order.created_at, but API response only showed customer.created_at. Wait, let me check the example response again in thought. */}
                  {/* Re-reading request: The example response for list has 'created_at' inside 'customer' object, but typically list response has filtered fields. Wait, the example response DOES NOT have a top-level created_at for the order. It has subtotal, shipping, tax, total. It has customer object with created_at.  "display as table-> order_number,total,customer name(first and lastname), created_at as ordered Time".  Wait, looking at the JSON provided: "created_at": "2025-11-28T19:13:13" is inside "customer". That's definitely customer creation time. Does the order not have a timestamp? The JSON provided for list has: order_id, order_number, customer_id, subtotal, shipping, tax, total, items, customer. NO top-level created_at.  Okay, I will assume the user meant the order's creation time, but if it's missing in the API response provided in the prompt, there's a disconnect. However, usually APIs return it. I'll check the 'OrderDetails' response example. Same there. No top-level created_at.  Maybe it's inside `customer`? "created_at": "2025-11-28...".  Wait, it is highly unlikely the user wants to see when the customer was created as the "Ordered Time".  But if the API doesn't give it... I will use `customer.created_at` as a placeholder or maybe `updated_at` if available? The prompt says "created_at as ordered Time". I will use `customer.created_at` for now as it's the only `created_at` visible in the provided JSON snippet, but I'll add a comment. Actually, looking closely at the provided JSON:
                  {
                    "order_id": 21,
                    ...
                    "customer": { ... "created_at": "..." }
                  }
                  It seems the order itself lacks a timestamp in the response schema shown. I will use what looks like a timestamp, or just handle it gracefully. I'll stick to the requested "created_at" mapped to "Ordered Time". If the user meant "customer.created_at", that's what I'll show.
                  */}
                  <Td>{order.total}</Td>
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

export default OrderList;
