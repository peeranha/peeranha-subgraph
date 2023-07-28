import { Address, BigInt, Bytes, log, store, ethereum } from '@graphprotocol/graph-ts'
import { UserCreated, UserUpdated, FollowedCommunity, UnfollowedCommunity, RoleGranted, RoleRevoked } from '../generated/PeeranhaUser/PeeranhaUser'
import { 
  CommunityCreated, CommunityUpdated, CommunityFrozen, CommunityUnfrozen,
  TagCreated, TagUpdated
} from '../generated/PeeranhaCommunity/PeeranhaCommunity'
import { PostCreated, PostEdited, PostDeleted,
  ReplyCreated, ReplyEdited, ReplyDeleted,
  CommentCreated, CommentEdited, CommentDeleted,
  ForumItemVoted, SetDocumentationTree,
  ChangePostType, StatusBestReplyChanged,
  TranslationCreated, TranslationEdited, TranslationDeleted
} from '../generated/PeeranhaContent/PeeranhaContent'

import { GetReward } from '../generated/PeeranhaToken/PeeranhaToken'
import { 
  User, Community, Tag, Post, Reply, Comment, Achievement, ContractInfo, UserReward, Period, History, UserPermission, CommunityDocumentation,
  PostTranslation, ReplyTranslation, CommentTranslation, Statistic
} from '../generated/schema'
import { USER_ADDRESS } from './config'
import { getPeeranhaUser, getPeeranhaToken, getPeeranhaContent, PostType } from './utils'

import { newPost, addDataToPost, deletePost, newReply, addDataToReply, deleteReply,
  newPostTranslation, newReplyTranslation, newCommentTranslation,
  addDataToPostTranslation, addDataToReplyTranslation, addDataToCommentTranslation,
  newComment, addDataToComment, deleteComment, updatePostContent, updatePostUsersRatings, generateDocumentationPosts } from './post'
import { newCommunity, addDataToCommunity, newTag, addDataToTag, getCommunity } from './community-tag'
import { newUser, addDataToUser, updateUserRating} from './user'
import { addDataToAchievement, giveAchievement, newAchievement } from './achievement'
import { ConfigureNewAchievementNFT, Transfer } from '../generated/PeeranhaNFT/PeeranhaNFT'

const POOL_NFT = 1000000;

const FORUM_ITEM_VOTED_EVENT = 'ForumItemVoted';
  
export function handleConfigureNewAchievement(event: ConfigureNewAchievementNFT): void {
  let achievement = new Achievement(event.params.achievementId.toString());
  newAchievement(achievement, event.params.achievementId);

  achievement.save();  
}

///
// TODO remove NFT
// indexing all users?   if (!user) return;
// can be error when remove
///
export function handleTransferNFT(event: Transfer): void {
  let id : BigInt = (event.params.tokenId.div(BigInt.fromI32(POOL_NFT))).plus(BigInt.fromI32(1)); // (a / b) + c
  log.debug('User: {}, ID txx: {}, Achievement Id txx: {}', [event.params.to.toHex(), event.params.tokenId.toString(), id.toString()])
  let achievement = Achievement.load(id.toString());

  if (achievement != null) {
    addDataToAchievement(achievement, id);

    giveAchievement(id, event.params.to);

    achievement.save();  
  }

  logTransaction(event, event.params.to, 'Transfer', 0, 0);
}


export function handleNewUser(event: UserCreated): void {
  let user = new User(event.params.userAddress.toHex());
  newUser(user, event.params.userAddress, event.block.timestamp);
  user.save();

  indexingPeriods();
  logTransaction(event, event.params.userAddress, 'UserCreated', 0, 0);
}

export function handleUpdatedUser(event: UserUpdated): void {
  let id = event.params.userAddress.toHex()
  let user = User.load(id)
  if (user == null) {
    user = new User(id)
    newUser(user, event.params.userAddress, event.block.timestamp);
  } else {
    addDataToUser(user, event.params.userAddress);
  }
  user.save();
  
  indexingPeriods();
  logTransaction(event, event.params.userAddress, 'UserUpdated', 0, 0);
}

