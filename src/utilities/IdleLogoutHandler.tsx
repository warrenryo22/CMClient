import { useEffect, useState, useRef } from "react";
import { authService } from "@/services/authService";
import { MainModal } from "@/components/modals/MainModal";
import { Button } from "@/components/buttons/ReusableButton";

const IdleLogoutHandler = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const idleTimeMinutes = 1; // time before showing modal
  const logoutTimeSeconds = 120; // 2 mins until auto logout

  const resetIdleTimer = () => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);

    setIsModalOpen(false);

    idleTimeoutRef.current = setTimeout(
      () => {
        setIsModalOpen(true);

        logoutTimeoutRef.current = setTimeout(async () => {
          await authService.logout();
        }, logoutTimeSeconds * 1000);
      },
      idleTimeMinutes * 60 * 1000,
    );
  };

  // Listen to user activity
  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));

    resetIdleTimer(); // start timer on mount

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    };
  }, []);

  const handleModalOk = () => {
    resetIdleTimer();
  };

  return (
    <MainModal
      title="Are you still there?"
      isOpen={isModalOpen}
      onClose={handleModalOk}
      className="max-w-lg"
    >
      <p>
        You have been inactive. If you do not click OK in 2 minutes, you will be
        logged out automatically.
      </p>
      <div className="flex justify-end">
        <Button onClick={handleModalOk} className="mt-4">
          OK
        </Button>
      </div>
    </MainModal>
  );
};

export default IdleLogoutHandler;
