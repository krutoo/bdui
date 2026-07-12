import type { ReactNode } from 'react';

export interface FlexProps {
  grow?: boolean;
  direction?: 'row' | 'column';
  justify?: 'start' | 'end' | 'center';
  gap?: `${number}px`;
  children?: ReactNode;
}

export function Flex({ grow, direction, gap, justify, children }: FlexProps): ReactNode {
  return (
    <div
      style={{
        display: 'flex',
        flexGrow: grow ? '1' : '0',
        flexDirection: direction,
        gap,
        justifyContent:
          justify === 'start'
            ? 'flex-start'
            : justify === 'end'
              ? 'flex-end'
              : justify === 'center'
                ? 'center'
                : undefined,
      }}
    >
      {children}
    </div>
  );
}

Flex.displayName = 'Flex';