export function handlerGrantedRole(event: RoleGranted): void {
  let userPermission = new UserPermission(event.params.account.toHex() + '-' + event.params.role.toHex());
  userPermission.user = event.params.account.toHex();
  userPermission.permission = event.params.role;
  userPermission.save();
  
  logTransaction(event, event.params.sender, 'RoleGranted', 0, 0);
}

export function handlerRevokedRole(event: RoleRevoked): void {
  let userPermissionId = event.params.account.toHex() + '-' + event.params.role.toHex();
  store.remove('UserPermission', userPermissionId);
  logTransaction(event, event.params.sender, 'RoleRevoked', 0, 0);
}

export function handlerFollowCommunity(event: FollowedCommunity): void {
  let user = User.load(event.params.userAddress.toHex());
  let followedCommunities = user.followedCommunities
  followedCommunities.push(event.params.communityId.toString())

  user.followedCommunities = followedCommunities
  user.save();

  let community = Community.load(event.params.communityId.toString())
  community.followingUsers++;
  community.save();

  indexingPeriods();
  logTransaction(event, event.params.userAddress, 'FollowedCommunity', 0, 0, event.params.communityId);
}

export function handlerUnfollowCommunity(event: UnfollowedCommunity): void {
  let user = User.load(event.params.userAddress.toHex());
  
  let followedCommunities: string[] = [];
  let followedCommunitiesBuf = user.followedCommunities

  for (let i = 0; i < user.followedCommunities.length; i++) {
    let community = followedCommunitiesBuf.pop()
    if (community != event.params.communityId.toString()) {
      followedCommunities.push(community)   
    }
  }

  user.followedCommunities = followedCommunities;
  user.save();

  let community = Community.load(event.params.communityId.toString())
  community.followingUsers--;
  community.save();

  indexingPeriods();
  logTransaction(event, event.params.userAddress, 'UnfollowedCommunity', 0, 0, event.params.communityId);
}

export function handleNewCommunity(event: CommunityCreated): void {
  let communityiD = event.params.id; 
  let community = new Community(communityiD.toString());

  newCommunity(community, communityiD);
  community.save();

  indexingPeriods();
  logTransaction(event, event.params.user, 'CommunityCreated', 0, 0, event.params.id);
}

export function handleUpdatedCommunity(event: CommunityUpdated): void {
  let id = event.params.id.toString()
  let community = Community.load(id)
  if (community == null) {
    community = new Community(id);
    newCommunity(community, event.params.id);
  } else {
    addDataToCommunity(community, event.params.id);
  }
  community.save();

  indexingPeriods();
  logTransaction(event, event.params.user, 'CommunityUpdated', 0, 0, event.params.id);
}

export function handleFrozenCommunity(event: CommunityFrozen): void {
  let id = event.params.communityId.toString()
  let community = Community.load(id)
  if (community != null) {
    community.isFrozen = true;
    community.save();
  }

  logTransaction(event, event.params.user, 'CommunityFrozen', 0, 0, event.params.communityId);
}

export function handleUnfrozenCommunity(event: CommunityUnfrozen): void {
  let id = event.params.communityId.toString()
  let community = Community.load(id)
  if (community != null) {
    community.isFrozen = false;
    community.save();
  } else {
    community = new Community(id);
    newCommunity(community, event.params.communityId);
  }

  logTransaction(event, event.params.user, 'CommunityUnfrozen', 0, 0, event.params.communityId);
}

export function handleNewTag(event: TagCreated): void {
  let community = getCommunity(event.params.communityId);
  community.tagsCount++;
  community.save();
  let tag = new Tag(event.params.communityId.toString() + "-" + BigInt.fromI32(event.params.tagId).toString());
  
  newTag(tag, event.params.communityId, BigInt.fromI32(event.params.tagId));
  tag.save(); 

  logTransaction(event, event.params.user, 'TagCreated', 0, 0, event.params.communityId);
}

