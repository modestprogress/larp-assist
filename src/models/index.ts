export interface Model {
  id: string;
  createdAtEpoch?: number;
  updatedAtEpoch?: number;
}

export interface User extends Model {
  id: string;
  gm: boolean;
  isActivated: boolean;
  name: string;
  characterId: string;
  notes: string;
  email: string;
}

export enum ListingType {
  OFFER = 'offer',
  SPEND = 'spend',
}

export interface Listing extends Model {
  itemId: string;
  available: number;
  value: number;
  type: ListingType;
}

export interface Item extends Model {
  name: string;
  description: string;
}

export interface File extends Model {
  code: string;
  bucket: string;
  path: string;
  url: string;
  common_name: string;
  common: boolean;
}

export interface Character extends Model {
  name: string;
  notes: string;
  balances: { [currencyId: string]: number };
}

export interface Market extends Model {
  name: string;
  characterIds: Array<string>;
  currencyId: string;
  listings?: { [key: string]: Listing };
}

export interface Currency extends Model {
  name: string;
  characterIds: Array<string>;
}

export interface Divination extends Model {
  content: string;
  name: string;
  characterId: string;
}

export interface Motd extends Model {
  content: string;
  characterId: string;
}

export interface Transaction extends Model {
  amount: number;
  currencyId: string;
  characterId: string;
  notes: string;
}
