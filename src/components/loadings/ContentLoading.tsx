import { ReactNode } from 'react'
import SpinLoading from './SpinLoading';

interface ContentLoadingProps {
    isLoading: boolean;
    colorClass?: string;
    size?: number;
    children: ReactNode;
    className?: string;
    loadingContent?: ReactNode;
}

const ContentLoading = ({
    isLoading = false,
    colorClass = "border-blue-600",
    size = 40,
    children,
    className,
    loadingContent,
}: ContentLoadingProps) => {
    return (
        <>
            {isLoading ? (
                <div className={`${className} flex items-center justify-center`}
                >
                    <span className='flex items-center gap-2'>
                        <SpinLoading colorClass={colorClass} size={size}/>
                        {loadingContent}
                    </span>
                </div>
            ) : (
                children
            )}
        </>
    )
}

export default ContentLoading