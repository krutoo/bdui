export interface TextProps {
  color?: string;
  value?: string;
  bold?: boolean;
  italic?: boolean;
}

export function Text({ value, color, bold, italic }: TextProps) {
  return (
    <span
      style={{
        color,
        fontWeight: bold ? 'bold' : undefined,
        fontStyle: italic ? 'italic' : undefined,
      }}
    >
      {value}
    </span>
  );
}

Text.displayName = 'Text';
