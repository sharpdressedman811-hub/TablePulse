import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export type LayoutSize = 'phone' | 'tablet' | 'large-tablet';

export function useLayout() {
  const [dims, setDims] = useState(Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => setDims(window));
    return () => sub.remove();
  }, []);

  const isTablet = dims.width >= 768;
  const isLargeTablet = dims.width >= 1024;
  const layoutSize: LayoutSize = isLargeTablet ? 'large-tablet' : isTablet ? 'tablet' : 'phone';

  return { width: dims.width, height: dims.height, isTablet, isLargeTablet, layoutSize };
}