export function handleEditedTag(event: TagUpdated): void {
  let tag = Tag.load(event.params.communityId.toString() + "-" + BigInt.fromI32(event.params.tagId).toString());
  addDataToTag(tag, event.params.communityId, BigInt.fromI32(event.params.tagId));
  tag.save();

  logTransaction(event, event.params.user, 'TagUpdated', 0, 0, event.params.communityId);
}

// TODO: Get rid of generics in this method. eventEntity and eventName values move to constants or enums.
export function createHistory<T1, T2>(item: T1,  event: T2,  eventEntity: string, eventName: string): void {
  let history = new History(event.transaction.hash.toHex());
  history.post = event.params.postId.toString();
  if (item instanceof Reply) {
    history.reply = item.id;
  }
  if (item instanceof Comment) {
    history.comment = item.id;
  }

  history.transactionHash = event.transaction.hash;
  history.eventEntity = eventEntity;
  history.eventName = eventName;
  history.actionUser = event.params.user.toHex();
  history.timeStamp = event.block.timestamp;
  history.save();
}

export function handleNewPost(event: PostCreated): void {
  let post = new Post(event.params.postId.toString());

  newPost(post, event.params.postId, event.block.timestamp);
  post.save();
  createHistory(post, event, 'Post', 'Create');
  
  indexingPeriods();

  logTransaction(event, event.params.user, 'PostCreated', 0, 0, event.params.communityId, event.params.postId);
}

export function handleEditedPost(event: PostEdited): void {
  let post = Post.load(event.params.postId.toString());
  if (post == null) {
    post = new Post(event.params.postId.toString())
    newPost(post, event.params.postId, event.block.timestamp);
  } else {
    post.lastmod = event.block.timestamp;
    addDataToPost(post, event.params.postId);
  }
  post.save();

  let postId = event.params.postId;
  updatePostContent(postId);
  createHistory(post, event, 'Post', 'Edit');

  indexingPeriods();

  logTransaction(event, event.params.user, 'PostEdited', 0, 0, post.communityId, event.params.postId);
}

export function handleChangedTypePost(event: ChangePostType): void {
  let post = Post.load(event.params.postId.toString())
  if (post != null) {
    post.lastmod = event.block.timestamp;
    post.postType = event.params.newPostType;
    updatePostUsersRatings(post);
    post.save();
  }

  logTransaction(event, event.params.user, 'ChangePostType', 0, 0, post.communityId, event.params.postId);
}

export function handleDeletedPost(event: PostDeleted): void {
  let post = Post.load(event.params.postId.toString());
  if (post == null) return;

  deletePost(post, event.params.postId);
  post.save();
  createHistory(post, event, 'Post', 'Delete');

  indexingPeriods();
  
  logTransaction(event, event.params.user, 'PostDeleted', 0, 0, post.communityId, event.params.postId);
}

export function handleNewReply(event: ReplyCreated): void {
  let replyId = event.params.replyId;
  let reply = new Reply(event.params.postId.toString() + "-" + replyId.toString());

  newReply(reply, event.params.postId, replyId, event.block.timestamp);
  reply.save();
  createHistory(reply, event, 'Reply', 'Create');

  let post = Post.load(event.params.postId.toString());
  if(post){
    post.lastmod = event.block.timestamp;
    post.save();
  }

  indexingPeriods();
  
  logTransaction(event, event.params.user, 'ReplyCreated', event.params.replyId, 0, post.communityId, event.params.postId);
}

