import React, { useContext } from 'react'
import Link from 'next/link'
import { truncateWithEllipses } from '@/lib/utilities'
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import FollowButton from './FollowButton'
import AppContext from '@/context/app-context'

export default function CreatorSummary({ name, username, address, imageUrl, closeModal, bio, collectionSlug, isCollection, profileId }) {
	const context = useContext(AppContext)
	return (
		<>
			<div>
				<Link href={collectionSlug ? '/c/[collection]' : '/[profile]'} as={collectionSlug ? `/c/${collectionSlug}` : username ? `/${username}` : `/${address}`}>
					<a onClick={closeModal}>
						<img alt={name} src={imageUrl ? imageUrl : 'https://storage.googleapis.com/opensea-static/opensea-profile/4.png'} className="rounded-full mr-1 inline-block" style={{ height: 64, width: 64 }} />
					</a>
				</Link>
			</div>
			<div className="flex flex-col md:flex-row md:items-center flex-wrap">
				<Link href={collectionSlug ? '/c/[collection]' : '/[profile]'} as={collectionSlug ? `/c/${collectionSlug}` : username ? `/${username}` : `/${address}`}>
					<a onClick={closeModal}>
						<p className="text-xl md:text-3xl py-2 inline-block hover:text-stpink mr-3">{truncateWithEllipses(name, 24)}</p>
					</a>
				</Link>
				{!isCollection && profileId && context.myProfile?.profile_id !== profileId && (
					<div className="flex items-center w-1/2 md:w-max py-2">
						<FollowButton item={{ profile_id: profileId, follower_count: 0 }} followerCount={0} setFollowerCount={() => {}} />
					</div>
				)}
			</div>
			{bio && <div className="pb-4 pt-2 text-gray-500">{bio}</div>}
			{/* <Link
        href={collectionSlug ? "/c/[collection]" : "/[profile]"}
        as={
          collectionSlug
            ? `/c/${collectionSlug}`
            : username
            ? `/${username}`
            : `/${address}`
        }
      >
        <a onClick={closeModal}>
          <div className="px-4 py-2 mt-2 border-2 border-gray-300 rounded-full rounded-xl flex items-center justify-center w-max text-gray-300 hover:border-stpink hover:text-stpink transition-all">
            <span className="mr-2 text-black">
              {collectionSlug ? "Collection" : "Creator Profile"}
            </span>
            <FontAwesomeIcon
              style={{
                height: 18,
                width: 18,
              }}
              icon={faArrowRight}
              color="inherit"
            />
          </div>
        </a>
      </Link> */}
		</>
	)
}
