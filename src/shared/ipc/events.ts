import type { GitRawCommits } from '../types/git.types'
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
    };
    [CHANNELS.GET_COMMITS]: {
        args: void;
        response: Promise<GitRawCommits>;
    };
    [CHANNELS.PULL]: {
        args: void;
        response: Promise<void>;
    };
    [CHANNELS.PUSH]: {
        args: void;
        response: Promise<void>;
    };
    [CHANNELS.FETCH]: {
        args: void;
        response: Promise<void>;
    };
}