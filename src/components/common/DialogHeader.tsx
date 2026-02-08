interface HeaderProps {
    title: string;
};

function DialogHeader({ title }: HeaderProps) {
    return (
        <>
            <div className="px-2 border-b border-gray-300 pb-[10px]">
                <h4 className="mb-2 text-[17px] font-semibold text-gray-800 dark:text-white/90">
                    {title}
                </h4>
            </div>
        </>
    );
}

export default DialogHeader;