export function handleEditedReply(event: ReplyEdited): void { 
  let replyId = event.params.replyId;
  let reply = Reply.load(event.params.postId.toString() + "-" + replyId.toString());

  if (reply == null) {
    reply = new Reply(event.params.postId.toString() + "-" + replyId.toString());
    newReply(reply, event.params.postId, replyId, event.block.timestamp);
  } else {
    addDataToReply(reply, event.params.postId, replyId);
  }
  reply.save();

  let postId = event.params.postId;
  updatePostContent(postId);
  createHistory(reply, event, 'Reply', 'Edit');

  let post = Post.load(event.params.postId.toString());
  if(post){
    post.lastmod = event.block.timestamp;
    post.save();
  }

  indexingPeriods();
  logTransaction(event, event.params.user, 'ReplyEdited', event.params.replyId, 0, post.communityId, event.params.postId);
}

export function handleDeletedReply(event: ReplyDeleted): void {
  let replyId = BigInt.fromI32(event.params.replyId);
  let reply = Reply.load(event.params.postId.toString() + "-" + replyId.toString());
  if (reply == null) return;

  deleteReply(reply, event.params.postId);
  reply.save();

  let postId = event.params.postId;
  updatePostContent(postId);
  createHistory(reply, event, 'Reply', 'Delete');

  let post = Post.load(event.params.postId.toString());
  if(post){
    post.lastmod = event.block.timestamp;
    post.save();
  }

  indexingPeriods();
  logTransaction(event, event.params.user, 'ReplyDeleted', event.params.replyId, 0, post.communityId, event.params.postId);
}

export function handleNewComment(event: CommentCreated): void {
  let commentId = BigInt.fromI32(event.params.commentId);
  let parentReplyId = BigInt.fromI32(event.params.parentReplyId);
  let comment = new Comment(event.params.postId.toString() + "-" + parentReplyId.toString() + "-" +  commentId.toString());

  newComment(comment, event.params.postId, BigInt.fromI32(event.params.parentReplyId), commentId);  //без конвертации
  comment.save();
  createHistory(comment, event, 'Comment', 'Create');

  let post = Post.load(event.params.postId.toString());
  if(post){
    post.lastmod = event.block.timestamp;
    post.save();
  }

  indexingPeriods();
  logTransaction(
    event,
    event.params.user,
    'CommentCreated',
    event.params.parentReplyId,
    event.params.commentId,
    post.communityId,
    event.params.postId
  );
}

export function handleEditedComment(event: CommentEdited): void { 
  let commentId = BigInt.fromI32(event.params.commentId);
  let parentReplyId = BigInt.fromI32(event.params.parentReplyId);
  let comment = Comment.load(event.params.postId.toString() + "-" + parentReplyId.toString() + "-" +  commentId.toString());

  if (comment == null) {
    comment = new Comment(event.params.postId.toString() + "-" + parentReplyId.toString() + "-" +  commentId.toString());
    newComment(comment, event.params.postId, parentReplyId, commentId);
  } else {
    addDataToComment(comment, event.params.postId, parentReplyId, commentId);
  }

  createHistory(comment, event, 'Comment', 'Edit');
  comment.save();

  let postId = event.params.postId;
  updatePostContent(postId);

  let post = Post.load(event.params.postId.toString());
  if(post){
    post.lastmod = event.block.timestamp;
    post.save();
  }

  indexingPeriods();
  logTransaction(event,
    event.params.user,
    'CommentEdited',
    event.params.parentReplyId,
    event.params.commentId,
    post.communityId,
    event.params.postId
  );
}

export function handleDeletedComment(event: CommentDeleted): void {
  let commentId = BigInt.fromI32(event.params.commentId);
  let parentReplyId = BigInt.fromI32(event.params.parentReplyId);
  let comment = Comment.load(event.params.postId.toString() + "-" + parentReplyId.toString() + "-" +  commentId.toString());
  if (comment == null) return;

  deleteComment(comment, event.params.postId);
  comment.save();

  let postId = event.params.postId;
  updatePostContent(postId);
  createHistory(comment, event, 'Comment', 'Delete');

  let post = Post.load(event.params.postId.toString());
  if(post){
    post.lastmod = event.block.timestamp;
    post.save();
  }

  indexingPeriods();
  logTransaction(event,
    event.params.user,
    'CommentDeleted',
    event.params.parentReplyId,
    event.params.commentId,
    post.communityId,
    event.params.postId
  );
}

