import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, LinkButton } from './Button';

describe('Button', () => {
  it('renders its children and fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Join the waitlist</Button>);

    const button = screen.getByRole('button', { name: 'Join the waitlist' });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies variant styling', () => {
    render(<Button variant="subtle">Subtle</Button>);
    expect(screen.getByRole('button', { name: 'Subtle' }).className).toContain('border');
  });
});

describe('LinkButton', () => {
  it('renders an external link with safe rel attributes', () => {
    render(
      <LinkButton href="https://example.com" external>
        External
      </LinkButton>,
    );

    const link = screen.getByRole('link', { name: 'External' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
