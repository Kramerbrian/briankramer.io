function renderParagraph(text: string, key: number) {
  return (
    <p key={key} className="my-5 text-base leading-relaxed text-ink-muted md:text-lg">
      {text}
    </p>
  );
}

function renderHeading(text: string, key: number) {
  return (
    <h2 key={key} className="mt-14 mb-4 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
      {text}
    </h2>
  );
}

export function EssayBody({ body }: { body: string }) {
  const blocks = body.split('\n\n').filter(Boolean);

  return (
    <div className="prose max-w-none">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return renderHeading(block.replace(/^## /, ''), i);
        }
        return renderParagraph(block, i);
      })}
    </div>
  );
}
