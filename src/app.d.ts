import "unplugin-icons/types/svelte";
import type { UserData } from "$lib/auth/user";

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: UserData | null;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
