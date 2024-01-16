import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './ChipInput.css';

interface UserData {
  name: string;
  email: string;
  avatarUrl: string;
}

const data: UserData[] = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatarUrl: 'https://i.pravatar.cc/50',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatarUrl: 'https://i.pravatar.cc/50',
  },
  {
    name: 'Robin Sed',
    email: 'robin.sed@example.com',
    avatarUrl: 'https://i.pravatar.cc/50',
  },
  {
    name: 'Henry Pathak',
    email: 'henry.pathak@example.com',
    avatarUrl: 'https://i.pravatar.cc/50',
  },
  {
    name: 'Shailja Smith',
    email: 'shailja.smith@example.com',
    avatarUrl: 'https://i.pravatar.cc/50',
  },
  {
    name: 'Joy Deb',
    email: 'joy.deb@example.com',
    avatarUrl: 'https://i.pravatar.cc/50',
  },
  {
    name: 'Vikas Agh',
    email: 'vikas.agh@example.com',
    avatarUrl: 'https://i.pravatar.cc/50',
  },
  {
    name: 'Stefen Smith',
    email: 'stefen.smith@example.com',
    avatarUrl: 'https://i.pravatar.cc/50',
  },
  {
    name: 'Robin Smith',
    email: 'robin.smith@example.com',
    avatarUrl: 'https://i.pravatar.cc/50',
  },
  {
    name: 'Akrel Josh',
    email: 'akrel.josh@example.com',
    avatarUrl: 'https://i.pravatar.cc/50',
  },
];

const ChipInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState<UserData[]>([]);
  const [highlightedChip, setHighlightedChip] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setHighlightedChip(null);
    setShowSuggestions(true);

    const filteredData = data.filter(
      (item) =>
        !chips.some((chip) => chip.email === item.email) &&
        (item.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
          item.email.toLowerCase().includes(event.target.value.toLowerCase()))
    );

    setShowSuggestions(event.target.value !== '' || filteredData.length > 0);
  };

  const handleInputKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      const selectedUser = data.find((item) => item.name.toLowerCase() === inputValue.toLowerCase());
      if (selectedUser) {
        addChip(selectedUser);
        setInputValue('');
      }
    } else if (event.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      if (highlightedChip === null) {
        setHighlightedChip(chips.length - 1);
      } else {
        removeChip(chips[highlightedChip]);
        setHighlightedChip(null);
      }
    }
  };

  const handleInputClick = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (user: UserData) => {
    addChip(user);
    setInputValue('');
    setShowSuggestions(false);
  };

  const addChip = (user: UserData) => {
    setChips((prevChips) => [...prevChips, user]);
  };

  const removeChip = (user: UserData) => {
    setChips((prevChips) => prevChips.filter((c) => c !== user));
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [chips]);

  return (
    <div className="chip-input-container">
      <h2>Pick Users</h2>
      <div className="input-container">
        <div className="chip-list">
          {chips.map((user, index) => (
            <div
              key={index}
              className={`chip ${highlightedChip === index ? 'highlighted' : ''}`}
              onClick={() => setHighlightedChip(index)}
            >
              {user.name}
              <span className="chip-remove" onClick={() => removeChip(user)}>
                X
              </span>
            </div>
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyPress}
          onClick={handleInputClick}
          placeholder="Type something..."
        />
        {showSuggestions && (
          <div className="suggestions">
            {data
              .filter(
                (user) =>
                  !chips.some((chip) => chip.email === user.email) &&
                  (user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                    user.email.toLowerCase().includes(inputValue.toLowerCase()))
              )
              .map((user, index) => (
                <div key={index} className="suggestion" onClick={() => handleSuggestionClick(user)}>
                  <img src={user.avatarUrl} alt={`${user.name} Avatar`} className="avatar" />
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChipInput;
