import "unplugin-icons/types/svelte";
import { APIUser } from "discord-api-types/v10";

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: APIUser | null;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
