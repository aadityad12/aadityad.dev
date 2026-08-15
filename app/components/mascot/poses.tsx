import { BaseBody, MascotFrame, OpenEye, P, Pupil } from "./Mascot";

/* Five poses of the same critter. Same proportions, same eye, same antenna —
   only the arms and small props change. Pupils carry className="mascot-pupil"
   in the hero so the cursor-follow effect can find it. */

export function MascotHero() {
  return (
    <MascotFrame label="A small hand-drawn machine critter waving hello" className="mascot-hero">
      <BaseBody />
      <OpenEye />
      {/* left arm resting */}
      <P d="M 72 130 C 64 136 60 144 61 152" delay={700} speed={350} />
      {/* right arm raised, waving */}
      <P d="M 168 121 C 180 113 188 103 192 91" delay={750} speed={400} />
      <P d="M 192 91 C 190 84 197 79 201 84" delay={1100} speed={250} />
      {/* heart-bolt on the chassis */}
      <P
        d="M 98 160 C 96 155 89 156 90 161 C 90 165 95 167 98 170 C 101 167 106 165 106 161 C 107 156 100 155 98 160"
        delay={1250}
        speed={400}
        accent
      />
      <Pupil cx={122} cy={130} className="mascot-pupil" />
    </MascotFrame>
  );
}

export function MascotHolding() {
  return (
    <MascotFrame label="The machine critter holding up a small parcel">
      <BaseBody />
      <OpenEye />
      {/* both arms reaching up to the parcel */}
      <P d="M 74 118 C 63 108 56 98 55 86" delay={700} speed={400} />
      <P d="M 166 118 C 177 108 184 98 185 86" delay={750} speed={400} />
      {/* parcel above the head */}
      <P d="M 88 78 C 87 65 89 54 91 46 C 105 43 135 43 149 46 C 151 55 152 66 151 78" delay={1000} speed={500} />
      <P d="M 91 46 C 100 40 112 38 120 44 C 128 38 140 40 149 46" delay={1300} speed={350} accent />
      <Pupil cx={120} cy={126} />
    </MascotFrame>
  );
}

export function MascotPeeking() {
  return (
    <MascotFrame label="The machine critter peeking over a line">
      {/* ledge it grips */}
      <P d="M 20 168 C 90 165 160 165 220 168" delay={0} speed={500} />
      {/* top of the chassis only */}
      <P d="M 74 168 C 72 130 76 100 85 92 C 108 86 148 87 156 92 C 165 101 168 131 166 168" delay={250} speed={700} />
      <P d="M 98 88 C 112 84 130 85 143 88" delay={600} speed={300} />
      <P d="M 120 84 C 118 75 121 66 120 59 M 120 59 C 111 57 111 44 121 44 C 131 45 129 58 120 59" delay={700} speed={500} />
      {/* gripping hands */}
      <P d="M 84 168 C 84 160 92 160 92 168" delay={900} speed={250} />
      <P d="M 148 168 C 148 160 156 160 156 168" delay={950} speed={250} />
      {/* wide curious eye */}
      <P d="M 121 106 C 136 106 146 116 146 130 C 146 144 135 154 120 154 C 105 154 95 143 95 129 C 95 115 106 106 121 106" delay={1050} speed={500} />
      <Pupil cx={121} cy={128} r={8} delay={1500} />
    </MascotFrame>
  );
}

export function MascotWorking() {
  return (
    <MascotFrame label="The machine critter tinkering with a wrench">
      <BaseBody />
      <OpenEye />
      {/* left arm steadying */}
      <P d="M 72 132 C 64 138 61 146 62 154" delay={700} speed={350} />
      {/* right arm holding a wrench */}
      <P d="M 168 128 C 178 132 186 140 191 148" delay={750} speed={400} />
      <P d="M 191 148 C 198 141 206 143 209 150 M 209 150 C 213 143 207 135 199 137" delay={1050} speed={450} />
      {/* sweat drop of honest effort, floating beside the head */}
      <P d="M 56 78 C 53 83 56 87 59 84 C 61 82 59 78 56 78" delay={1350} speed={300} accent />
      <Pupil cx={124} cy={132} />
    </MascotFrame>
  );
}

export function MascotWave() {
  return (
    <MascotFrame label="The machine critter waving goodbye">
      <BaseBody />
      <OpenEye />
      {/* left arm high, waving */}
      <P d="M 72 120 C 60 111 53 100 50 88" delay={700} speed={400} />
      <P d="M 50 88 C 47 81 54 76 58 81" delay={1050} speed={250} />
      {/* right arm resting */}
      <P d="M 168 132 C 176 138 180 146 179 154" delay={750} speed={350} />
      {/* heart-bolt */}
      <P
        d="M 98 160 C 96 155 89 156 90 161 C 90 165 95 167 98 170 C 101 167 106 165 106 161 C 107 156 100 155 98 160"
        delay={1250}
        speed={400}
        accent
      />
      <Pupil cx={120} cy={128} />
    </MascotFrame>
  );
}
