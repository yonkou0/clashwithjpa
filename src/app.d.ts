import "unplugin-icons/types/svelte";
import { UserData } from "$lib/auth/sessionHelper";

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
