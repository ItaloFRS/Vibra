import React from 'react';
import { render } from '@testing-library/react-native';
import { OnboardingSlide } from '../Onboarding/OnboardingSlide';
import { PaginationDot } from '../Onboarding/PaginationDot';
import Animated, { useSharedValue } from 'react-native-reanimated';

describe('Onboarding Components', () => {
  const mockSlide = {
    title: 'Test Title',
    description: 'Test Description',
    image: 1, // Mock image require
  };

  it('OnboardingSlide renders title and description', () => {
    // We need a wrapper for Reanimated shared values if used in props
    const scrollOffset = { value: 0 } as any; 
    
    const { getByText } = render(
      <OnboardingSlide 
        slide={mockSlide} 
        index={0} 
        scrollOffset={scrollOffset} 
      />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('PaginationDot renders correctly', () => {
    const scrollOffset = { value: 0 } as any;
    const { root } = render(
      <PaginationDot 
        index={0} 
        scrollOffset={scrollOffset} 
      />
    );
    expect(root).toBeTruthy();
  });
});
