import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from './Navbar';
import React from 'react';

// Mock useScroll hook
vi.mock('@/hooks/use-scroll', () => ({
  useScroll: vi.fn(() => false),
}));

// Mock AuthContext
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: false,
    isAuthModalOpen: false,
    openAuthModal: vi.fn(),
    closeAuthModal: vi.fn(),
    login: vi.fn(),
  }),
}));

// Mock AuthModal to avoid deep testing
vi.mock('../sections/event-purchase/AuthModal', () => ({
  AuthModal: () => <div data-testid="auth-modal" />,
}));

describe('Navbar Component', () => {
  it('renders logo and links', () => {
    render(<Navbar />);
    expect(screen.getByAltText('Vibra Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
