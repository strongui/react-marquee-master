import { renderHook, act } from '@testing-library/react';
import useInterval from '../helpers/hookHelpers/useInterval';

describe('useInterval Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call callback at specified interval', () => {
    const callback = jest.fn();
    const delay = 1000;

    renderHook(() => useInterval(callback, delay));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not call callback when delay is null', () => {
    const callback = jest.fn();

    renderHook(() => useInterval(callback, null));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should use the latest callback', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const delay = 1000;

    const { rerender } = renderHook(
      ({ cb }) => useInterval(cb, delay),
      {
        initialProps: { cb: callback1 },
      }
    );

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    rerender({ cb: callback2 });

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should change interval when delay changes', () => {
    const callback = jest.fn();
    let delay = 1000;

    const { rerender } = renderHook(() => useInterval(callback, delay));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    delay = 500;
    rerender();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should clear interval when component unmounts', () => {
    const callback = jest.fn();
    const delay = 1000;

    const { unmount } = renderHook(() => useInterval(callback, delay));

    unmount();

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should pause interval when delay becomes null', () => {
    const callback = jest.fn();
    let delay: number | null = 1000;

    const { rerender } = renderHook(() => useInterval(callback, delay));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    delay = null;
    rerender();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should resume interval when delay becomes non-null', () => {
    const callback = jest.fn();
    let delay: number | null = null;

    const { rerender } = renderHook(() => useInterval(callback, delay));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();

    delay = 1000;
    rerender();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});