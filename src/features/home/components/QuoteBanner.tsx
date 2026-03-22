import { useRandomQuote } from "../hooks/useRandomQuote";

export function QuoteBanner() {
  const { quote, loading, error } = useRandomQuote();

  return (
    <section
      className="
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
        "
    >
      {loading && (
        <p className="font-inter text-text-secondary text-sm animate-pulse">명언을 불러오는 중…</p>
      )}

      {!loading && error && (
        <p className="font-inter text-text-secondary text-sm text-center">{error}</p>
      )}

      {!loading && !error && quote && (
        <>
          <p className="font-playfair italic text-text-primary text-xl text-center max-w-3xl">
            &ldquo;{quote.content}&rdquo;
          </p>
          <p className="mt-4 font-inter italic text-text-secondary text-center">
            {[quote.author, quote.source].filter(Boolean).join(", ")}
          </p>
        </>
      )}
    </section>
  );
}
