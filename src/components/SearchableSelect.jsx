import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronDown, Search } from 'lucide-react';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SelectBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid ${({ $isOpen }) => $isOpen ? 'var(--primary-color)' : 'var(--input-border)'};
  background-color: var(--input-bg);
  cursor: pointer;
  color: var(--text-primary);
  font-size: 15px;

  &:hover {
    border-color: var(--input-border-focus);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 250px;
  overflow-y: auto;
  padding: 4px;
`;

const SearchInputWrapper = styled.div`
  padding: 8px;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background-color: var(--card-bg);
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-primary);
  outline: none;

  &:focus {
    border-color: var(--primary-color);
  }
`;

const Option = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 14px;

  &:hover {
    background-color: var(--bg-secondary);
  }

  ${({ $isSelected }) => $isSelected && `
    background-color: var(--primary-color-alpha, rgba(37, 99, 235, 0.1));
    color: var(--primary-color);
    font-weight: 500;
  `}
`;

const NoOptions = styled.div`
  padding: 12px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
`;

const SearchableSelect = ({ options = [], value, onChange, placeholder = "Select...", disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Filter options
    const filteredOptions = options.filter(option =>
        String(option).toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
        if (!isOpen) {
            setSearchTerm(''); // Reset search when closed
        }
    }, [isOpen]);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    if (disabled) {
        return (
            <SelectBox style={{ opacity: 0.7, cursor: 'not-allowed', backgroundColor: 'var(--bg-secondary)' }}>
                {value || placeholder}
            </SelectBox>
        )
    }

    return (
        <Container ref={containerRef}>
            <SelectBox
                $isOpen={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value || placeholder}</span>
                <ChevronDown size={16} color="var(--text-secondary)" />
            </SelectBox>

            {isOpen && (
                <Dropdown>
                    <SearchInputWrapper>
                        <Search size={14} style={{ marginRight: '8px', color: 'var(--text-secondary)' }} />
                        <SearchInput
                            ref={searchInputRef}
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </SearchInputWrapper>

                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <Option
                                key={index}
                                $isSelected={option === value}
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </Option>
                        ))
                    ) : (
                        <NoOptions>No results found</NoOptions>
                    )}
                </Dropdown>
            )}
        </Container>
    );
};

export default SearchableSelect;