export function indexingPeriods(): void {
  let contractInfo = ContractInfo.load(USER_ADDRESS)
  if (contractInfo == null) {
    contractInfo = new ContractInfo(USER_ADDRESS)
    const periodInfo = getPeeranhaUser().getContractInformation();
    const deployTime = periodInfo.value0
    const periodLength = periodInfo.value1
    contractInfo.deployTime = deployTime;
    contractInfo.periodLength = periodLength;
    contractInfo.lastUpdatePeriod = 0;
    contractInfo.save()
  }

  const period = getPeeranhaUser().getPeriod();
  for (; contractInfo.lastUpdatePeriod <= period; contractInfo.lastUpdatePeriod++) {
    contractInfo.save()
    const lastUpdatePeriod = contractInfo.lastUpdatePeriod;
    let periodStruct = new Period(lastUpdatePeriod.toString());
    periodStruct.startPeriodTime = contractInfo.deployTime.plus(contractInfo.periodLength.times(BigInt.fromI32(lastUpdatePeriod)));
    periodStruct.endPeriodTime = contractInfo.deployTime.plus(contractInfo.periodLength.times(BigInt.fromI32(lastUpdatePeriod + 1)));
    periodStruct.isFinished = false;
    periodStruct.save();  

    const previousPeriod = lastUpdatePeriod - 2;
    if (previousPeriod >= 0) {
      indexingUserReward(previousPeriod);

      let previousPeriodStruct = Period.load(previousPeriod.toString());
      if (previousPeriodStruct != null) {
        previousPeriodStruct.isFinished = true;
        previousPeriodStruct.save();
      }
    }
  }
}

export function indexingUserReward(period: i32): void {
  const activeUsersInPeriod = getPeeranhaUser().getActiveUsersInPeriod(period);
  for (let i = 0; i < activeUsersInPeriod.length; i++) {
    const tokenRewards = getPeeranhaToken().getUserRewardGraph(activeUsersInPeriod[i], period);
    let userReward = new UserReward(period.toString() + '-' + activeUsersInPeriod[i].toHex())
    userReward.tokenToReward = tokenRewards;
    userReward.period = period.toString();
    userReward.user = activeUsersInPeriod[i].toHex();
    userReward.isPaid = false;
    userReward.save();
  }
}

export function handleGetReward(event: GetReward): void {
  const userReward = UserReward.load(BigInt.fromI32(event.params.period).toString() + '-' + event.params.user.toHex());
  if (userReward != null) {
    userReward.isPaid = true;
    userReward.save();
  }

  logTransaction(event, event.params.user, 'GetReward', 0, 0);
}

export function handlerChangedStatusBestReply(event: StatusBestReplyChanged): void {
  let post = Post.load(event.params.postId.toString())
  let previousBestReply = 0;
  if (post == null) {
    post = new Post(event.params.postId.toString())
    newPost(post, event.params.postId, event.block.timestamp);
  } else {
    previousBestReply = post.bestReply;
    post.bestReply = event.params.replyId;
  }
  post.save();
  
  if (previousBestReply) {
    let previousReplyId = previousBestReply;
    let previousReply = Reply.load(event.params.postId.toString() + "-" + previousReplyId.toString())

    if (previousReply == null) {
      newReply(previousReply, event.params.postId, previousReplyId, event.block.timestamp);
    } else {
      previousReply.isBestReply = false;
    }
    updateUserRating(Address.fromString(previousReply.author), post.communityId);
    previousReply.save();
  }

  let reply: Reply | null;
  if (event.params.replyId != 0) {    // fix  (if reply does not exist -> getReply() call erray)
    let replyId = event.params.replyId;
    reply = Reply.load(event.params.postId.toString() + "-" + replyId.toString())

    if (reply == null) {
      newReply(reply, event.params.postId, replyId, event.block.timestamp);
    }

    reply.isBestReply = true;
    if (reply.author != post.author) {
      updateUserRating(Address.fromString(reply.author), post.communityId);
    }
    reply.save();
  }
  if (reply.author != post.author) {
    updateUserRating(Address.fromString(post.author), post.communityId);
  }

  indexingPeriods();
  logTransaction(
    event,
    event.params.user,
    'StatusBestReplyChanged',
    event.params.replyId,
    0,
    post.communityId,
    event.params.postId
  );
}

