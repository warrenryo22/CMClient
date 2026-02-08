import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import successModalInstance from "../../utilities/successModalInstance";
import { MainModal } from "./MainModal";

type SuccessModalData = {
    message?: string;
    hideDuration?: number;
};

const SuccessModal = () => {
    const [notification, setNotification] = useState<SuccessModalData | null>(
        null
    );

    useEffect(() => {
        successModalInstance.setHandler((data: SuccessModalData) => {
            setNotification(data);
            setTimeout(() => {
                setNotification(null);
            }, data.hideDuration ?? 3000);
        });
    }, []);

    const handleClose = () => {
        setNotification(null);
    };

    if (!notification) return null;

    const { message } = notification;

    return createPortal(
        <MainModal isOpen={true} onClose={handleClose} className="max-w-sm">
            <div className="flex flex-col items-center text-center font-poppins ">
                <div className="flex justify-center mt-5 mb-2.5">
                    <img
                        src="/photos/gifs/check.gif"
                        alt="success"
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                        }}
                    />
                </div>
                <h5 className="text-[17px] font-medium text-[#0A1A28]">Success!</h5>
                <span className="text-[13px] font-normal text-[#8a9499] tracking-[0.5px]">
                    {message ?? "Your entry has been submitted successfully."}
                    <br />
                </span>
                <div className="mt-6 text-center">
                    <button
                        onClick={handleClose}
                        className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                    >
                        Close
                    </button>
                </div>
            </div>
        </MainModal>,
        document.body
    );
};

export default SuccessModal;
