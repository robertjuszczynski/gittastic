import type { Workspace, Workspaces } from '../types/workspaces.types'
import type { CHANNELS } from './channels'

export interface IEvents {
    [CHANNELS.OPEN_WORKSPACE]: {
        args: void,
        response?: Promise<Workspace>;
    };
    [CHANNELS.GET_WORKSPACES]: {
        args: void,
        response: Promise<Workspaces>;
    };
}