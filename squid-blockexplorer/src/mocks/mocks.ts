/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chain } from "@subsquid/substrate-processor/lib/chain";
import { Logger } from "@subsquid/logger";
import { Store } from "@subsquid/typeorm-store";
import { decodeHex } from '@subsquid/substrate-processor';
import { CallItem, Context, EventItem } from '../processor';
import BlockHeaderMock from './BlockHeader.json';
import { SystemDigestStorage, SubspaceSolutionRangesStorage, TransactionFeesCollectedStorageFeesEscrowStorage } from '../types/storage';
import { Account, AccountRewards, Operator, OperatorRewards } from '../model';
import { createBlock, createCall, createExtrinsic } from '../blocks/utils';

const callData = {
  id: 'parent call id',
  name: 'Pallet.parent_call',
  args: {},
  pos: 1,
  parent: undefined,
  origin: {
    value: {
      value: "0x14682f9dea76a4dd47172a118eb29b9cf9976df7ade12f95709a7cd2e3d81d6c",
      __kind: 'Signed',
    },
    __kind: 'system',
  },
  success: true,
  error: undefined,
};

const extrinsicData = {
  id: 'parent call extrinsic id',
  indexInBlock: 0,
  version: 3,
  success: true,
  hash: 'random extrinsic hash',
  pos: 1,
  call: callData,
};

export const callItemWithSignature = {
  call: callData,
  extrinsic: {
    ...extrinsicData,
    signature: {
      address: 'random address',
      signature: {
        value: 'random signature',
      },
      signedExtensions: {},
    }
  },
  name: 'Pallet.parent_call',
  kind: 'call',
} as CallItem;

export const parentCallItem = {
  call: callData,
  extrinsic: extrinsicData,
  name: 'Pallet.parent_call',
  kind: 'call',
} as CallItem;

export const childCallItem = {
  name: 'Pallet.child_call',
  kind: 'call',
  extrinsic: extrinsicData,
  call: {
    ...callData,
    name: 'Pallet.child_call',
    id: 'child call id',
    parent: callData
  }
} as unknown as CallItem;

export const callsItems = [
  {
    ...callItemWithSignature,
    call: { ...callItemWithSignature.call, id: 'first id' },
    extrinsic: { ...callItemWithSignature.extrinsic, id: 'first id' }
  } as CallItem,
  {
    ...callItemWithSignature,
    call: { ...callItemWithSignature.call, id: 'second id' },
    extrinsic: { ...callItemWithSignature.extrinsic, id: 'second id' }
  } as CallItem,
];

export const eventItemWithoutExtrinsic = {
  name: 'Random Event name',
  kind: 'event',
  event: {
    id: 'random event id',
    extrinsic: undefined,
    call: parentCallItem.call,
    phase: 'ApplyExtrinsic',
    name: 'Random Event name',
    indexInBlock: 0,
    args: {},
    pos: 1,
  }
} as unknown as EventItem;

export const rewardEvent = {
  kind: 'event',
  name: 'Rewards.VoteReward',
  event: {
    args: {
      reward: '100000000000000000',
      voter: '0x38120f112ed212a0e72232b07cd2b249d512eec512783108b2d2cd06c00ef871'
    },
    id: '0000700560-000054-0c1bb',
    indexInBlock: 54,
    name: 'Rewards.VoteReward',
    phase: 'Finalization',
    pos: 82
  }
} as unknown as EventItem;

export const eventItemWithExtrinsic = {
  ...eventItemWithoutExtrinsic,
  event: {
    ...eventItemWithoutExtrinsic.event,
    extrinsic: {
      id: 'parent call extrinsic id',
      indexInBlock: 0,
      version: 3,
      call: parentCallItem.call,
      success: true,
      hash: 'random extrinsic hash',
      pos: 1,
    }
  }
} as unknown as EventItem;

