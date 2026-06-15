import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EventCard from '../EventCard';

const mockEvent = {
  id: '1',
  title: 'Test Event',
  thumbnailUrl: 'https://test.com/image.jpg',
  eventDate: '2026-11-14T20:00:00Z',
  location: 'Test Location, SP',
  price: 80,
  isMatching: true,
  startTime: '20:00'
};

describe('EventCard', () => {
  it('should render grid variant by default', () => {
    const { getByText } = render(
      <EventCard event={mockEvent} onPress={() => {}} />
    );
    
    expect(getByText('Test Event')).toBeTruthy();
    // Grid variant shows day and month in a single text block
    expect(getByText(/14 NOV/)).toBeTruthy();
  });

  it('should render list variant when specified', () => {
    const { getByText } = render(
      <EventCard event={mockEvent} variant="list" onPress={() => {}} />
    );
    
    expect(getByText('Test Event')).toBeTruthy();
    expect(getByText('14')).toBeTruthy();
    expect(getByText('NOV')).toBeTruthy();
    expect(getByText('A partir de R$ 80.00')).toBeTruthy();
    expect(getByText('Matching Now')).toBeTruthy();
  });

  it('should call onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <EventCard event={mockEvent} onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Event'));
    expect(onPress).toHaveBeenCalledWith('1');
  });

  it('should call onFavorite when favorite button is pressed', () => {
    const onFavorite = jest.fn();
    const { getByTestId } = render(
      <EventCard event={mockEvent} onPress={() => {}} onFavorite={onFavorite} />
    );
    
    fireEvent.press(getByTestId('favorite-button'));
    expect(onFavorite).toHaveBeenCalledWith('1');
  });
});
