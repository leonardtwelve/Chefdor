import { Fragment, type ReactNode } from "react";

/**
 * Markdown léger : seul **gras** est interprété. Les retours à la ligne
 * sont préservés via <br />. Pas de HTML injecté — sortie React safe.
 */
export function renderLightMarkdown(input: string): ReactNode {
  const lines = input.split("\n");
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return (
      <Fragment key={lineIdx}>
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="font-medium text-brown">{part.slice(2, -2)}</strong>;
          }
          return <Fragment key={i}>{part}</Fragment>;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </Fragment>
    );
  });
}