const chainMock = {
  getEventHash(): string {
    return 'event hash';
  },
  decodeEvent(): any {
    return;
  },
  getCallHash(): string {
    return 'call hash';
  },
  decodeCall(): any {
    return;
  },
  getStorageItemTypeHash(): string | undefined {
    return 'random hash';
  },
  getStorage(): Promise<any> {
    return Promise.resolve();
  },
  queryStorage(): Promise<any[]> {
    return Promise.resolve([]);
  },
  getConstantTypeHash(): string | undefined {
    return;
  },
  getConstant(): any {
    return;
  },
  // TODO: this will require more sophisticated mocking for state_getKeysPagedAt and state_getStorageSizeAt methods
  client: {
    call() {
      return 0;
    },
  }
} as unknown as Chain;

const loggerMock = {
  child() {
    return this;
  },
  info() {
    return;
  },
  warn() {
    return;
  }
} as unknown as Logger;

const storeMock = {
  save: () => Promise.resolve(),
  get: () => Promise.resolve(),
  insert: () => Promise.resolve(),
} as unknown as Store;

export const contextMock: Context = {
  _chain: chainMock,
  log: loggerMock,
  store: storeMock,
  blocks: [],
  isHead: true,
};

export const SOLUTION_RANGES = BigInt(123);
export const SEGMENTS_COUNT = 123;
export const SPACE_PLEDGED = BigInt(123);

export const solutionRangesStorageFactoryMock = () => ({
  asV3: {
    get: () => ({ current: SOLUTION_RANGES })
  },
  asV0: {
    get: () => ({ current: SOLUTION_RANGES })
  },
  asV1: {
    get: () => ({ current: SOLUTION_RANGES })
  },
  asV2: {
    get: () => ({ current: SOLUTION_RANGES })
  },
} as unknown as SubspaceSolutionRangesStorage);

export const transactionFeesCollectedStorageMock = () => ({
  asV3: {
    get: () => SPACE_PLEDGED
  },
  asV0: {
    get: () => SPACE_PLEDGED
  },
  asV1: {
    get: () => SPACE_PLEDGED
  },
  asV2: {
    get: () => SPACE_PLEDGED
  },
} as unknown as TransactionFeesCollectedStorageFeesEscrowStorage);

export const digestLogs = [
  { __kind: 'Consensus' }, { __kind: 'PreRuntime' },
];

export const digestStorageFactoryMock = () => ({
  asV3: {
    get: () => ({
      logs: digestLogs,
    }),
  },
  asV0: {
    get: () => ({
      logs: digestLogs,
    }),
  },
  asV1: {
    get: () => ({
      logs: digestLogs,
    }),
  },
  asV2: {
    get: () => ({
      logs: digestLogs,
    }),
  }
} as unknown as SystemDigestStorage);

export const getOrCreateAccountMock = () => Promise.resolve(new Account({ id: '0x14682f9dea76a4dd47172a118eb29b9cf9976df7ade12f95709a7cd2e3d81d6c' }));
export const getOrCreateAccountRewardsMock = () => Promise.resolve(new AccountRewards({ id: '0x14682f9dea76a4dd47172a118eb29b9cf9976df7ade12f95709a7cd2e3d81d6c' }));
export const getOrCreateOperatorMock = () => Promise.resolve(new Operator({ id: '1' }));
export const getOrCreateOperatorRewardsMock = () => Promise.resolve(new OperatorRewards({ id: '1' }));
export const getOrCreateNominatorsMock = () => Promise.resolve([]);
export const addModuleNameMock = () => Promise.resolve();

export const blockMock = createBlock({
  header: BlockHeaderMock,
  spacePledged: BigInt(1),
  blockchainSize: BigInt(2),
  extrinsicsCount: 2,
  eventsCount: 5,
  author: new Account({ id: 'random account id' }),
});
export const extrinsicMock = createExtrinsic(parentCallItem as CallItem, blockMock);
export const parentCallMock = createCall(parentCallItem as CallItem, blockMock, extrinsicMock, null);

export const accountIdU8 = decodeHex('0x14682f9dea76a4dd47172a118eb29b9cf9976df7ade12f95709a7cd2e3d81d6c');
