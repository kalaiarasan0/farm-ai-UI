import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from 'lucide-react';

const ToggleWrapper = styled.label`
  position: relative;
  display: block;
  width: 50px;
  height: 28px;
  cursor: pointer;
  flex-shrink: 0;
`;

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: black; /* Green to Blue gradient */
  background: linear-gradient(75deg, #ffffffff 0%, #000000ff 100%); /* Green to Blue gradient */
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 2;
  }

  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    color: white;
  }

  svg:first-of-type {
    left: 6px;
  }

  svg:nth-of-type(2) {
    right: 6px;
  }

  /* Logic for toggling */
  ${HiddenInput}:checked + & {
    /* Background stays gradient */
  }

  ${HiddenInput}:checked + &:before {
    transform: translateX(22px);
  }
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleWrapper>
      <HiddenInput
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleTheme}
        aria-label="Toggle Theme"
      />
      <Slider>
        <SunIcon size={16} />
        <MoonIcon size={16} />
      </Slider>
    </ToggleWrapper>
  );
};

export default ThemeToggle;
