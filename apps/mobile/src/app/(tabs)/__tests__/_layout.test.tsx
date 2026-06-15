import React from 'react';
import { render } from '@testing-library/react-native';
import TabLayout from '../_layout';

// Mock expo-router
jest.mock('expo-router', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockScreen = ({ name, options }: any) => (
    <View testID={`tab-${name}`} accessibilityLabel={options?.title} />
  );
  
  const MockTabs = ({ children }: any) => (
    <View testID="tabs-navigator">{children}</View>
  );
  MockTabs.Screen = MockScreen;
  
  return {
    Tabs: MockTabs,
  };
});

// Mock lucide icons
jest.mock('lucide-react-native', () => ({
  Home: () => 'HomeIcon',
  Search: () => 'SearchIcon',
  Heart: () => 'HeartIcon',
  Ticket: () => 'TicketIcon',
  User: () => 'UserIcon',
  MessageSquare: () => 'MessageSquareIcon',
}));

describe('TabLayout Navigation', () => {
  it('should have index as the first tab and explore as the second tab', () => {
    const { getAllByTestId } = render(<TabLayout />);
    
    const screens = getAllByTestId(/tab-/);
    
    expect(screens[0].props.testID).toBe('tab-index');
    expect(screens[0].props.accessibilityLabel).toBe('Home');
    expect(screens[1].props.testID).toBe('tab-explore');
    expect(screens[1].props.accessibilityLabel).toBe('Explorar');
  });

  it('should have 5 tabs total (Home, Explorar, Tickets, Mensagens, Perfil)', () => {
    const { getAllByTestId } = render(<TabLayout />);
    const screens = getAllByTestId(/tab-/);
    
    expect(screens.length).toBe(5);
  });
});
