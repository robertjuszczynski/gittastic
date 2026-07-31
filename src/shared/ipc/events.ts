import type { StatusResult } from 'simple-git'
import type { GitBranch, GitRawCommits, GitStash } from '../types/git.types'
import type { Repository, Repositories } from '../types/repositories.types'
import type { CHANNELS } from './channels'

export interface IEvents {
    [CHANNELS.OPEN_REPOSITORY]: {
        args: void,
        response?: Promise<Repository | void>;
    };
    [CHANNELS.GET_REPOSITORIES]: {
        args: void,
        response: Promise<Repositories>;
    };
    [CHANNELS.GET_ACTIVE_REPOSITORY]: {
        args: void,
        response: Promise<Repository | undefined>;
    };
    [CHANNELS.SET_ACTIVE_REPOSITORY]: {
        args: Repository
        response: Promise<Repository>;
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
