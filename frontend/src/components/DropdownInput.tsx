interface DropdownProps {
  options: string[];
  setRole: (role: string) => void;
}

const DropdownInput: React.FC<DropdownProps> = ({ options, setRole }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  return (
    <div className="relative w-64">
      <select
        onChange={handleInputChange}
        className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default DropdownInput;
