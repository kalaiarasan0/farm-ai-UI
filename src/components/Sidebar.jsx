import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { LayoutDashboard, Cat, UserRound, SquareStack, ListChecks, Droplet } from 'lucide-react';



const SidebarContainer = styled.div`
  height: 100%;
  background-color: var(--sidebar-bg);
  color: var(--sidebar-text);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Logo = styled(NavLink)`
  padding: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
  border-bottom: 1px solid var(--sidebar-border);
  color: var(--sidebar-text-hover); /* Stronger color for logo */

  &:hover {
    background-color: var(--sidebar-item-hover);
    color: var(--sidebar-text-hover);
  }

  &.active {
    background-color: var(--sidebar-item-active);
    color: var(--sidebar-text-hover);
  }
`;

const Menu = styled.nav`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--sidebar-text);
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background-color: var(--sidebar-item-hover);
    color: var(--sidebar-text-hover);
  }

  &.active {
    background-color: var(--sidebar-item-active);
    color: var(--sidebar-text-hover);
  }
`;

const Sidebar = ({ onCloseMobile }) => {
  return (
    <SidebarContainer>
      <Logo style={{ cursor: 'pointer' }} to="/" onClick={onCloseMobile}>
        <img src={logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Logo>
      <Menu>
        <MenuItem to="/" end onClick={onCloseMobile}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </MenuItem>

        <MenuItem to="/animals" onClick={onCloseMobile}>
          <Cat size={20} />
          <span>Animals</span>
        </MenuItem>

        <MenuItem to="/customers" onClick={onCloseMobile}>
          <UserRound size={20} />
          <span>Customers</span>
        </MenuItem>

        <MenuItem to="/inventory" onClick={onCloseMobile}>
          <ListChecks size={20} />
          <span>Inventory</span>
        </MenuItem>

        <MenuItem to="/category" onClick={onCloseMobile}>
          <SquareStack size={20} />
          <span>Category</span>
        </MenuItem>

        <MenuItem to="/orders" onClick={onCloseMobile}>
          <Cat size={20} />
          <span>Orders</span>
        </MenuItem>

        <MenuItem to="/events/new" onClick={onCloseMobile}>
          <ListChecks size={20} />
          <span>Record Event</span>
        </MenuItem>

        <MenuItem to="/purchase" onClick={onCloseMobile}>
          <Cat size={20} />
          <span>Purchase</span>
        </MenuItem>

        <MenuItem to="/production/milk" onClick={onCloseMobile}>
          <Droplet size={20} />
          <span>Milk Production</span>
        </MenuItem>

      </Menu>
    </SidebarContainer>
  );
};

export default Sidebar;
