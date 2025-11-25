import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export const useAutoLogout = () => {
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const clearSession = () => {
      localStorage.clear();
      sessionStorage.clear();
      signOut({ redirect: false }).catch(console.error);
    };

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        clearSession();
        window.location.href = '/';
      }, 30 * 60 * 1000); // 30 minutes of inactivity
    };

    const handleBeforeUnload = () => {
      // Clear session data when page is about to be closed
      localStorage.clear();
      sessionStorage.clear();
      signOut({ redirect: false }).catch(console.error);
    };

    const handleUnload = () => {
      // Additional cleanup on actual unload
      localStorage.clear();
      sessionStorage.clear();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Start a timer when tab becomes hidden
        setTimeout(() => {
          if (document.visibilityState === 'hidden') {
            clearSession();
          }
        }, 5 * 60 * 1000); // 5 minutes of inactivity when tab is hidden
      } else {
        // Reset inactivity timer when tab becomes visible again
        resetInactivityTimer();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Add activity listeners
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    // Add page lifecycle listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize the timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};