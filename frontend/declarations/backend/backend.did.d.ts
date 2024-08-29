import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Project {
  'id' : bigint,
  'url' : string,
  'title' : string,
  'category' : string,
}
export interface _SERVICE {
  'addProject' : ActorMethod<[string, string, string], bigint>,
  'getProjects' : ActorMethod<[], Array<Project>>,
  'getProjectsByCategory' : ActorMethod<[string], Array<Project>>,
  'searchProjects' : ActorMethod<[string], Array<Project>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
