import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Marquee, { MarqueeDirection, FadeMaskColor } from '../Marquee';

const defaultProps = {
  marqueeItems: ['Item 1', 'Item 2', 'Item 3'],
  height: 100,
};

describe('Marquee Component', () => {
  it('renders without crashing', () => {
    render(<Marquee {...defaultProps} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders all marquee items', () => {
    render(<Marquee {...defaultProps} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    render(<Marquee {...defaultProps} height={200} />);
    const container = screen.getByText('Item 1').closest('.marquee-container');
    expect(container).toHaveStyle({ height: '200px' });
  });

  it('applies custom delay', () => {
    render(<Marquee {...defaultProps} delay={100} />);
    // The delay prop affects animation speed, but we can't easily test this
    // without more complex animation testing
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('handles paused state', () => {
    render(<Marquee {...defaultProps} paused={true} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('handles pauseOnHover', () => {
    render(<Marquee {...defaultProps} pauseOnHover={true} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('handles pauseOnItemHover', () => {
    render(<Marquee {...defaultProps} pauseOnItemHover={true} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders with right direction', () => {
    render(<Marquee {...defaultProps} direction={MarqueeDirection.RIGHT} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders with left direction', () => {
    render(<Marquee {...defaultProps} direction={MarqueeDirection.LEFT} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders with up direction', () => {
    render(<Marquee {...defaultProps} direction={MarqueeDirection.UP} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders with down direction', () => {
    render(<Marquee {...defaultProps} direction={MarqueeDirection.DOWN} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('handles custom className', () => {
    render(<Marquee {...defaultProps} marqueeClassName="custom-marquee" />);
    const marquee = screen.getByText('Item 1').closest('.marquee');
    expect(marquee).toHaveClass('custom-marquee');
  });

  it('handles custom container className', () => {
    render(<Marquee {...defaultProps} marqueeContainerClassName="custom-container" />);
    const container = screen.getByText('Item 1').closest('.marquee-container');
    expect(container).toHaveClass('custom-container');
  });

  it('handles custom item className', () => {
    render(<Marquee {...defaultProps} marqueeItemClassName="custom-item" />);
    const items = screen.getAllByText(/Item \d/);
    items.forEach((item) => {
      expect(item).toHaveClass('custom-item');
    });
  });

  it('handles JSX elements as items', () => {
    const jsxItems = [<span key="1">JSX Item 1</span>, <span key="2">JSX Item 2</span>];
    render(<Marquee {...defaultProps} marqueeItems={jsxItems} />);
    expect(screen.getByText('JSX Item 1')).toBeInTheDocument();
    expect(screen.getByText('JSX Item 2')).toBeInTheDocument();
  });

  it('handles object items with text property', () => {
    const objectItems = [
      { text: 'Object Item 1', color: 1 },
      { text: 'Object Item 2', color: 2 },
    ];
    render(<Marquee {...defaultProps} marqueeItems={objectItems} />);
    expect(screen.getByText('Object Item 1')).toBeInTheDocument();
    expect(screen.getByText('Object Item 2')).toBeInTheDocument();
  });

  it('handles inverse marquee items', () => {
    render(<Marquee {...defaultProps} inverseMarqueeItems={true} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('handles minHeight when height is not provided', () => {
    const { height, ...propsWithoutHeight } = defaultProps;
    render(<Marquee {...propsWithoutHeight} minHeight={150} />);
    const container = screen.getByText('Item 1').closest('.marquee-container');
    expect(container).toHaveStyle({ minHeight: '150px' });
  });

  it('handles applyFadeMask', () => {
    render(<Marquee {...defaultProps} applyFadeMask={true} />);
    const container = screen.getByText('Item 1').closest('.marquee-container');
    expect(container).toHaveClass('fade-mask-white');
  });

  it('handles fadeMaskColor', () => {
    render(<Marquee {...defaultProps} applyFadeMask={true} fadeMaskColor={FadeMaskColor.BLACK} />);
    const container = screen.getByText('Item 1').closest('.marquee-container');
    expect(container).toHaveClass('fade-mask-black');
  });
});
