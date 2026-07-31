import type { StatusResult } from 'simple-git'
import type { GitBranch, GitRawCommits, GitStash } from '../types/git.types'
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
        args: { limit?: number; skip?: number };
        response: Promise<GitRawCommits>;
    };
    [CHANNELS.GET_BRANCHES]: {
        args: void;
        response: Promise<GitBranch[]>;
    };
    [CHANNELS.GET_STASHES]: {
        args: void;
        response: Promise<GitStash[]>;
    };
    [CHANNELS.CHECKOUT_BRANCH]: {
        args: string;
        response: Promise<void>;
    };
    [CHANNELS.CREATE_BRANCH]: {
        args: string;
        response: Promise<void>;
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
    [CHANNELS.GET_STATUS]: {
        args: void;
        response: Promise<StatusResult>;
    };
}
