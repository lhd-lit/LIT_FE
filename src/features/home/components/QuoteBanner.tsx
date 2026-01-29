export function QuoteBanner(){

    return(

        <section className="
            flex 
            flex-col 
            justify-center 
            items-center 
            p-8
            bg-background-light/30
            border-2
            border-border
            rounded-2xl
            shadow-lg
            m-8
        ">

            <p className="font-playfair italic text-text-primary text-xl">
                "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment."
            </p>

            <p className="mt-4 font-inter italic text-text-secondary">
                Ralph Waldo Emerson, Self-Reliance (1841)
            </p>

        </section>
    )
}