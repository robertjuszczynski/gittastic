import type { CHANNELS } from './channels'

export interface IEvents {
    [CHANNELS.OPEN_WORKSPACE]: {
        args: void,
        response?: Promise<string>;
    };
}