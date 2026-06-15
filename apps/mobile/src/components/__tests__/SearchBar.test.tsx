import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('should render correctly with placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar placeholder="Search events..." value="" onChangeText={() => {}} />
    );
    expect(getByPlaceholderText('Search events...')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar placeholder="Search" value="" onChangeText={onChangeText} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Search'), 'Vibra');
    expect(onChangeText).toHaveBeenCalledWith('Vibra');
  });
});
