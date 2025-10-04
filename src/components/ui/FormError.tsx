interface FormErrorProps {
  children: React.ReactNode;
}

export const FormError = ({ children }: FormErrorProps) => {
  return (
    <p className="text-red-500 text-sm mt-1">
      {children}
    </p>
  );
};
