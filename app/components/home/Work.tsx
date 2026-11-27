import { MORE, NOTES, STAGE } from "../../content";
import { Plate } from "./Artifacts";
import type { Project } from "../../plates";
import MoreWork, { type Row } from "./MoreWork";
import WorkStage, { type StageItem } from "./WorkStage";

export default function Work() {
  const byId = new Map(NOTES.map((n) => [n.id, n]));
  const items: StageItem[] = STAGE.flatMap(({ id, tag, plate }) => {
    const n = byId.get(id);
    if (!n) return [];
    return [
      {
        id,
        title: n.title,
        tag,
        hook: n.hook,
        roles: n.roles ?? [],
        value: `${n.headline.value}${n.headline.unit ? ` ${n.headline.unit}` : ""}`,
        label: n.headline.label,
        visual: <Plate id={id as Project} plate={plate} />,
      },
    ];
  });
  const flagships = new Set(STAGE.map((s) => s.id));
  const rows: Row[] = [
    ...NOTES.filter((n) => !flagships.has(n.id))
      .sort((a, b) => a.order - b.order)
      .map((n) => ({ key: n.id, title: n.title, text: n.oneLiner, tag: n.award ?? n.context, href: `/work/${n.id}/`, external: false, roles: n.roles ?? [] })),
    ...MORE.map((m) => ({ key: m.title, title: m.title, text: m.text, tag: m.tag, href: m.href, external: true, roles: (m.roles ?? []) as string[] })),
  ];

  return (
    <section id="work" className="section wrap">
      <WorkStage items={items} />
      <MoreWork rows={rows} />
    </section>
  );
}
