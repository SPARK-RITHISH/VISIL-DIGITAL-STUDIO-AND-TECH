import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { supabase } from "@/integrations/supabase/client";

const lovableAuth = createLovableAuth();

export const lovable = {
  auth: {
    signInWithOAuth: async (
      provider: "google" | "apple" | "microsoft" | "lovable",
      opts?: { redirect_uri?: string; extraParams?: Record<string, string> },
    ) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: opts?.extraParams,
      });

      if (result.redirected || result.error) {
        return result;
      }

      try {
        await supabase.auth.setSession(result.tokens);
      } catch (error) {
        return { error: error instanceof Error ? error : new Error(String(error)) };
      }

      return result;
    },
  },
};
