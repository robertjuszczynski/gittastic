import type { StatusResult } from 'simple-git'
import type { GitBranch, GitRawCommits, GitStash, GitUser, FileChange, FileDiff } from '../types/git.types'
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
    [CHANNELS.STAGE_FILE]: {
        args: string;
        response: Promise<void>;
    };
    [CHANNELS.UNSTAGE_FILE]: {
        args: string;
        response: Promise<void>;
    };
    [CHANNELS.STAGE_ALL]: {
        args: void;
        response: Promise<void>;
    };
    [CHANNELS.UNSTAGE_ALL]: {
        args: void;
        response: Promise<void>;
    };
    [CHANNELS.STAGE_FOLDER]: {
        args: string;
        response: Promise<void>;
    };
    [CHANNELS.UNSTAGE_FOLDER]: {
        args: string;
        response: Promise<void>;
    };
    [CHANNELS.COMMIT]: {
        args: { message: string; description?: string };
        response: Promise<void>;
    };
    [CHANNELS.GET_USER]: {
        args: void;
        response: Promise<GitUser>;
    };
    [CHANNELS.GET_COMMIT_FILES]: {
        args: string;
        response: Promise<FileChange[]>;
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
    [CHANNELS.GET_FILE_DIFF]: {
        args: { path: string; hash?: string };
        response: Promise<FileDiff>;
    };
    [CHANNELS.STAGE_LINE]: {
        args: { path: string; lineNumber: number; isAddition: boolean };
        response: Promise<void>;
    };
    [CHANNELS.UNSTAGE_LINE]: {
        args: { path: string; lineNumber: number; isAddition: boolean };
        response: Promise<void>;
    };
    [CHANNELS.STASH]: {
        args: void;
        response: Promise<void>;
    };
    [CHANNELS.POP_STASH]: {
        args: void;
        response: Promise<void>;
    };
    [CHANNELS.UNDO]: {
        args: void;
        response: Promise<void>;
    };
    [CHANNELS.REDO]: {
        args: void;
        response: Promise<void>;
    };
}
