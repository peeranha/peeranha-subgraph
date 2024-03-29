import { Bytes, BigInt, JSONValueKind } from '@graphprotocol/graph-ts'
import { Community, Tag, CommunityTranslation, TagTranslation } from '../generated/schema'
import { bytesToJson, convertIpfsHash, getPeeranhaCommunity, idToIndexId, indexIdToId, Network } from './utils'
import { ERROR_IPFS, isValidIPFS } from "./utils";
import { store } from '@graphprotocol/graph-ts'

export function newCommunity(community: Community, communityId: BigInt): void {
  let peeranhaCommunity = getPeeranhaCommunity().getCommunity(communityId);
  if (!peeranhaCommunity) return;

  community.creationTime = peeranhaCommunity.timeCreate;
  community.isFrozen = peeranhaCommunity.isFrozen;
  community.postCount = 0;
  community.documentationCount = 0;
  community.deletedPostCount = 0;
  community.replyCount = 0;
  community.followingUsers = 0;
  community.translations = [];
  community.networkId = Network.Polygon;
  addDataToCommunity(community, communityId);
  
  let peeranhaTags = getPeeranhaCommunity().getTags(communityId);
  if (peeranhaTags.length == 0) return;

  community.tagsCount = peeranhaTags.length;
  for (let i = 1; i <= peeranhaTags.length; i++) {
    let tag = new Tag(idToIndexId(Network.Polygon, communityId.toString()) + '-' + i.toString());
    tag.communityId = idToIndexId(Network.Polygon, communityId.toString());
    newTag(tag, communityId, BigInt.fromI32(i))
    tag.save();
  }
}

export function addDataToCommunity(community: Community, communityId: BigInt): void {
  let peeranhaCommunity = getPeeranhaCommunity().getCommunity(communityId);
  if (peeranhaCommunity == null) return;
  
  community.ipfsHash = peeranhaCommunity.ipfsDoc.hash;
  community.ipfsHash2 = peeranhaCommunity.ipfsDoc.hash2;

  getIpfsCommunityData(community);
}

function getIpfsCommunityData(community: Community): void {  
  let result = convertIpfsHash(community.ipfsHash as Bytes);
  if (!result) return;
  let ipfsData = bytesToJson(result);

  if (ipfsData && isValidIPFS(ipfsData)) {
    let ipfsObj = ipfsData.toObject()
    let name = ipfsObj.get('name');
    if (name && !name.isNull() && name.kind == JSONValueKind.STRING) {
      community.name = name.toString();
    }

    let description = ipfsObj.get('description');
    if (description && !description.isNull() && description.kind == JSONValueKind.STRING) {
      community.description = description.toString();
    }

    let website = ipfsObj.get('website');
    if (website && !website.isNull() && website.kind == JSONValueKind.STRING) {
      community.website = website.toString();
    }

    let communitySite = ipfsObj.get('communitySite');
    if (communitySite && !communitySite.isNull()) {
      community.communitySite = communitySite.toString();
    }

    let language = ipfsObj.get('language');
    if (language&& !language.isNull() && language.kind == JSONValueKind.STRING) {
      community.language = language.toString();
    }

    let avatar = ipfsObj.get('avatar');
    if (avatar && !avatar.isNull() && avatar.kind == JSONValueKind.STRING) {
      community.avatar = avatar.toString();
    }

    let oldCommunityTranslations = community.translations;
    let translations = ipfsObj.get('translations');
    community.translations = [];
    if (translations && !translations.isNull() && translations.kind == JSONValueKind.ARRAY) {
      const translationsArray = translations.toArray();
      const translationsLength = translationsArray.length;

      for (let i = 0; i < translationsLength; i++) {
        const translationsObject = translationsArray[i].toObject();
        const name = translationsObject.get("name");
        const enableAutotranslation = translationsObject.get("enableAutotranslation");
        const description = translationsObject.get("description");
        const translationLanguage = translationsObject.get("language");

        if (!translationLanguage || translationLanguage.isNull() || translationLanguage.kind != JSONValueKind.STRING) { continue; }

        let communityTranslation = CommunityTranslation.load(community.id + "-" + translationLanguage.toString());
        if (communityTranslation == null) {
          communityTranslation = new CommunityTranslation(community.id + "-" + translationLanguage.toString());
        }
        let communityTranslations = community.translations;
        communityTranslations.push(communityTranslation.id);
        community.translations = communityTranslations;
          
        if (name && !name.isNull() && name.kind == JSONValueKind.STRING) {
          communityTranslation.name = name.toString();
        }
        if (description && !description.isNull() && description.kind == JSONValueKind.STRING) {
          communityTranslation.description = description.toString();
        }
        if (enableAutotranslation && !enableAutotranslation.isNull() && enableAutotranslation.kind == JSONValueKind.BOOL) {
          communityTranslation.enableAutotranslation = enableAutotranslation.toBool();
        }

        communityTranslation.language = translationLanguage.toString();
        communityTranslation.communityId = community.id;
        communityTranslation.save();
      }
    }

    // remove old community translations
    let oldCommunityTranslationsLength = oldCommunityTranslations.length;
    for (let i = 0; i < oldCommunityTranslationsLength; i++) {
      let oldCommunityTranslation = oldCommunityTranslations.pop();
      if(oldCommunityTranslation && !community.translations.includes(oldCommunityTranslation)) {
        store.remove('CommunityTranslation', oldCommunityTranslation);
      }
    }
  } else {
    community.name = ERROR_IPFS;
    community.description = ERROR_IPFS;
    community.website = ERROR_IPFS;
    community.avatar = ERROR_IPFS;
  }
}

