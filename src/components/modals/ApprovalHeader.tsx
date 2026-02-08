interface HeaderProps {
  title: string;
}

function ApprovalHeader({ title }: HeaderProps) {
  return (
    <>
      <div className="pb-[10px] mb-5">
        <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h4>
      </div>
    </>
  );
}

export default ApprovalHeader;
