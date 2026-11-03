export const methods = [
  {
    id: "acoustic",
    label: "Acoustic detection",
    title: "Acoustic leak detection",
    description:
      "Specialist listening equipment helps identify sounds produced by escaping water in pressurised pipework.",
    uses: [
      "Water lines under lawns, paths or driveways",
      "Concealed pipework in walls or under floors",
      "Often a first step to narrow the search",
    ],
    note: "Site noise, depth, pipe materials and ground conditions can affect results.",
  },
  {
    id: "nitrogen",
    label: "Nitrogen pressure testing",
    title: "Nitrogen pressure testing",
    description:
      "Nitrogen may be introduced in a controlled test to assess pipework and help locate difficult leaks.",
    uses: [
      "When conventional detection is inconclusive",
      "Confirming whether a section holds pressure",
      "Making a quiet leak easier to hear",
    ],
    note: "Suitability depends on the pipework and the ability to isolate sections safely.",
  },
  {
    id: "tracer-gas",
    label: "Tracer gas detection",
    title: "Tracer gas detection",
    description:
      "A specialist tracer gas is introduced into suitable pipework and detected with dedicated sensing equipment.",
    uses: [
      "Small leaks too quiet to hear",
      "Pipes under concrete, pavers or long runs of lawn",
      "Where the gas can reach the surface",
    ],
    note: "Ground cover and soil type affect how the gas travels.",
  },
  {
    id: "thermal",
    label: "Thermal imaging",
    title: "Thermal imaging",
    description:
      "A thermal camera detects surface temperature differences that may indicate moisture or a hidden plumbing issue.",
    uses: [
      "Warm spots in floors, damp patches on walls",
      "Hot water lines inside slabs or walls",
      "Supporting findings from other methods",
    ],
    note: "Thermal imaging supports an investigation but doesn't prove a leak on its own.",
  },
  {
    id: "locating",
    label: "Pipe & service locating",
    title: "Underground pipe & service locating",
    description:
      "Electronic locating equipment traces suitable underground services and likely service routes.",
    uses: [
      "When nobody knows where the service runs",
      "Before excavation or concrete cutting",
      "Mapping larger residential and commercial sites",
    ],
    note: "Findings are indicative and should be verified before excavation.",
  },
] satisfies {
  id: "acoustic" | "nitrogen" | "tracer-gas" | "thermal" | "locating";
  label: string;
  title: string;
  description: string;
  uses: string[];
  note: string;
}[];

export type MethodKind = (typeof methods)[number]["id"];
