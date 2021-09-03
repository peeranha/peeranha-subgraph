import { ByteArray } from '@graphprotocol/graph-ts'
import { json, Bytes, ipfs, BigInt } from '@graphprotocol/graph-ts'
import { Community, Tag } from '../generated/schema'
import { getPeeranha } from './utils'

export function newCommunity(community: Community | null, communityId: BigInt): void {
  const peeranhaCommunity = getPeeranha().getCommunity(communityId);
  if (peeranhaCommunity == null) return;

  community.creationTime = peeranhaCommunity.timeCreate;
  community.isFrozen = peeranhaCommunity.isFrozen;
  community.postCount = 0;

  const peeranhaTags = getPeeranha().getTags(communityId);
  if (peeranhaTags.length == 0) return;

  for (let i = 0; i < peeranhaTags.length; i++) {
    let tag = new Tag(communityId.toString() + "-" + i.toString());
    tag.communityId = communityId;
    newTag(tag, communityId, BigInt.fromI32(i))
    tag.save();
  }

   addDataToCommunity(community, communityId);
}

export function addDataToCommunity(community: Community | null, communityId: BigInt): void {
  const peeranhaCommunity = getPeeranha().getCommunity(communityId);
  if (peeranhaCommunity == null) return;
  
  community.ipfsHash = peeranhaCommunity.ipfsDoc.hash;
  community.ipfsHash2 = peeranhaCommunity.ipfsDoc.hash2;

  getIpfsCommunityData(community);
}

function getIpfsCommunityData(community: Community | null): void {  
  let hashstr = community.ipfsHash.toHexString();
  let hashHex = "1220" + hashstr.slice(2);
  let ipfsBytes = ByteArray.fromHexString(hashHex);
  let ipfsHashBase58 = ipfsBytes.toBase58();
  let result = ipfs.cat(ipfsHashBase58) as Bytes;
  
  if (result != null) {
    let ipfsData = json.fromBytes(result);
  
    if(!ipfsData.isNull()) {
      let ipfsObj = ipfsData.toObject()
      let title = ipfsObj.get('title');
      if (!title.isNull()) {
        community.title = title.toString();
      }
  
      let description = ipfsObj.get('description');
      if (!description.isNull()) {
        community.description = description.toString();
      }
  
      let website = ipfsObj.get('website');
      if (!website.isNull()) {
        community.website = website.toString();
      }
  
      let language = ipfsObj.get('language');
      if (!language.isNull()) {
        community.language = language.toString();
      }
    }
  }
}

export function newTag(tag: Tag | null, communityId: BigInt, tagId: BigInt): void {
  addDataToTag(tag, communityId, tagId);
}

export function addDataToTag(tag: Tag | null, communityId: BigInt, tagId: BigInt): void {   // tagId: BigInt -> number?
  // const peeranhaTag = getPeeranha().getTag(communityId, tagId);                        //add action
  // if (peeranhaTag == null) return;
  
  // tag.ipfsHash = peeranhaTag.ipfsDoc.hash;
  // tag.ipfsHash2 = peeranhaTag.ipfsDoc.hash2;

  // getIpfsCommunityData(tag);
}



function getIpfsTagData(tag: Tag | null): void { 
  let hashstr = tag.ipfsHash.toHexString();
  let hashHex = "1220" + hashstr.slice(2);
  let ipfsBytes = ByteArray.fromHexString(hashHex);
  let ipfsHashBase58 = ipfsBytes.toBase58();
  let result = ipfs.cat(ipfsHashBase58) as Bytes;
  
  if (result != null) {
    let ipfsData = json.fromBytes(result);
  
    if(!ipfsData.isNull()) {
      let ipfsObj = ipfsData.toObject()
    
      let title = ipfsObj.get('title');
      if (!title.isNull()) {
        tag.title = title.toString();
      }
  
      let description = ipfsObj.get('description');
      if (!description.isNull()) {
        tag.description = description.toString();
      }
    }
  }
}