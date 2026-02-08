interface Props<T> {
  item: T;
  isActive: boolean;
  onToggle: (item: T) => void;
}

const ActivationButton = <T,>({ item, isActive, onToggle }: Props<T>) => {
  return (
    <button
      type="button"
      className={`${isActive ? "bg-red-500" : "bg-green-500"} text-white px-3 py-1 rounded-md text-xs hover:opacity-90 transition`}
      onClick={() => onToggle(item)}
    >
      {isActive ? "DISABLE" : "ENABLE"}
    </button>
  );
};

export default ActivationButton;
