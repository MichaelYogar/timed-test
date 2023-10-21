type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: string;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  type,
}) => {
  const props = {};

  if (type) props["type"] = type;

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium rounded-lg text-sm px-4 py-2 mr-2 mb-2 "
    >
      {children}
    </button>
  );
};
