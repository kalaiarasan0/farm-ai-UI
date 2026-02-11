import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const HeaderContainer = styled.header`
  height: 100%;
  background-color: var(--header-bg);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid var(--header-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  color: var(--text-primary);

  @media (min-width: 768px) {
    justify-content: flex-end;
    padding: 0 2rem;
  }
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  text-align: right;
  
  h4 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  span {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 50%;
  margin-left: 1rem;
  
  &:hover {
    background-color: var(--bg-secondary);
    color: #e53e3e;
  }
`;

const Header = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getMe();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const picData = await userService.getProfilePicDetails();
        setProfilePic(picData);
      } catch (error) {
        console.error("Failed to fetch profile pic", error);
      }
    };
    fetchProfilePic();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return <HeaderContainer>Loading...</HeaderContainer>;

  // Handle image url if it doesn't have protocol
  // Assuming profilePic object has a property like profile_file_url similar to the previous user object
  // If the API returns the url directly or in a different field, this needs adjustment. 
  // Based on "profile-pic-details", I'll assume it returns an object with the url.
  // Let's assume the structure corresponds to what was previously in user object or standard.
  // However, usually it might be just { profile_file_url: "..." } or similar.
  // I will assume it returns { profile_file_url: "..." } based on previous code usage `user.profile_file_url`.

  const imageUrl = profilePic?.profile_file_url && !profilePic.profile_file_url.startsWith('http')
    ? `${import.meta.env.VITE_API_BASE_URL}${profilePic.profile_file_url}`
    : profilePic?.profile_file_url;

  return (
    <HeaderContainer>
      <HamburgerButton onClick={toggleSidebar}>
        <Menu size={24} />
      </HamburgerButton>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ThemeToggle />
        <UserProfile>
          <UserInfo>
            <h3>{user.firstname} {user.lastname}</h3>
            {/* <span>{user.email}</span> */}
          </UserInfo>
          <Avatar>
            {imageUrl ? (
              <img src={imageUrl} alt={user.username} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg .../>' }} />
            ) : (
              <User size={20} color="var(--text-secondary)" />
            )}
            {/* Fallback if image fails or is missing, reusing the icon logic inside conditional if needed, simplified here */}
            {!imageUrl && <User size={20} color="var(--text-secondary)" />}
          </Avatar>
          <LogoutButton onClick={handleLogout} title="Logout">
            <LogOut size={20} />
          </LogoutButton>
        </UserProfile>
      </div>
    </HeaderContainer>
  );
};

export default Header;
