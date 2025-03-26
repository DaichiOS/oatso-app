import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        // The user object must have both an id property and ALL the original properties from the DefaultSession's user object
        /*
        export interface DefaultSession {
        user?: {
            name?: string | null
            email?: string | null
            image?: string | null
        }
        expires: ISODateString
        }
        */
        user: {
            id: string;
        } & DefaultSession["user"];
    }

    // Replace the entire user interface with your own
    interface User { 
        id: string;
        email: string;
        name: string;
    }
}