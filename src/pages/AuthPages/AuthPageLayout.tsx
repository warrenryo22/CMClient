import { motion } from "framer-motion";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { useTheme } from "../../context/ThemeContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  const svg =
    theme === "light" ? "/svg/wavesright.svg" : "/svg/wavesrightdark.svg";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-900
                   dark:from-gray-800 dark:via-gray-900 dark:to-black"
      ></div>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${svg})` }}
      ></div>

      <motion.div
        className="hidden lg:flex absolute top-0 left-0 h-full w-full lg:w-1/2 flex-col items-center justify-center text-start px-8"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="max-w-lg">
          <motion.h2
            className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Great to See You!
          </motion.h2>

          <motion.p
            className="text-sm xl:text-base text-gray-100 mb-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            We're glad to have you back. Sign in to continue your journey with
            us.
          </motion.p>

          <motion.p
            className="text-sm xl:text-base text-gray-100 mb-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          >
            Access your dashboard, manage your account, and stay up to date with
            all your tasks.
          </motion.p>

          <motion.img
            src="/photos/commons/doctors.png"
            alt="Doctors illustration"
            className="w-full max-w-sm xl:max-w-md mx-auto h-auto object-contain"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="relative z-10 flex min-h-screen w-full lg:w-1/2 lg:ml-auto items-center justify-center p-4 sm:p-6 lg:p-8"
      >
        <div className="w-full max-w-xl">{children}</div>
      </motion.div>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
