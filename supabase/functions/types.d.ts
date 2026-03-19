declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): Promise<void>;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string): any;
}

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

declare namespace globalThis {
  var Deno: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

