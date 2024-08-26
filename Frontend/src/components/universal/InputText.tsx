import { twMerge } from "tailwind-merge";

const InputText = ({
  name,
  className,
  placeholder,
  onChange,
  value,
  id,
  type="text"
}: {
  name: string;
  className?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number | undefined;
  id?: string;
  type?: string;
}) => {
  return (
    <input
      type={type}
      autoComplete="new-password"
      name={name}
      id={id || name}
      placeholder={placeholder || name}
      value={value !== undefined ? value:""}
      onChange={onChange}
      className={twMerge("w-full rounded-md border-[1px] pl-2 pr-2 pt-2 pb-2", className)}
    />
  );
};

export default InputText;
