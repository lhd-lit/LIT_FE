import membersIcon from "../../../shared/assets/membersIcon.svg"
import commentsIcon from "../../../shared/assets/commentsIcon.svg"

type CardMetaDataProps = {

    members: number;
    comments: number;

}

export function CardMetaData({ members, comments } : CardMetaDataProps){

    return(

        <div className="flex items-center gap-2 mt-2">

            <div className="flex flex-row">
                <img src={membersIcon} className="mr-1"/>
                <span className="font-inter text-xs text-[#6B5D4F]">
                    {members} members
                </span>
            </div>

            <div className="flex flex-row">
                <img src={commentsIcon} className="mr-1"/>
                <span className="font-inter text-xs text-[#6B5D4F]">
                    {comments} comments
                </span>
            </div>

        </div>

    )

}
