import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { dashboardService } from '../services/dashboardService';
import { Link } from 'react-router-dom';


const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 3rem;
`;

const Container = styled.div`
  padding: 2rem;
  width: 100%;
`;

const Card = styled(Link)`
  background: var(--card-bg);
  border-radius: 0.5rem;
  padding: 1.5rem;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border); /* For dark mode visibility */
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--card-shadow-hover);
  }

`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-primary);
`;

const SubText = styled.div`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  
  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.25rem;
    
    &:last-child {
        border-bottom: none;
    }
  }
`;

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // useTheme removed

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data);
            } catch (err) {
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
    if (!stats) return null;

    return (
        <Container>
            <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard Overview</h1>
            <DashboardGrid>
                {/* Total Animal Types */}
                <Card to="category">
                    <CardTitle>Total Animal Types</CardTitle>
                    <CardValue>{stats.total_animal_types}</CardValue>
                </Card>

                {/* Tracking Animal Status */}
                <Card to="/animals">
                    <CardTitle>Animal Status</CardTitle>
                    <SubText>
                        {Object.entries(stats.tracking_animal_status_counts || {}).map(([status, count]) => (
                            <div key={status}>
                                <span style={{ textTransform: 'capitalize' }}>{status.replace('_', ' ')}</span>
                                <span>{count}</span>
                            </div>
                        ))}
                    </SubText>
                </Card>

                {/* Order Status */}
                {stats.order_status_counts && stats.order_status_counts.map((orderStat) => (
                    <Card to='/orders' key={orderStat.status}>
                        <CardTitle>Orders: {orderStat.status}</CardTitle>
                        <CardValue>{orderStat.count}</CardValue>
                        <SubText>
                            <div>
                                <span>Total Amount</span>
                                <span>₹{orderStat.total_amount.toLocaleString()}</span>
                            </div>
                            <div>
                                <span>Total Qty</span>
                                <span>{orderStat.total_quantity}</span>
                            </div>
                        </SubText>
                    </Card>
                ))}
            </DashboardGrid>
        </Container>
    );
};

export default Dashboard;