export function handlerForumItemVoted(event: ForumItemVoted): void {    //  move this in another function with edit
  let post = Post.load(event.params.postId.toString());
  if (event.params.commentId != 0) {
    let commentId = BigInt.fromI32(event.params.commentId);
    let replyId = BigInt.fromI32(event.params.replyId);
    let comment = Comment.load(event.params.postId.toString() + "-" + replyId.toString() + "-" +  commentId.toString());

    if (comment == null) {
      comment = new Comment(event.params.postId.toString() + "-" + replyId.toString() + "-" +  commentId.toString());
      newComment(comment, event.params.postId, replyId, commentId);
    } else {
      let peeranhaComment = getPeeranhaContent().getComment(event.params.postId, replyId.toI32(), commentId.toI32());
      if (peeranhaComment == null) return;
      comment.rating = peeranhaComment.rating;
    }
    comment.save();
    
  } else if (event.params.replyId != 0) {
    let replyId = event.params.replyId;
    let reply = Reply.load(event.params.postId.toString() + "-" + replyId.toString())

    if (reply == null) {
      reply = new Reply(event.params.postId.toString() + "-" + replyId.toString());
      newReply(reply, event.params.postId, replyId, event.block.timestamp);
    } else {
      let peeranhaReply = getPeeranhaContent().getReply(event.params.postId, replyId);
      if (peeranhaReply == null) return;
      reply.rating = peeranhaReply.rating;
    }

    reply.save();
    post = Post.load(reply.postId.toString())
    updateUserRating(Address.fromString(reply.author), post.communityId);
    updateUserRating(event.params.user, post.communityId);
  } else {
    if (post == null) {
      post = new Post(event.params.postId.toString())
      newPost(post, event.params.postId, event.block.timestamp);
    } else {
      let peeranhaPost = getPeeranhaContent().getPost(event.params.postId);
      if (peeranhaPost == null) return;
      post.rating = peeranhaPost.rating;
    }

    post.save();
    updateUserRating(Address.fromString(post.author), post.communityId);
    updateUserRating(event.params.user, post.communityId);
  }

  indexingPeriods();
  logTransaction(
    event,
    event.params.user,
    FORUM_ITEM_VOTED_EVENT, 
    event.params.replyId,
    0,
    post.communityId,
    event.params.postId
  );
}

export function handlerSetDocumentationTree(event: SetDocumentationTree): void {
  const oldDocumentation = CommunityDocumentation.load(event.params.communityId.toString());

  let communityDocumentation = getPeeranhaContent().getDocumentationTree(event.params.communityId);

  if (communityDocumentation.hash == new Address(0))
    return;

  let oldDocumentationIpfsHash: Bytes | null = null;
  if (oldDocumentation != null){
    if(oldDocumentation.ipfsHash == communityDocumentation.hash){
      return;
    }
    oldDocumentationIpfsHash = oldDocumentation.ipfsHash;
  }

  const documentation = new CommunityDocumentation(event.params.communityId.toString());
  documentation.ipfsHash = communityDocumentation.hash;
  documentation.save();

  generateDocumentationPosts(
    event.params.communityId,
    event.params.userAddr,
    event.block.timestamp,
    oldDocumentationIpfsHash,
    communityDocumentation.hash
  );
  
  logTransaction(event, event.params.userAddr, 'SetDocumentationTree', 0, 0, event.params.communityId);
}

