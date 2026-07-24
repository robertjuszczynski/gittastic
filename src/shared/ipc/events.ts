import type { Workspace, Workspaces } from '../types/workspaces.types'
import type { CHANNELS } from './channels'

export interface IEvents {
    [CHANNELS.OPEN_WORKSPACE]: {
        args: void,
        response?: Promise<Workspace | void>;
    };
    [CHANNELS.GET_WORKSPACES]: {
        args: void,
        response: Promise<Workspaces>;
    };
    [CHANNELS.GET_ACTIVE_WORKSPACE]: {
        args: void,
        response: Promise<Workspace | undefined>;
    };
    [CHANNELS.SET_ACTIVE_WORKSPACE]: {
        args: Workspace
        response: Promise<Workspace>;
    }
}