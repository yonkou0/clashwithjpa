import { toast as svToast } from "svelte-sonner";
import type { ExternalToast } from "svelte-sonner";
import { writable, type Writable } from "svelte/store";

const { set, subscribe, update }: Writable<boolean> = writable<boolean>(false);
let timeout: any;

const createToastFunction = (toastFunction: Function) => (message: string, options?: ExternalToast) => {
    const toastId = toastFunction(message, { ...options, duration: 2000 });
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        toast.dismiss();
        set(false);
    }, 2000);
    set(true);
    return toastId;
};

const toastFunction = (message: string, options?: ExternalToast) => createToastFunction(svToast)(message, options);

type PromiseT<Data = unknown> = Promise<Data> | (() => Promise<Data>);
type PromiseData<ToastData = unknown> = ExternalToast & {
    loading?: string;
    success?: string | ((data: ToastData) => string);
    error?: string | ((error: unknown) => string);
    finally?: () => void | Promise<void>;
};

const toast = Object.assign(toastFunction, {
    success: createToastFunction(svToast.success),
    info: createToastFunction(svToast.info),
    warning: createToastFunction(svToast.warning),
    error: createToastFunction(svToast.error),
    message: createToastFunction(svToast.message),
    promise: <ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData>) => {
        const toastId = svToast.promise(promise, data);
        console.log(`Toast ID: ${toastId}`);
        return toastId;
    },
    dismiss: (id?: number | string) => {
        const toastId = svToast.dismiss(id);
        return toastId;
    },
    loading: createToastFunction(svToast.loading)
});

export { toast, subscribe as subscribeToast };
