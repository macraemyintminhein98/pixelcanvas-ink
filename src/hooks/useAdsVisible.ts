import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Ads are shown to non-paying, signed-out visitors only.
 * Hidden when: user is signed in OR localStorage marker `cs_paying` is set
 * (set after a successful Stripe checkout return).
 */
export function useAdsVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;

    const compute = (signedIn: boolean) => {
      if (!active) return;
      let paid = false;
      try {
        paid = typeof window !== "undefined" && localStorage.getItem("cs_paying") === "1";
      } catch {
        /* ignore */
      }
      setVisible(!signedIn && !paid);
    };

    supabase.auth.getSession().then(({ data }) => compute(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      compute(!!session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return visible;
}
