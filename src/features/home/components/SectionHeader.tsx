

type SectionHeaderProps={
    icon: string;
    title: string;
    description: string;
}

export function SectionHeader( { icon, title, description }: SectionHeaderProps){

    return(

        <div className="
            flex
            justify-between
            px-8
            py-6
            border-b
            border-border
            w-full">
            
            <div className="flex items-center gap-4">
                
                <img src={icon} className="w-5 h-5"/>
                <div className="flex flex-col">
                    <h2 className="font-playfair text-xl text-text-primary">{title}</h2>

                    <p className="text-text-secondary text-sm">{description}</p>
                </div>
            </div>
            
            <div>
                <button className="
                    flex items-center
                    bg-primary
                    rounded-lg
                    justify-center
                    text-background
                    px-3
                    py-1.5
                    mt-4
                    ">
                    View All
                </button>
            </div>

        </div>

    )


}