function logTransaction(
  event: ethereum.Event,
  actionUser: Address,
  eventName: string,
  replyId: i32,
  commentId: i32,
  communityId: BigInt | null = null,
  postId: BigInt | null = null
): void {
  let stat = new Statistic(event.transaction.hash.toHex());

  stat.transactionHash = event.transaction.hash;
  stat.eventName = eventName;
  stat.timeStamp = event.block.timestamp;
  stat.actionUser = actionUser.toHex();

  stat.communityId = communityId;
  stat.postId = postId;
  stat.replyId = replyId;
  stat.commentId = commentId;
  stat.voteDirection =
    eventName === FORUM_ITEM_VOTED_EVENT
      ? event.parameters[4].value.toI32()
      : 0;

  stat.save();
}

export function handlerCreatedTranslation(event: TranslationCreated): void {
  const itemLanguage = BigInt.fromI32(event.params.language);
  const postId = event.params.postId;
  const replyId = BigInt.fromI32(event.params.replyId);
  const commentId = BigInt.fromI32(event.params.commentId);

  if (commentId != BigInt.fromI32(0)) {
    let commentTranslation = new CommentTranslation(postId.toString() + "-" + replyId.toString() + "-" + commentId.toString() + "-" + itemLanguage.toString());
    newCommentTranslation(commentTranslation, postId, replyId, commentId, itemLanguage)
    commentTranslation.save();
    
  } else if (replyId != BigInt.fromI32(0)) {
    let replyTranslation = new ReplyTranslation(postId.toString() + "-" + replyId.toString() + "-0-" + itemLanguage.toString());
    newReplyTranslation(replyTranslation, postId, replyId, itemLanguage)
    replyTranslation.save();

  } else { 
    let postTranslation = new PostTranslation(postId.toString() + "-0-0-" + itemLanguage.toString());
    newPostTranslation(postTranslation, postId, itemLanguage)
    postTranslation.save();
  }
  indexingPeriods();
}

export function handlerEditTranslation(event: TranslationEdited): void {
  const itemLanguage = BigInt.fromI32(event.params.language);
  const postId = event.params.postId;
  const replyId = BigInt.fromI32(event.params.replyId);
  const commentId = BigInt.fromI32(event.params.commentId);

  if (commentId != BigInt.fromI32(0)) {
    let commentTranslation = new CommentTranslation(postId.toString() + "-" + replyId.toString() + "-" + commentId.toString() + "-" + itemLanguage.toString());
    addDataToCommentTranslation(commentTranslation, postId, replyId, commentId, itemLanguage)
    commentTranslation.save();

  } else if (replyId != BigInt.fromI32(0)) {
    let replyTranslation = new ReplyTranslation(postId.toString() + "-" + replyId.toString() + "-0-" + itemLanguage.toString());
    addDataToReplyTranslation(replyTranslation, postId, replyId, itemLanguage)
    replyTranslation.save();

  } else {  
    let postTranslation = new PostTranslation(postId.toString() + "-0-0-" + itemLanguage.toString());
    addDataToPostTranslation(postTranslation, postId, itemLanguage)
    postTranslation.save();
  }
  updatePostContent(postId);
  indexingPeriods();
}

export function handlerDeleteTranslation(event: TranslationDeleted): void {
  const itemLanguage = BigInt.fromI32(event.params.language);
  const postId = event.params.postId;
  const replyId = BigInt.fromI32(event.params.replyId);
  const commentId = BigInt.fromI32(event.params.commentId);

  if (commentId != BigInt.fromI32(0)) {
    let id = postId.toString() + "-" + replyId.toString() + "-" + commentId.toString() + "-" + itemLanguage.toString();
    store.remove('CommentTranslation', id);

  } else if (replyId != BigInt.fromI32(0)) {
    let id = postId.toString() + "-" + replyId.toString() + "-0-" + itemLanguage.toString();
    store.remove('ReplyTranslation', id);

  } else {  
    let id = postId.toString() + "-0-0-" + itemLanguage.toString();
    store.remove('PostTranslation', id);
  }
  updatePostContent(postId);
  indexingPeriods();
}