export function newTag(tag: Tag, communityId: BigInt, tagId: BigInt): void {
  tag.communityId = idToIndexId(Network.Polygon, communityId.toString());
  tag.postCount = 0;
  tag.translations = [];
  tag.deletedPostCount = 0;
  tag.name = '';
  
  addDataToTag(tag, communityId, tagId);
}

export function addDataToTag(tag: Tag, communityId: BigInt, tagId: BigInt): void {
  let peeranhaTag = getPeeranhaCommunity().getTag(communityId, tagId.toI32());
  if (!peeranhaTag) return;
  
  tag.ipfsHash = peeranhaTag.ipfsDoc.hash;
  tag.ipfsHash2 = peeranhaTag.ipfsDoc.hash2;

  getIpfsTagData(tag);
}

function getIpfsTagData(tag: Tag): void { 
  let result = convertIpfsHash(tag.ipfsHash as Bytes);
  if (!result) return;
  
  let ipfsData = bytesToJson(result);
  if (ipfsData && isValidIPFS(ipfsData)) {
    let ipfsObj = ipfsData.toObject()
  
    let name = ipfsObj.get('name');
    if (name && !name.isNull() && name.kind == JSONValueKind.STRING) {
      tag.name = name.toString();
    }

    let description = ipfsObj.get('description');
    if (description && !description.isNull() && description.kind == JSONValueKind.STRING) {
      tag.description = description.toString();
    }

    let language = ipfsObj.get('language');
    if (language && !language.isNull() && language.kind == JSONValueKind.STRING) {
      tag.language = language.toString();
    }

    let oldTagTranslations = tag.translations;
    let translations = ipfsObj.get('translations');
    tag.translations = [];
    if (translations && !translations.isNull() && translations.kind == JSONValueKind.ARRAY) {
      const translationsArray = translations.toArray();
      const translationsLength = translationsArray.length;
  
      for (let i = 0; i < translationsLength; i++) {
        const translationsObject = translationsArray[i].toObject();
        const name = translationsObject.get("name");
        const description = translationsObject.get("description");
        const translationLanguage = translationsObject.get("language");
        if (!translationLanguage || translationLanguage.isNull() || translationLanguage.kind != JSONValueKind.STRING) { continue; }

        let tagTranslation = TagTranslation.load(tag.id + "-" + translationLanguage.toString());
        if (tagTranslation == null) {
          tagTranslation = new TagTranslation(tag.id + "-" + translationLanguage.toString());
        }
        let tagTranslations = tag.translations;
        tagTranslations.push(tagTranslation.id);
        tag.translations = tagTranslations;

        if (name && !name.isNull() && name.kind == JSONValueKind.STRING) {
          tagTranslation.name = name.toString();
        } else {
          tagTranslation.name = '';
        }
        if (description && !description.isNull() && description.kind == JSONValueKind.STRING) {
          tagTranslation.description = description.toString();
        }

        tagTranslation.tagId = tag.id;
        tagTranslation.language = translationLanguage.toString();
        tagTranslation.save();
      }
    }

    // remove old tag translations
    let oldTagTranslationsLength = oldTagTranslations.length;
    for (let i = 0; i < oldTagTranslationsLength; i++) {
      let oldTagTranslation = oldTagTranslations.pop();
      if(oldTagTranslation && !tag.translations.includes(oldTagTranslation)) {
        store.remove('TagTranslation', oldTagTranslation);
      }
    }

  } else {
    tag.name = ERROR_IPFS;
    tag.description = ERROR_IPFS;
  }
}

export function getCommunity(communityId: string): Community {
  let community = Community.load(communityId)
  if (!community) {
    community = new Community(communityId.toString());
    newCommunity(community, BigInt.fromString(indexIdToId(communityId)));
  }
  return community
}
