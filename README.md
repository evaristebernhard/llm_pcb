# LLM PCB resistance tester

This repository contains a tscircuit source design for a digital auto-ranging resistance tester PCB concept.

The current design is implemented in `src/resistance-tester.tsx`. Running `npm run build` creates the generated circuit output at `dist/circuit.json`; generated outputs are intentionally ignored by git.

This project is a circuit/layout concept for iteration in tscircuit, not a manufacturability claim. See `docs/resistance-tester.md` for the measurement strategy and firmware notes.
