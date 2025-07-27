interface Props {
  type: "submit" | "button";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function IconButton({
  type,
  disabled = false,
  onClick,
  title,
  children,
  className = ""
}: Readonly<Props>) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={className}>
      <span className="sr-only">{title}</span>
      {children}
    </button>
  );
}
