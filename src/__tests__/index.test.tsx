import React from 'react';
import { render, screen } from '@testing-library/react';
import Marquee, { IMarqueeProps } from '../index';

describe('Index Export', () => {
  it('exports Marquee component correctly', () => {
    const props: IMarqueeProps = {
      marqueeItems: ['Test Item 1', 'Test Item 2'],
    };

    render(<Marquee {...props} />);

    expect(screen.getAllByText('Test Item 1')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Test Item 2')[0]).toBeInTheDocument();
  });

  it('exports IMarqueeProps interface correctly', () => {
    // This test ensures the interface is properly exported
    const props: IMarqueeProps = {
      marqueeItems: ['Item 1'],
      delay: 50,
      direction: 'up',
      height: 200,
      minHeight: 100,
      paused: false,
      onPause: () => {},
      onResume: () => {},

      inverseMarqueeItems: false,
      marqueeClassName: 'test-marquee',
      marqueeContainerClassName: 'test-container',
      marqueeItemClassName: 'test-item',
    };

    render(<Marquee {...props} />);

    expect(screen.getAllByText('Item 1')[0]).toBeInTheDocument();
  });
});
