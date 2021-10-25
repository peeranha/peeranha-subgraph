// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save User entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save User entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("User", id.toString(), this);
  }

  static load(id: string): User | null {
    return store.get("User", id) as User | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get rating(): i32 {
    let value = this.get("rating");
    return value.toI32();
  }

  set rating(value: i32) {
    this.set("rating", Value.fromI32(value));
  }

  get displayName(): string | null {
    let value = this.get("displayName");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set displayName(value: string | null) {
    if (value === null) {
      this.unset("displayName");
    } else {
      this.set("displayName", Value.fromString(value as string));
    }
  }

  get company(): string | null {
    let value = this.get("company");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set company(value: string | null) {
    if (value === null) {
      this.unset("company");
    } else {
      this.set("company", Value.fromString(value as string));
    }
  }

  get position(): string | null {
    let value = this.get("position");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set position(value: string | null) {
    if (value === null) {
      this.unset("position");
    } else {
      this.set("position", Value.fromString(value as string));
    }
  }

  get location(): string | null {
    let value = this.get("location");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set location(value: string | null) {
    if (value === null) {
      this.unset("location");
    } else {
      this.set("location", Value.fromString(value as string));
    }
  }

  get about(): string | null {
    let value = this.get("about");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set about(value: string | null) {
    if (value === null) {
      this.unset("about");
    } else {
      this.set("about", Value.fromString(value as string));
    }
  }

  get avatar(): string | null {
    let value = this.get("avatar");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set avatar(value: string | null) {
    if (value === null) {
      this.unset("avatar");
    } else {
      this.set("avatar", Value.fromString(value as string));
    }
  }

  get creationTime(): BigInt | null {
    let value = this.get("creationTime");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set creationTime(value: BigInt | null) {
    if (value === null) {
      this.unset("creationTime");
    } else {
      this.set("creationTime", Value.fromBigInt(value as BigInt));
    }
  }

  get ipfsHash(): Bytes | null {
    let value = this.get("ipfsHash");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash");
    } else {
      this.set("ipfsHash", Value.fromBytes(value as Bytes));
    }
  }

  get ipfsHash2(): Bytes | null {
    let value = this.get("ipfsHash2");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash2(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash2");
    } else {
      this.set("ipfsHash2", Value.fromBytes(value as Bytes));
    }
  }
}

export class Community extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Community entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Community entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Community", id.toString(), this);
  }

  static load(id: string): Community | null {
    return store.get("Community", id) as Community | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (value === null) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(value as string));
    }
  }

  get description(): string | null {
    let value = this.get("description");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set description(value: string | null) {
    if (value === null) {
      this.unset("description");
    } else {
      this.set("description", Value.fromString(value as string));
    }
  }

  get website(): string | null {
    let value = this.get("website");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set website(value: string | null) {
    if (value === null) {
      this.unset("website");
    } else {
      this.set("website", Value.fromString(value as string));
    }
  }

  get language(): string | null {
    let value = this.get("language");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set language(value: string | null) {
    if (value === null) {
      this.unset("language");
    } else {
      this.set("language", Value.fromString(value as string));
    }
  }

  get avatar(): string | null {
    let value = this.get("avatar");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set avatar(value: string | null) {
    if (value === null) {
      this.unset("avatar");
    } else {
      this.set("avatar", Value.fromString(value as string));
    }
  }

  get isFrozen(): boolean {
    let value = this.get("isFrozen");
    return value.toBoolean();
  }

  set isFrozen(value: boolean) {
    this.set("isFrozen", Value.fromBoolean(value));
  }

  get creationTime(): BigInt | null {
    let value = this.get("creationTime");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set creationTime(value: BigInt | null) {
    if (value === null) {
      this.unset("creationTime");
    } else {
      this.set("creationTime", Value.fromBigInt(value as BigInt));
    }
  }

  get postCount(): i32 {
    let value = this.get("postCount");
    return value.toI32();
  }

  set postCount(value: i32) {
    this.set("postCount", Value.fromI32(value));
  }

  get ipfsHash(): Bytes | null {
    let value = this.get("ipfsHash");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash");
    } else {
      this.set("ipfsHash", Value.fromBytes(value as Bytes));
    }
  }

  get ipfsHash2(): Bytes | null {
    let value = this.get("ipfsHash2");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash2(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash2");
    } else {
      this.set("ipfsHash2", Value.fromBytes(value as Bytes));
    }
  }
}

export class Tag extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Tag entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Tag entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Tag", id.toString(), this);
  }

  static load(id: string): Tag | null {
    return store.get("Tag", id) as Tag | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get communityId(): BigInt | null {
    let value = this.get("communityId");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set communityId(value: BigInt | null) {
    if (value === null) {
      this.unset("communityId");
    } else {
      this.set("communityId", Value.fromBigInt(value as BigInt));
    }
  }

  get name(): string | null {
    let value = this.get("name");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (value === null) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(value as string));
    }
  }

  get description(): string | null {
    let value = this.get("description");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set description(value: string | null) {
    if (value === null) {
      this.unset("description");
    } else {
      this.set("description", Value.fromString(value as string));
    }
  }

  get postCount(): i32 {
    let value = this.get("postCount");
    return value.toI32();
  }

  set postCount(value: i32) {
    this.set("postCount", Value.fromI32(value));
  }

  get ipfsHash(): Bytes | null {
    let value = this.get("ipfsHash");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash");
    } else {
      this.set("ipfsHash", Value.fromBytes(value as Bytes));
    }
  }

  get ipfsHash2(): Bytes | null {
    let value = this.get("ipfsHash2");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash2(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash2");
    } else {
      this.set("ipfsHash2", Value.fromBytes(value as Bytes));
    }
  }
}

export class Post extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Post entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Post entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Post", id.toString(), this);
  }

  static load(id: string): Post | null {
    return store.get("Post", id) as Post | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tags(): Array<i32> | null {
    let value = this.get("tags");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toI32Array();
    }
  }

  set tags(value: Array<i32> | null) {
    if (value === null) {
      this.unset("tags");
    } else {
      this.set("tags", Value.fromI32Array(value as Array<i32>));
    }
  }

  get ipfsHash(): Bytes | null {
    let value = this.get("ipfsHash");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash");
    } else {
      this.set("ipfsHash", Value.fromBytes(value as Bytes));
    }
  }

  get ipfsHash2(): Bytes | null {
    let value = this.get("ipfsHash2");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash2(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash2");
    } else {
      this.set("ipfsHash2", Value.fromBytes(value as Bytes));
    }
  }

  get postType(): i32 {
    let value = this.get("postType");
    return value.toI32();
  }

  set postType(value: i32) {
    this.set("postType", Value.fromI32(value));
  }

  get author(): Bytes | null {
    let value = this.get("author");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set author(value: Bytes | null) {
    if (value === null) {
      this.unset("author");
    } else {
      this.set("author", Value.fromBytes(value as Bytes));
    }
  }

  get rating(): i32 {
    let value = this.get("rating");
    return value.toI32();
  }

  set rating(value: i32) {
    this.set("rating", Value.fromI32(value));
  }

  get postTime(): BigInt | null {
    let value = this.get("postTime");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set postTime(value: BigInt | null) {
    if (value === null) {
      this.unset("postTime");
    } else {
      this.set("postTime", Value.fromBigInt(value as BigInt));
    }
  }

  get communityId(): BigInt | null {
    let value = this.get("communityId");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set communityId(value: BigInt | null) {
    if (value === null) {
      this.unset("communityId");
    } else {
      this.set("communityId", Value.fromBigInt(value as BigInt));
    }
  }

  get title(): string | null {
    let value = this.get("title");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set title(value: string | null) {
    if (value === null) {
      this.unset("title");
    } else {
      this.set("title", Value.fromString(value as string));
    }
  }

  get content(): string | null {
    let value = this.get("content");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set content(value: string | null) {
    if (value === null) {
      this.unset("content");
    } else {
      this.set("content", Value.fromString(value as string));
    }
  }

  get commentCount(): i32 {
    let value = this.get("commentCount");
    return value.toI32();
  }

  set commentCount(value: i32) {
    this.set("commentCount", Value.fromI32(value));
  }

  get replyCount(): i32 {
    let value = this.get("replyCount");
    return value.toI32();
  }

  set replyCount(value: i32) {
    this.set("replyCount", Value.fromI32(value));
  }

  get isDeleted(): boolean {
    let value = this.get("isDeleted");
    return value.toBoolean();
  }

  set isDeleted(value: boolean) {
    this.set("isDeleted", Value.fromBoolean(value));
  }

  get officialReply(): i32 {
    let value = this.get("officialReply");
    return value.toI32();
  }

  set officialReply(value: i32) {
    this.set("officialReply", Value.fromI32(value));
  }

  get bestReply(): i32 {
    let value = this.get("bestReply");
    return value.toI32();
  }

  set bestReply(value: i32) {
    this.set("bestReply", Value.fromI32(value));
  }

  get isFirstReply(): boolean {
    let value = this.get("isFirstReply");
    return value.toBoolean();
  }

  set isFirstReply(value: boolean) {
    this.set("isFirstReply", Value.fromBoolean(value));
  }

  get isQuickReply(): boolean {
    let value = this.get("isQuickReply");
    return value.toBoolean();
  }

  set isQuickReply(value: boolean) {
    this.set("isQuickReply", Value.fromBoolean(value));
  }

  get properties(): Array<BigInt> | null {
    let value = this.get("properties");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigIntArray();
    }
  }

  set properties(value: Array<BigInt> | null) {
    if (value === null) {
      this.unset("properties");
    } else {
      this.set("properties", Value.fromBigIntArray(value as Array<BigInt>));
    }
  }
}

export class Reply extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Reply entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Reply entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Reply", id.toString(), this);
  }

  static load(id: string): Reply | null {
    return store.get("Reply", id) as Reply | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get ipfsHash(): Bytes | null {
    let value = this.get("ipfsHash");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash");
    } else {
      this.set("ipfsHash", Value.fromBytes(value as Bytes));
    }
  }

  get ipfsHash2(): Bytes | null {
    let value = this.get("ipfsHash2");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash2(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash2");
    } else {
      this.set("ipfsHash2", Value.fromBytes(value as Bytes));
    }
  }

  get author(): Bytes | null {
    let value = this.get("author");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set author(value: Bytes | null) {
    if (value === null) {
      this.unset("author");
    } else {
      this.set("author", Value.fromBytes(value as Bytes));
    }
  }

  get rating(): i32 {
    let value = this.get("rating");
    return value.toI32();
  }

  set rating(value: i32) {
    this.set("rating", Value.fromI32(value));
  }

  get postTime(): BigInt | null {
    let value = this.get("postTime");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set postTime(value: BigInt | null) {
    if (value === null) {
      this.unset("postTime");
    } else {
      this.set("postTime", Value.fromBigInt(value as BigInt));
    }
  }

  get postId(): BigInt | null {
    let value = this.get("postId");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set postId(value: BigInt | null) {
    if (value === null) {
      this.unset("postId");
    } else {
      this.set("postId", Value.fromBigInt(value as BigInt));
    }
  }

  get parentReplyId(): i32 {
    let value = this.get("parentReplyId");
    return value.toI32();
  }

  set parentReplyId(value: i32) {
    this.set("parentReplyId", Value.fromI32(value));
  }

  get content(): string | null {
    let value = this.get("content");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set content(value: string | null) {
    if (value === null) {
      this.unset("content");
    } else {
      this.set("content", Value.fromString(value as string));
    }
  }

  get commentCount(): i32 {
    let value = this.get("commentCount");
    return value.toI32();
  }

  set commentCount(value: i32) {
    this.set("commentCount", Value.fromI32(value));
  }

  get isDeleted(): boolean {
    let value = this.get("isDeleted");
    return value.toBoolean();
  }

  set isDeleted(value: boolean) {
    this.set("isDeleted", Value.fromBoolean(value));
  }

  get isOfficialReply(): boolean {
    let value = this.get("isOfficialReply");
    return value.toBoolean();
  }

  set isOfficialReply(value: boolean) {
    this.set("isOfficialReply", Value.fromBoolean(value));
  }

  get isBestReply(): boolean {
    let value = this.get("isBestReply");
    return value.toBoolean();
  }

  set isBestReply(value: boolean) {
    this.set("isBestReply", Value.fromBoolean(value));
  }

  get isFirstReply(): boolean {
    let value = this.get("isFirstReply");
    return value.toBoolean();
  }

  set isFirstReply(value: boolean) {
    this.set("isFirstReply", Value.fromBoolean(value));
  }

  get isQuickReply(): boolean {
    let value = this.get("isQuickReply");
    return value.toBoolean();
  }

  set isQuickReply(value: boolean) {
    this.set("isQuickReply", Value.fromBoolean(value));
  }

  get properties(): Array<Bytes> | null {
    let value = this.get("properties");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytesArray();
    }
  }

  set properties(value: Array<Bytes> | null) {
    if (value === null) {
      this.unset("properties");
    } else {
      this.set("properties", Value.fromBytesArray(value as Array<Bytes>));
    }
  }
}

export class Comment extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Comment entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Comment entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Comment", id.toString(), this);
  }

  static load(id: string): Comment | null {
    return store.get("Comment", id) as Comment | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get ipfsHash(): Bytes | null {
    let value = this.get("ipfsHash");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash");
    } else {
      this.set("ipfsHash", Value.fromBytes(value as Bytes));
    }
  }

  get ipfsHash2(): Bytes | null {
    let value = this.get("ipfsHash2");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set ipfsHash2(value: Bytes | null) {
    if (value === null) {
      this.unset("ipfsHash2");
    } else {
      this.set("ipfsHash2", Value.fromBytes(value as Bytes));
    }
  }

  get author(): Bytes | null {
    let value = this.get("author");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set author(value: Bytes | null) {
    if (value === null) {
      this.unset("author");
    } else {
      this.set("author", Value.fromBytes(value as Bytes));
    }
  }

  get rating(): i32 {
    let value = this.get("rating");
    return value.toI32();
  }

  set rating(value: i32) {
    this.set("rating", Value.fromI32(value));
  }

  get postTime(): BigInt | null {
    let value = this.get("postTime");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set postTime(value: BigInt | null) {
    if (value === null) {
      this.unset("postTime");
    } else {
      this.set("postTime", Value.fromBigInt(value as BigInt));
    }
  }

  get postId(): BigInt | null {
    let value = this.get("postId");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set postId(value: BigInt | null) {
    if (value === null) {
      this.unset("postId");
    } else {
      this.set("postId", Value.fromBigInt(value as BigInt));
    }
  }

  get parentReplyId(): i32 {
    let value = this.get("parentReplyId");
    return value.toI32();
  }

  set parentReplyId(value: i32) {
    this.set("parentReplyId", Value.fromI32(value));
  }

  get content(): string | null {
    let value = this.get("content");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set content(value: string | null) {
    if (value === null) {
      this.unset("content");
    } else {
      this.set("content", Value.fromString(value as string));
    }
  }

  get isDeleted(): boolean {
    let value = this.get("isDeleted");
    return value.toBoolean();
  }

  set isDeleted(value: boolean) {
    this.set("isDeleted", Value.fromBoolean(value));
  }

  get properties(): Array<Bytes> | null {
    let value = this.get("properties");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytesArray();
    }
  }

  set properties(value: Array<Bytes> | null) {
    if (value === null) {
      this.unset("properties");
    } else {
      this.set("properties", Value.fromBytesArray(value as Array<Bytes>));
    }
  }
}
