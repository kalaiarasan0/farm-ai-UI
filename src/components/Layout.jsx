import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 64px 1fr;
  /* Replacing height: 100vh with min-height to allow content to grow */
  min-height: 100vh;
  background-color: var(--bg-color);
`;

const SidebarWrapper = styled.div`
  grid-column: 1 / 3; /* Span 2 columns (1 to 3) */
  grid-row: 1 / -1; /* Full height */
  /* Remove overflow-y auto, let it fit content or be sticky */
  transition: transform 0.3s ease-in-out;
  background-color: var(--sidebar-bg);
  /* Make sidebar sticky so it stays visible while scrolling */
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto; 

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    height: 100%;
    z-index: 1000;
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    box-shadow: ${({ $isOpen }) => ($isOpen ? '2px 0 8px rgba(0,0,0,0.2)' : 'none')};
  }
`;

const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 999;
  }
`;

const HeaderWrapper = styled.div`
  grid-column: 3 / -1; /* Span from line 3 to end (cols 3-12) */
  grid-row: 1;
  z-index: 10;
  /* Optional: make header sticky too */
  /* position: sticky; top: 0; */

  @media (max-width: 768px) {
    grid-column: 1 / -1; /* Full width on mobile */
  }
`;

const MainContent = styled.main`
  grid-column: 3 / -1; /* Span from line 3 to end (cols 3-12) */
  grid-row: 2;

  @media (max-width: 768px) {
    grid-column: 1 / -1; /* Full width on mobile */
  }
  /* Remove overflow-y auto to allow body scroll */
  padding: 0;
  background-color: transparent; 
  color: var(--text-color);
`;

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <LayoutContainer>
      <Overlay $isOpen={isSidebarOpen} onClick={closeSidebar} />
      <SidebarWrapper $isOpen={isSidebarOpen}>
        <Sidebar onCloseMobile={closeSidebar} />
      </SidebarWrapper>
      <HeaderWrapper>
        <Header toggleSidebar={toggleSidebar} />
      </HeaderWrapper>
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
